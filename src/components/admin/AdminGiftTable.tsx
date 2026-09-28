"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { formatPrice } from "@/lib/format";
import { deleteGift, resetGiftAvailability } from "@/app/admin/(dashboard)/presentes/actions";
import type { GiftWithCategory } from "@/lib/types";

export function AdminGiftTable({ gifts }: { gifts: GiftWithCategory[] }) {
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    if (!search.trim()) return gifts;
    const q = search.trim().toLowerCase();
    return gifts.filter((g) => g.name.toLowerCase().includes(q));
  }, [gifts, search]);

  return (
    <div className="flex flex-col gap-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar presente pelo nome..."
        className="max-w-sm rounded-sm border border-line bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
      />

      {visible.length === 0 ? (
        <p className="rounded-sm border border-dashed border-line px-6 py-10 text-center text-sm text-ink-soft">
          Nenhum presente encontrado.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-line-soft bg-card">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line-soft text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 font-medium">Categoria</th>
                <th className="px-5 py-3 font-medium">Preço</th>
                <th className="px-5 py-3 font-medium">Disponibilidade</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((gift) => {
                const available = gift.quantity_total - gift.quantity_reserved;
                return (
                  <tr key={gift.id} className="border-b border-line-soft last:border-0">
                    <td className="px-5 py-3 text-ink">
                      <div className="flex items-center gap-2">
                        {gift.name}
                        {gift.featured && (
                          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] uppercase text-accent">
                            Destaque
                          </span>
                        )}
                        {gift.is_test && (
                          <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] uppercase text-ink-faint">
                            Teste
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {gift.category?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {formatPrice(gift.price)}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {available}/{gift.quantity_total} disponível
                      {gift.quantity_total > 1 ? "eis" : ""}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={clsx(
                          available <= 0
                            ? "text-accent"
                            : gift.status === "active"
                              ? "text-success"
                              : "text-ink-faint",
                        )}
                      >
                        {gift.status === "inactive"
                          ? "Inativo"
                          : available <= 0
                            ? "Escolhido"
                            : "Disponível"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/admin/presentes/${gift.id}`}
                          className="text-accent underline underline-offset-4 hover:text-accent-dark"
                        >
                          Editar
                        </Link>
                        {gift.quantity_reserved > 0 && (
                          <form action={resetGiftAvailability}>
                            <input type="hidden" name="id" value={gift.id} />
                            <button
                              type="submit"
                              className="text-ink-soft underline underline-offset-4 hover:text-ink"
                            >
                              Liberar
                            </button>
                          </form>
                        )}
                        <form
                          action={deleteGift}
                          onSubmit={(e) => {
                            if (
                              !confirm(
                                `Excluir "${gift.name}"? Esta ação não pode ser desfeita.`,
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={gift.id} />
                          <button
                            type="submit"
                            className="text-danger underline underline-offset-4 hover:text-danger/80"
                          >
                            Excluir
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
