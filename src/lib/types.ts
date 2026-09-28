export type GiftStatus = "active" | "inactive";
export type ReservationStatus = "confirmed" | "cancelled";

export type Category = {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
};

export type Gift = {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  price: number;
  store_name: string | null;
  product_url: string | null;
  image_url: string | null;
  quantity_total: number;
  quantity_reserved: number;
  featured: boolean;
  display_order: number;
  status: GiftStatus;
  is_test: boolean;
  created_at: string;
  updated_at: string;
};

export type GiftWithCategory = Gift & {
  category: Category | null;
};

export type Reservation = {
  id: string;
  gift_id: string;
  guest_name: string;
  message: string | null;
  quantity: number;
  status: ReservationStatus;
  created_at: string;
};

export type ReservationWithGift = Reservation & {
  gift: Pick<Gift, "id" | "name" | "price" | "store_name"> | null;
};

export type EventSettings = {
  id: number;
  couple_names: string;
  event_name: string;
  opening_title: string;
  opening_subtitle: string;
  event_date: string | null; // ISO date, e.g. 2026-11-14
  event_time: string | null; // HH:MM
  location_name: string | null;
  address: string | null;
  maps_url: string | null;
  instagram: string | null;
  final_message: string | null;
  updated_at: string;
};

export const SITE_PHOTO_KEYS = ["hero"] as const;

export type SitePhotoKey = (typeof SITE_PHOTO_KEYS)[number];

export type SitePhoto = {
  key: SitePhotoKey;
  image_url: string | null;
  alt_text: string | null;
  updated_at: string;
};

export type ReserveGiftResult = {
  success: boolean;
  error?: "invalid_name" | "not_found" | "unavailable" | "unknown";
  reservation_id?: string;
  remaining?: number;
  available?: number;
};

export type AdminCancelResult = {
  success: boolean;
  error?: "forbidden" | "not_found" | "already_cancelled";
};

// Minimal typed surface for the Supabase client. We intentionally avoid the
// generated-types workflow (no live project during scaffolding) and instead
// hand-maintain this, matching supabase/migrations/0001_init.sql exactly.
//
// Note: every Row/Insert/Update/Args/Returns shape below is declared with
// `type`, not `interface`. supabase-js's generic constraints check these
// against `Record<string, unknown>`, and only type-alias object literals
// (not interfaces) are structurally assignable to an index signature type —
// an interface here silently breaks inference on every table/rpc call.
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Partial<Category> & { name: string; slug: string };
        Update: Partial<Category>;
        Relationships: [];
      };
      gifts: {
        Row: Gift;
        Insert: Partial<Gift> & { name: string };
        Update: Partial<Gift>;
        Relationships: [];
      };
      reservations: {
        Row: Reservation;
        Insert: Partial<Reservation> & { gift_id: string; guest_name: string };
        Update: Partial<Reservation>;
        Relationships: [];
      };
      event_settings: {
        Row: EventSettings;
        Insert: Partial<EventSettings>;
        Update: Partial<EventSettings>;
        Relationships: [];
      };
      site_photos: {
        Row: SitePhoto;
        Insert: Partial<SitePhoto> & { key: SitePhotoKey };
        Update: Partial<SitePhoto>;
        Relationships: [];
      };
      admins: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string };
        Update: { user_id?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      reserve_gift: {
        Args: {
          p_gift_id: string;
          p_guest_name: string;
          p_message?: string | null;
          p_quantity?: number;
        };
        Returns: ReserveGiftResult;
      };
      admin_cancel_reservation: {
        Args: { p_reservation_id: string };
        Returns: AdminCancelResult;
      };
      admin_reset_gift_availability: {
        Args: { p_gift_id: string };
        Returns: AdminCancelResult;
      };
    };
  };
};
