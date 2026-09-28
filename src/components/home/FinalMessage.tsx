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
    <section className="bg-accent py-28">
      <Container size="narrow" className="text-center">
        <Reveal>
          <p className="font-serif-display text-2xl italic leading-relaxed text-paper sm:text-4xl">
            &ldquo;
            {finalMessage ??
              "Obrigada por fazer parte deste começo. Que cada detalhe desta casa carregue um pouco do carinho de quem esteve conosco quando tudo começou."}
            &rdquo;
          </p>
          <p className="mt-8 font-script text-4xl text-paper sm:text-5xl">
            {coupleNames}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
