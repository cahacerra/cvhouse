import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { EditorialImage } from "@/components/ui/EditorialImage";
import type { SitePhoto } from "@/lib/types";

export function FinalMessage({
  photo,
  finalMessage,
  coupleNames,
}: {
  photo: SitePhoto | null;
  finalMessage: string | null;
  coupleNames: string;
}) {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden py-28">
      <EditorialImage
        src={photo?.image_url}
        alt={photo?.alt_text ?? "Catarina e Vitor"}
        label="Foto de encerramento — adicione em Configurações → Fotos"
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-ink/65" />

      <Container size="narrow" className="relative z-10 text-center">
        <Reveal>
          <p className="font-serif-display text-2xl italic leading-relaxed text-paper sm:text-4xl">
            &ldquo;
            {finalMessage ??
              "Obrigada por fazer parte deste começo. Que cada detalhe desta casa carregue um pouco do carinho de quem esteve conosco quando tudo começou."}
            &rdquo;
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-paper/80">
            {coupleNames}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
