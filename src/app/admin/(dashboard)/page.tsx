import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { getAdminStats, getReservationsAdmin } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Dashboard — Painel Catarina & Vitor" };

export default async function AdminDashboardPage() {
  const [stats, reservations] = await Promise.all([
    getAdminStats(),
    getReservationsAdmin(),
  ]);

  const recent = reservations.slice(0, 8);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Um resumo rápido de como está a lista de presentes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total de presentes" value={stats.totalGifts} />
        <StatCard label="Disponíveis" value={stats.availableGifts} />
        <StatCard label="Escolhidos" value={stats.chosenGifts} />
        <StatCard label="Convidados confirmados" value={stats.confirmedGuests} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-display text-xl text-ink">
            Atividade recente
          </h2>
          <Link
            href="/admin/reservas"
            className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Ver todas as reservas
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="rounded-sm border border-dashed border-line px-6 py-10 text-center text-sm text-ink-soft">
            Nenhuma reserva ainda. Assim que um convidado confirmar um
            presente, ele aparece aqui.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-sm border border-line-soft bg-card">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-line-soft text-xs uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-5 py-3 font-medium">Produto</th>
                  <th className="px-5 py-3 font-medium">Valor</th>
                  <th className="px-5 py-3 font-medium">Loja</th>
                  <th className="px-5 py-3 font-medium">Qtd.</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Escolhido por</th>
                  <th className="px-5 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-line-soft last:border-0">
                    <td className="px-5 py-3 text-ink">{r.gift?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-ink-soft">
                      {r.gift ? formatPrice(r.gift.price) : "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {r.gift?.store_name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{r.quantity}</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          r.status === "confirmed"
                            ? "text-success"
                            : "text-ink-faint line-through"
                        }
                      >
                        {r.status === "confirmed" ? "Confirmado" : "Cancelado"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{r.guest_name}</td>
                    <td className="px-5 py-3 text-ink-soft">
                      {new Date(r.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
