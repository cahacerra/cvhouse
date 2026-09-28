-- Catarina & Vitor — Chá de Panela
-- Initial schema: tables, RLS policies, transactional reservation
-- functions and storage buckets.
--
-- Run this once against a fresh Supabase project (SQL editor, or
-- `supabase db push` / `psql` — see README.md "Configurar o banco de
-- dados"). It is safe to re-run: every statement is guarded so it will not
-- fail on an already-initialized database.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists event_settings (
  id int primary key default 1,
  couple_names text not null default 'Catarina & Vitor',
  event_name text not null default 'Chá de Panela',
  opening_title text not null default 'Catarina & Vitor',
  opening_subtitle text not null default 'Nosso novo capítulo',
  event_date date,
  event_time time,
  location_name text,
  address text,
  maps_url text,
  instagram text,
  final_message text not null default
    'Obrigada por fazer parte deste começo. Que cada detalhe desta casa carregue um pouco do carinho de quem esteve conosco quando tudo começou.',
  updated_at timestamptz not null default now(),
  constraint event_settings_single_row check (id = 1)
);
insert into event_settings (id) values (1) on conflict (id) do nothing;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists gifts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category_id uuid references categories (id) on delete set null,
  price numeric(10, 2) not null default 0 check (price >= 0),
  store_name text,
  product_url text,
  image_url text,
  quantity_total int not null default 1 check (quantity_total >= 1),
  quantity_reserved int not null default 0 check (quantity_reserved >= 0),
  featured boolean not null default false,
  display_order int not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  is_test boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gifts_reserved_lte_total check (quantity_reserved <= quantity_total)
);
create index if not exists gifts_status_idx on gifts (status);
create index if not exists gifts_category_idx on gifts (category_id);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references gifts (id) on delete cascade,
  guest_name text not null,
  message text,
  quantity int not null default 1 check (quantity >= 1),
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists reservations_gift_idx on reservations (gift_id);

create table if not exists site_photos (
  key text primary key,
  image_url text,
  alt_text text,
  updated_at timestamptz not null default now()
);
insert into site_photos (key) values
  ('hero'), ('story'), ('couple_1'), ('couple_2'),
  ('home_detail_1'), ('home_detail_2'), ('closing')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------
-- Helper: is the current session an admin?
-- security definer so it can read `admins` without recursing through the
-- RLS policy defined on that same table below.
-- ---------------------------------------------------------------------

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------

alter table admins enable row level security;
alter table event_settings enable row level security;
alter table categories enable row level security;
alter table gifts enable row level security;
alter table reservations enable row level security;
alter table site_photos enable row level security;

drop policy if exists admins_self_read on admins;
create policy admins_self_read on admins for select using (auth.uid() = user_id);

drop policy if exists event_settings_public_read on event_settings;
create policy event_settings_public_read on event_settings for select using (true);
drop policy if exists event_settings_admin_write on event_settings;
create policy event_settings_admin_write on event_settings for all
  using (is_admin()) with check (is_admin());

drop policy if exists categories_public_read on categories;
create policy categories_public_read on categories for select using (true);
drop policy if exists categories_admin_write on categories;
create policy categories_admin_write on categories for all
  using (is_admin()) with check (is_admin());

-- Guests only ever see active gifts; admins see everything (including
-- inactive/draft gifts) so the panel can list every product.
drop policy if exists gifts_public_read on gifts;
create policy gifts_public_read on gifts for select
  using (status = 'active' or is_admin());
drop policy if exists gifts_admin_write on gifts;
create policy gifts_admin_write on gifts for all
  using (is_admin()) with check (is_admin());

-- Reservations hold guest names and private messages: never readable by
-- anon/guests, and never writable directly — all writes go through the
-- security-definer functions below so the availability check and the
-- insert happen atomically under a single row lock.
drop policy if exists reservations_admin_read on reservations;
create policy reservations_admin_read on reservations for select using (is_admin());
drop policy if exists reservations_admin_write on reservations;
create policy reservations_admin_write on reservations for all
  using (is_admin()) with check (is_admin());

drop policy if exists site_photos_public_read on site_photos;
create policy site_photos_public_read on site_photos for select using (true);
drop policy if exists site_photos_admin_write on site_photos;
create policy site_photos_admin_write on site_photos for all
  using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- reserve_gift: the one and only way a reservation gets created.
--
-- `select ... for update` takes a row lock on the target gift for the
-- duration of the transaction. If two guests call this at the same
-- moment for the same gift, the second call blocks until the first
-- transaction commits (or rolls back), then re-reads the now-updated
-- quantity_reserved before deciding whether the requested quantity is
-- still available. This is what guarantees only one of two simultaneous
-- requests for the last unit ever succeeds — there is no
-- check-then-write race window.
-- ---------------------------------------------------------------------

