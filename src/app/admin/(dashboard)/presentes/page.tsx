import { LinkButton } from "@/components/ui/Button";
import { AdminGiftTable } from "@/components/admin/AdminGiftTable";
import { getAllGiftsAdmin } from "@/lib/data/admin";

export const metadata = { title: "Presentes — Painel Catarina & Vitor" };

export default async function AdminPresentesPage() {
  const gifts = await getAllGiftsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif-display text-3xl text-ink">Presentes</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Cadastre, edite e acompanhe a disponibilidade de cada presente.
          </p>
        </div>
        <LinkButton href="/admin/presentes/novo" size="sm">
          + Novo presente
        </LinkButton>
      </div>

      <AdminGiftTable gifts={gifts} />
    </div>
  );
}
