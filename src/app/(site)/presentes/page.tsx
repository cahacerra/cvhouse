import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GiftGrid } from "@/components/gifts/GiftGrid";
import { getActiveGifts, getCategories } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lista de Presentes — Catarina & Vitor",
};

export default async function PresentesPage() {
  const [gifts, categories] = await Promise.all([
    getActiveGifts(),
    getCategories(),
  ]);

  const categoriesInUse = categories.filter((c) =>
    gifts.some((g) => g.category_id === c.id),
  );

  return (
    <div className="pb-28 pt-32 sm:pt-40">
      <Container size="narrow" className="text-center">
        <Reveal>
          <p className="hr-ornament mb-6 text-xs uppercase tracking-[0.3em] text-ink-faint">
            Lista de presentes
          </p>
          <h1 className="heading-caps text-3xl text-ink sm:text-5xl">
            Um pouco de vocês nesta casa nova
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Cada presente aqui foi escolhido com cuidado. Ao lado de cada um,
            está a loja onde ele pode ser comprado — depois de finalizar a
            compra, é só voltar aqui e confirmar, para que ele fique
            reservado só para você.
          </p>
        </Reveal>
      </Container>

      <Container size="wide" className="mt-16">
        {gifts.length > 0 ? (
          <GiftGrid initialGifts={gifts} categories={categoriesInUse} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-ink-soft">
              Estamos preparando a nossa lista com muito carinho.
            </p>
            <p className="mt-2 text-sm text-ink-faint">
              Em breve os presentes estarão disponíveis por aqui.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
