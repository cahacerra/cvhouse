import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { EditorialImage } from "@/components/ui/EditorialImage";
import type { SitePhoto, SitePhotoKey } from "@/lib/types";

export function Gallery({
  photos,
}: {
  photos: Record<SitePhotoKey, SitePhoto | null>;
}) {
  return (
    <section className="bg-paper-alt py-24 sm:py-32">
      <Container size="wide">
        <Reveal>
          <p className="hr-ornament mb-6 text-xs uppercase tracking-[0.3em] text-ink-faint">
            Instantes
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Reveal className="col-span-2" delay={0}>
            <EditorialImage
              src={photos.couple_1?.image_url}
              alt={photos.couple_1?.alt_text ?? "Catarina e Vitor"}
              label="Foto do casal — adicione em Configurações → Fotos"
              className="aspect-[4/5] w-full rounded-sm sm:aspect-[3/4]"
              sizes="(min-width: 640px) 40vw, 90vw"
            />
          </Reveal>
          <Reveal className="col-span-2 sm:mt-16" delay={0.1}>
            <EditorialImage
              src={photos.home_detail_1?.image_url}
              alt={photos.home_detail_1?.alt_text ?? "Detalhe da casa"}
              label="Detalhe da casa"
              className="aspect-[4/5] w-full rounded-sm sm:aspect-[3/4]"
              sizes="(min-width: 640px) 40vw, 90vw"
            />
          </Reveal>
          <Reveal className="col-span-1" delay={0.15}>
            <EditorialImage
              src={photos.home_detail_2?.image_url}
              alt={photos.home_detail_2?.alt_text ?? "Detalhe da decoração"}
              label="Detalhe da decoração"
              className="aspect-square w-full rounded-sm"
              sizes="(min-width: 640px) 25vw, 45vw"
            />
          </Reveal>
          <Reveal className="col-span-1" delay={0.2}>
            <EditorialImage
              src={photos.couple_2?.image_url}
              alt={photos.couple_2?.alt_text ?? "Catarina e Vitor"}
              label="Foto do casal"
              className="aspect-square w-full rounded-sm"
              sizes="(min-width: 640px) 25vw, 45vw"
            />
          </Reveal>
          <div className="col-span-2 hidden sm:block" />
        </div>
      </Container>
    </section>
  );
}
