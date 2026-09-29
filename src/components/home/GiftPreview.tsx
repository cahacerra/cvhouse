import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { formatPrice } from "@/lib/format";
import type { GiftWithCategory } from "@/lib/types";

export function GiftPreview({ gifts }: { gifts: GiftWithCategory[] }) {
  const preview = gifts.slice(0, 3);

  return (
    <section className="bg-sage-pale py-24 sm:py-32">
      <Container>
        <Reveal className="text-center">
          <p className="hr-ornament mb-6 text-xs uppercase tracking-[0.3em] text-ink-faint">
            Um convite
          </p>
          <h2 className="heading-caps text-2xl text-ink sm:text-4xl">
            Faça parte dos primeiros detalhes
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Reunimos, aos poucos, alguns objetos que vão ajudar a compor essa
            nova casa. Escolha um presente com carinho — ele vai fazer parte
            das nossas primeiras memórias juntos.
          </p>
        </Reveal>

        {preview.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {preview.map((gift, i) => (
              <Reveal key={gift.id} delay={i * 0.1}>
                <div className="group overflow-hidden rounded-sm border border-line-soft bg-card">
                  <EditorialImage
                    src={gift.image_url}
                    alt={gift.name}
                    label="Foto do presente"
                    className="relative aspect-[4/3] w-full"
                    sizes="(min-width: 640px) 30vw, 90vw"
                  />
                  <div className="p-5">
                    <p className="font-serif-display text-lg text-ink">
                      {gift.name}
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {formatPrice(gift.price)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1} className="mt-14 text-center">
            <p className="text-base text-ink-soft">
              Estamos preparando a nossa lista com muito carinho. Em breve ela
              estará disponível por aqui.
            </p>
          </Reveal>
        )}

        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <LinkButton
            href="/presentes"
            variant="outline"
            size="lg"
            className="uppercase tracking-[0.2em]"
          >
            Ver lista de presentes
          </LinkButton>
        </Reveal>
      </Container>
    </section>
  );
}
