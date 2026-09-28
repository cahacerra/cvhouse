"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { GiftFormState } from "@/app/admin/(dashboard)/presentes/actions";
import type { Category, Gift } from "@/lib/types";

const initialState: GiftFormState = { error: null };

const inputClass =
  "w-full rounded-sm border border-line bg-card px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-accent";

export function GiftForm({
  categories,
  gift,
  action,
}: {
  categories: Category[];
  gift?: Gift;
  action: (state: GiftFormState, formData: FormData) => Promise<GiftFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state.error && (
        <p className="rounded-sm bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Field label="Nome do presente">
            <input
              name="name"
              defaultValue={gift?.name}
              required
              className={inputClass}
            />
          </Field>

          <Field label="Descrição">
            <textarea
              name="description"
              defaultValue={gift?.description ?? ""}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="Categoria">
            <select
              name="category_id"
              defaultValue={gift?.category_id ?? ""}
              className={inputClass}
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Preço (R$)">
              <input
                type="number"
                name="price"
                min={0}
                step="0.01"
                defaultValue={gift?.price ?? 0}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Quantidade disponível">
              <input
                type="number"
                name="quantity_total"
                min={1}
                defaultValue={gift?.quantity_total ?? 1}
                required
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Loja">
              <input
                name="store_name"
                defaultValue={gift?.store_name ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Link do produto">
              <input
                type="url"
                name="product_url"
                defaultValue={gift?.product_url ?? ""}
                placeholder="https://..."
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Ordem de exibição">
              <input
                type="number"
                name="display_order"
                defaultValue={gift?.display_order ?? 0}
                className={inputClass}
              />
            </Field>
            <Field label="Status">
              <select
                name="status"
                defaultValue={gift?.status ?? "active"}
                className={inputClass}
              >
                <option value="active">Ativo (visível)</option>
                <option value="inactive">Inativo (oculto)</option>
              </select>
            </Field>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={gift?.featured}
                className="h-4 w-4"
              />
              Presente em destaque
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="is_test"
                defaultChecked={gift?.is_test}
                className="h-4 w-4"
              />
              Este é um presente de teste (mostra um selo na lista pública)
            </label>
          </div>
        </div>

        <div>
          <ImageUploadField
            bucket="gift-images"
            name="image_url"
            defaultValue={gift?.image_url}
            label="Foto do presente"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="lg" disabled={pending}>
          {pending ? "Salvando…" : "Salvar presente"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/admin/presentes")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-ink">
      {label}
      {children}
    </label>
  );
}
