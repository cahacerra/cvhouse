"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  updateEventSettings,
  type SettingsFormState,
} from "@/app/admin/(dashboard)/configuracoes/actions";
import type { EventSettings } from "@/lib/types";

const initialState: SettingsFormState = { error: null };

const inputClass =
  "w-full rounded-sm border border-line bg-card px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-accent";

export function SettingsForm({ settings }: { settings: EventSettings | null }) {
  const [state, formAction, pending] = useActionState(
    updateEventSettings,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error && (
        <p className="rounded-sm bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-sm bg-success/10 px-4 py-3 text-sm text-success">
          Configurações salvas.
        </p>
      )}

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-medium text-ink">
          Identidade
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nomes do casal">
            <input
              name="couple_names"
              defaultValue={settings?.couple_names ?? "Catarina & Vitor"}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Nome do evento">
            <input
              name="event_name"
              defaultValue={settings?.event_name ?? "Chá de Panela"}
              className={inputClass}
            />
          </Field>
          <Field label="Eyebrow da abertura">
            <input
              name="opening_title"
              defaultValue={settings?.opening_title ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Subtítulo da abertura">
            <input
              name="opening_subtitle"
              defaultValue={settings?.opening_subtitle ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-medium text-ink">
          Data e local
        </legend>
        <p className="-mt-2 text-xs text-ink-faint">
          Deixe em branco enquanto ainda não estiver definido — o site se
          adapta automaticamente e não mostra nada inventado.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Data">
            <input
              type="date"
              name="event_date"
              defaultValue={settings?.event_date ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Horário">
            <input
              type="time"
              name="event_time"
              defaultValue={settings?.event_time?.slice(0, 5) ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Nome do local">
            <input
              name="location_name"
              defaultValue={settings?.location_name ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Link do Google Maps">
            <input
              type="url"
              name="maps_url"
              defaultValue={settings?.maps_url ?? ""}
              placeholder="https://maps.google.com/..."
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Endereço completo">
          <input
            name="address"
            defaultValue={settings?.address ?? ""}
            className={inputClass}
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-medium text-ink">
          Redes e mensagens
        </legend>
        <Field label="Instagram (link completo, opcional)">
          <input
            type="url"
            name="instagram"
            defaultValue={settings?.instagram ?? ""}
            placeholder="https://instagram.com/..."
            className={inputClass}
          />
        </Field>
        <Field label="Mensagem final (rodapé do site)">
          <textarea
            name="final_message"
            defaultValue={settings?.final_message ?? ""}
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </fieldset>

      <Button type="submit" variant="primary" size="lg" disabled={pending} className="self-start">
        {pending ? "Salvando…" : "Salvar configurações"}
      </Button>
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
