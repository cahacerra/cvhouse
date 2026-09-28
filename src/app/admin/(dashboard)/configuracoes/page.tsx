import { SettingsForm } from "@/components/admin/SettingsForm";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { getEventSettings, getSitePhotos } from "@/lib/data/public";

export const metadata = { title: "Configurações — Painel Catarina & Vitor" };

export default async function AdminConfiguracoesPage() {
  const [settings, photos] = await Promise.all([
    getEventSettings(),
    getSitePhotos(),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">Configurações</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Tudo o que aparece automaticamente no site assim que você
          preenche aqui.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif-display text-xl text-ink">
          Evento e identidade
        </h2>
        <SettingsForm settings={settings} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif-display text-xl text-ink">Fotos do site</h2>
        <p className="text-sm text-ink-soft">
          Cada foto substitui automaticamente o espaço reservado a ela no
          site assim que for enviada.
        </p>
        <PhotoManager photos={photos} />
      </section>
    </div>
  );
}
