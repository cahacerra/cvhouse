"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { GiftCard } from "./GiftCard";
import { GiftModal } from "./GiftModal";
import { createClient } from "@/lib/supabase/client";
import type { Category, GiftWithCategory } from "@/lib/types";

type SortOption = "recommended" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "Recomendados",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
};

export function GiftGrid({
  initialGifts,
  categories,
}: {
  initialGifts: GiftWithCategory[];
  categories: Category[];
}) {
  const [gifts, setGifts] = useState(initialGifts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("todos");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [openGift, setOpenGift] = useState<GiftWithCategory | null>(null);

  // Keep availability in sync across guests without requiring a refresh:
  // any confirmed reservation elsewhere updates quantity_reserved here too.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("gifts-availability")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "gifts" },
        (payload) => {
          const updated = payload.new as GiftWithCategory;
          setGifts((prev) =>
            prev.map((g) =>
              g.id === updated.id
                ? { ...g, quantity_reserved: updated.quantity_reserved }
                : g,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const featured = useMemo(() => gifts.filter((g) => g.featured), [gifts]);

  const visible = useMemo(() => {
    let list = gifts;

    if (category !== "todos") {
      list = list.filter((g) => g.category?.slug === category);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q),
      );
    }

    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [gifts, category, search, sort]);

  function handleReserved(giftId: string, remaining: number) {
    setGifts((prev) =>
      prev.map((g) =>
        g.id === giftId
          ? { ...g, quantity_reserved: g.quantity_total - remaining }
          : g,
      ),
    );
  }

  return (
    <div>
      {featured.length > 0 && (
        <div className="mb-16">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-ink-faint">
            Presentes em destaque
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onOpen={() => setOpenGift(gift)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-5">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Encontre um presente..."
            aria-label="Encontre um presente"
            className="w-full rounded-full border border-line bg-card px-6 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            className="-mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0"
            role="group"
            aria-label="Filtrar por categoria"
          >
            <FilterChip
              active={category === "todos"}
              onClick={() => setCategory("todos")}
            >
              Todos
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c.id}
                active={category === c.slug}
                onClick={() => setCategory(c.slug)}
              >
                {c.name}
              </FilterChip>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-soft">
            Ordenar por
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-full border border-line bg-card px-4 py-2 text-sm text-ink outline-none focus:border-accent"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              onOpen={() => setOpenGift(gift)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-ink-soft">
            Não encontramos presentes com esse filtro.
          </p>
          <p className="mt-2 text-sm text-ink-faint">
            Tente outra busca ou categoria.
          </p>
        </div>
      )}

      {openGift && (
        <GiftModal
          gift={
            visible.find((g) => g.id === openGift.id) ??
            gifts.find((g) => g.id === openGift.id) ??
            openGift
          }
          onClose={() => setOpenGift(null)}
          onReserved={handleReserved}
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex-none rounded-full border px-4 py-2 text-sm transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-ink-soft hover:border-ink/40 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
