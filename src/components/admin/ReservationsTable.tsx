"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { formatPrice } from "@/lib/format";
import { cancelReservation } from "@/app/admin/(dashboard)/reservas/actions";
import type { ReservationWithGift } from "@/lib/types";

function toCsv(rows: ReservationWithGift[]): string {
  const header = [
    "Presente",
    "Valor",
    "Loja",
    "Quantidade",
    "Status",
    "Convidado",
    "Mensagem",
    "Data",
  ];
  const lines = rows.map((r) =>
    [
      r.gift?.name ?? "",
      r.gift ? r.gift.price.toFixed(2) : "",
      r.gift?.store_name ?? "",
      r.quantity,
      r.status === "confirmed" ? "Confirmado" : "Cancelado",
      r.guest_name,
      (r.message ?? "").replace(/\n/g, " "),
      new Date(r.created_at).toLocaleString("pt-BR"),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export function ReservationsTable({
  reservations,
}: {
  reservations: ReservationWithGift[];
}) {
  const [onlyConfirmed, setOnlyConfirmed] = useState(true);

  const visible = onlyConfirmed
    ? reservations.filter((r) => r.status === "confirmed")
    : reservations;

  function handleExport() {
    const csv = toCsv(visible);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservas-cha-de-panela-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={onlyConfirmed}
            onChange={(e) => setOnlyConfirmed(e.target.checked)}
            className="h-4 w-4"
          />
          Mostrar apenas confirmadas
        </label>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
        >
          Exportar CSV
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-sm border border-dashed border-line px-6 py-10 text-center text-sm text-ink-soft">
          Nenhuma reserva por aqui ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-line-soft bg-card">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-line-soft text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Presente</th>
                <th className="px-5 py-3 font-medium">Convidado</th>
                <th className="px-5 py-3 font-medium">Mensagem</th>
                <th className="px-5 py-3 font-medium">Qtd.</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className="border-b border-line-soft align-top last:border-0">
                  <td className="px-5 py-3 text-ink">
                    {r.gift?.name ?? "Presente removido"}
                    {r.gift && (
                      <p className="text-xs text-ink-faint">
                        {formatPrice(r.gift.price)} · {r.gift.store_name}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{r.guest_name}</td>
                  <td className="max-w-xs px-5 py-3 text-ink-soft">
                    {r.message || <span className="text-ink-faint">—</span>}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{r.quantity}</td>
                  <td className="px-5 py-3">
                    <span
                      className={clsx(
                        r.status === "confirmed" ? "text-success" : "text-ink-faint",
                      )}
                    >
                      {r.status === "confirmed" ? "Confirmado" : "Cancelado"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-3">
                    {r.status === "confirmed" && (
                      <form
                        action={cancelReservation}
                        onSubmit={(e) => {
                          if (
                            !confirm(
                              `Cancelar a reserva de ${r.guest_name}? O presente volta a ficar disponível.`,
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="text-danger underline underline-offset-4 hover:text-danger/80"
                        >
                          Cancelar
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
