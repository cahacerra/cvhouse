import { ReservationsTable } from "@/components/admin/ReservationsTable";
import { getReservationsAdmin } from "@/lib/data/admin";

export const metadata = { title: "Reservas — Painel Catarina & Vitor" };

export default async function AdminReservasPage() {
  const reservations = await getReservationsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">Reservas</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Quem já confirmou presentes, com as mensagens que deixaram para
          vocês.
        </p>
      </div>

      <ReservationsTable reservations={reservations} />
    </div>
  );
}
