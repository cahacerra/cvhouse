"use client";

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/admin/(dashboard)/presentes/actions";
import type { Category } from "@/lib/types";

const inputClass =
  "w-full rounded-sm border border-line bg-card px-3 py-2 text-sm text-ink outline-none focus:border-accent";

export function CategoryManager({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-x-auto rounded-sm border border-line-soft bg-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-line-soft text-xs uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-5 py-3 font-medium">Nome</th>
              <th className="px-5 py-3 font-medium">Ordem</th>
              <th className="px-5 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-line-soft last:border-0">
                <td colSpan={3} className="px-3 py-3">
                  <form
                    action={updateCategory}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <input type="hidden" name="id" value={c.id} />
                    <input
                      name="name"
                      defaultValue={c.name}
                      className={`${inputClass} max-w-xs`}
                    />
                    <input
                      type="number"
                      name="display_order"
                      defaultValue={c.display_order}
                      className={`${inputClass} w-24`}
                    />
                    <button
                      type="submit"
                      className="text-sm text-accent underline underline-offset-4 hover:text-accent-dark"
                    >
                      Salvar
                    </button>
                    <button
                      type="submit"
                      formAction={deleteCategory}
                      onClick={(e) => {
                        if (
                          !confirm(
                            `Excluir a categoria "${c.name}"? Presentes nela ficarão sem categoria.`,
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="text-sm text-danger underline underline-offset-4 hover:text-danger/80"
                    >
                      Excluir
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-ink-soft">
                  Nenhuma categoria cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="max-w-sm rounded-sm border border-line-soft bg-card p-5">
        <p className="mb-4 text-sm font-medium text-ink">Nova categoria</p>
        <form action={createCategory} className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="Nome da categoria"
            required
            className={inputClass}
          />
          <input
            type="number"
            name="display_order"
            placeholder="Ordem de exibição"
            defaultValue={categories.length}
            className={inputClass}
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-accent-dark"
          >
            Adicionar categoria
          </button>
        </form>
      </div>
    </div>
  );
}
