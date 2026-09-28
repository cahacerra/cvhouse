import { CategoryManager } from "@/components/admin/CategoryManager";
import { getCategories } from "@/lib/data/public";

export const metadata = { title: "Categorias — Painel Catarina & Vitor" };

export default async function AdminCategoriasPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">Categorias</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Organize os presentes em categorias. Elas aparecem como filtros na
          lista pública.
        </p>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}
