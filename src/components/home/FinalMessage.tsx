import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function FinalMessage({
  finalMessage,
  coupleNames,
}: {
  finalMessage: string | null;
  coupleNames: string;
}) {
  return (
    <section className="bg-sage-pale py-24 sm:py-32">
      <Container size="narrow" className="text-center">
        <Reveal>
          <p className="hr-ornament mb-8 text-xs uppercase tracking-[0.3em] text-ink-faint">
            Com carinho
          </p>
          <p className="font-serif-display text-xl italic leading-relaxed text-ink sm:text-3xl">
            &ldquo;
            {finalMessage ??
              "Obrigada por fazer parte deste começo. Que cada detalhe desta casa carregue um pouco do carinho de quem esteve conosco quando tudo começou."}
            &rdquo;
          </p>
          <p className="mt-8 font-script text-4xl text-accent sm:text-5xl">
            {coupleNames}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