create or replace function reserve_gift(
  p_gift_id uuid,
  p_guest_name text,
  p_message text default null,
  p_quantity int default 1
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_gift gifts%rowtype;
  v_available int;
  v_quantity int := coalesce(p_quantity, 1);
  v_reservation_id uuid;
begin
  if p_guest_name is null or length(trim(p_guest_name)) = 0 then
    return jsonb_build_object('success', false, 'error', 'invalid_name');
  end if;

  if v_quantity < 1 then
    v_quantity := 1;
  end if;

  select * into v_gift from gifts where id = p_gift_id and status = 'active' for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'not_found');
  end if;

  v_available := v_gift.quantity_total - v_gift.quantity_reserved;

  if v_available < v_quantity then
    return jsonb_build_object('success', false, 'error', 'unavailable', 'available', v_available);
  end if;

  update gifts
    set quantity_reserved = quantity_reserved + v_quantity, updated_at = now()
    where id = p_gift_id;

  insert into reservations (gift_id, guest_name, message, quantity, status)
    values (p_gift_id, trim(p_guest_name), nullif(trim(coalesce(p_message, '')), ''), v_quantity, 'confirmed')
    returning id into v_reservation_id;

  return jsonb_build_object(
    'success', true,
    'reservation_id', v_reservation_id,
    'remaining', v_available - v_quantity
  );
end;
$$;

revoke all on function reserve_gift(uuid, text, text, int) from public;
grant execute on function reserve_gift(uuid, text, text, int) to anon, authenticated;

-- ---------------------------------------------------------------------
-- admin_cancel_reservation: frees up the reserved quantity again and
-- marks the reservation cancelled. Checks admin membership itself
-- (rather than relying solely on RLS) since it runs as security definer.
-- ---------------------------------------------------------------------

create or replace function admin_cancel_reservation(p_reservation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_res reservations%rowtype;
begin
  if not is_admin() then
    return jsonb_build_object('success', false, 'error', 'forbidden');
  end if;

  select * into v_res from reservations where id = p_reservation_id for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'not_found');
  end if;

  if v_res.status = 'cancelled' then
    return jsonb_build_object('success', false, 'error', 'already_cancelled');
  end if;

  update reservations set status = 'cancelled' where id = p_reservation_id;

  update gifts
    set quantity_reserved = greatest(quantity_reserved - v_res.quantity, 0), updated_at = now()
    where id = v_res.gift_id;

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function admin_cancel_reservation(uuid) from public;
grant execute on function admin_cancel_reservation(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- admin_reset_gift_availability: cancels every confirmed reservation for
-- a gift and zeroes its reserved count, so the admin can put it back on
-- the shelf ("marcar presente como disponível novamente") in one click.
-- ---------------------------------------------------------------------

create or replace function admin_reset_gift_availability(p_gift_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    return jsonb_build_object('success', false, 'error', 'forbidden');
  end if;

  update reservations set status = 'cancelled'
    where gift_id = p_gift_id and status = 'confirmed';

  update gifts set quantity_reserved = 0, updated_at = now() where id = p_gift_id;

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function admin_reset_gift_availability(uuid) from public;
grant execute on function admin_reset_gift_availability(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Storage buckets for gift photos and editorial site photos.
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
  values ('gift-images', 'gift-images', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('site-photos', 'site-photos', true)
  on conflict (id) do nothing;

drop policy if exists gift_images_public_read on storage.objects;
create policy gift_images_public_read on storage.objects for select
  using (bucket_id = 'gift-images');
drop policy if exists gift_images_admin_write on storage.objects;
create policy gift_images_admin_write on storage.objects for insert
  with check (bucket_id = 'gift-images' and is_admin());
drop policy if exists gift_images_admin_update on storage.objects;
create policy gift_images_admin_update on storage.objects for update
  using (bucket_id = 'gift-images' and is_admin());
drop policy if exists gift_images_admin_delete on storage.objects;
create policy gift_images_admin_delete on storage.objects for delete
  using (bucket_id = 'gift-images' and is_admin());

drop policy if exists site_photos_bucket_public_read on storage.objects;
create policy site_photos_bucket_public_read on storage.objects for select
  using (bucket_id = 'site-photos');
drop policy if exists site_photos_bucket_admin_write on storage.objects;
create policy site_photos_bucket_admin_write on storage.objects for insert
  with check (bucket_id = 'site-photos' and is_admin());
drop policy if exists site_photos_bucket_admin_update on storage.objects;
create policy site_photos_bucket_admin_update on storage.objects for update
  using (bucket_id = 'site-photos' and is_admin());
drop policy if exists site_photos_bucket_admin_delete on storage.objects;
create policy site_photos_bucket_admin_delete on storage.objects for delete
  using (bucket_id = 'site-photos' and is_admin());

-- ---------------------------------------------------------------------
-- Starter categories — safe to rename/delete from /admin/categorias.
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- Realtime: lets the public gift grid reflect another guest's
-- reservation live, without a page refresh (availability counts only —
-- reservations/guest data are never broadcast).
-- ---------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'gifts'
  ) then
    alter publication supabase_realtime add table gifts;
  end if;
exception when undefined_object then
  -- supabase_realtime publication not present (e.g. plain Postgres in CI) — skip.
  null;
end $$;

insert into categories (name, slug, display_order) values
  ('Cozinha', 'cozinha', 1),
  ('Mesa posta', 'mesa-posta', 2),
  ('Eletrodomésticos', 'eletrodomesticos', 3),
  ('Casa', 'casa', 4),
  ('Quarto', 'quarto', 5),
  ('Banheiro', 'banheiro', 6),
  ('Organização', 'organizacao', 7),
  ('Decoração', 'decoracao', 8),
  ('Outros', 'outros', 9)
on conflict (slug) do nothing;
