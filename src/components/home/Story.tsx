import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const PARAGRAPHS = [
  "Algumas histórias não chegam até nós em linha reta. Elas atravessam o tempo, amadurecem, encontram novos caminhos e, quando menos esperamos, nos conduzem exatamente para onde deveríamos estar.",
  "A nossa história nos trouxe até aqui. E, agora, diante de uma nova porta, escolhemos entrar juntos.",
  "Mais do que uma mudança de endereço, este é o início de uma vida compartilhada. O começo de uma rotina que será só nossa, de pequenos rituais que ainda vamos descobrir, de manhãs tranquilas, noites longas, mesas postas sem motivo e tantos sonhos que, a partir de agora, terão o mesmo lugar para acontecer.",
  "Estamos construindo um lar. E, com ele, começando a construir a nossa família. Uma família que nasce das nossas escolhas, dos nossos sonhos, do amor que nos trouxe até aqui e de tudo aquilo que ainda desejamos viver.",
  "E entendemos que um lar não nasce quando chegam os móveis, quando as caixas são desfeitas ou quando tudo finalmente encontra o seu lugar. Um lar nasce quando existe amor suficiente para chamar aquele espaço de casa.",
  "Por isso, antes de enchê-la de objetos, queremos enchê-la de presença. De pessoas que amamos. De histórias que nos acompanham. De abraços que fazem parte de quem somos. De memórias que ainda nem aconteceram.",
  "É por isso que abrimos as portas da nossa casa para vocês. Para celebrar este novo capítulo ao lado daqueles que, de alguma maneira, fizeram parte dos capítulos anteriores.",
  "A nossa lista de presentes é apenas uma maneira delicada de permitir que vocês façam parte também dos primeiros detalhes desse lar. Cada presente será muito mais do que aquilo que representa: será uma lembrança de quem esteve conosco quando tudo começou.",
  "Porque, no futuro, quando esta casa estiver cheia de histórias, queremos olhar ao redor e lembrar que ela começou assim: com amor, com sonhos, com a escolha de caminharmos juntos e com as pessoas que amamos ao nosso lado.",
];

export function Story() {
  return (
    <section id="historia" className="scroll-mt-20 bg-paper py-24 sm:py-32">
      <Container size="narrow">
        <Reveal>
          <p className="hr-ornament mb-6 text-xs uppercase tracking-[0.3em] text-ink-faint">
            Nossa história
          </p>
          <h2 className="mb-12 text-center font-serif-display text-3xl italic text-ink sm:text-5xl">
            Onde a nossa história mora
          </h2>
        </Reveal>

        <div className="space-y-6">
          {PARAGRAPHS.map((paragraph, i) => (
            <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
              <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 text-center">
            <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
              Sejam bem-vindos à nossa casa.
              <br />
              Sejam bem-vindos à nossa família.
              <br />
              Sejam bem-vindos a este novo capítulo.
            </p>
            <p className="mt-8 font-serif-display text-xl italic text-ink">
              Com carinho,
              <br />
              Catarina &amp; Vitor
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
