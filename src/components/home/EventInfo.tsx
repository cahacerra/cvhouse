import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { formatEventDate, formatEventTime } from "@/lib/format";
import type { EventSettings } from "@/lib/types";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line text-accent">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
          {label}
        </p>
        <p className="mt-1 text-base text-ink sm:text-lg">{value}</p>
      </div>
    </div>
  );
}

export function EventInfo({ settings }: { settings: EventSettings | null }) {
  const hasDate = Boolean(settings?.event_date);
  const hasTime = Boolean(settings?.event_time);
  const hasLocation = Boolean(settings?.location_name || settings?.address);
  const hasAnything = hasDate || hasTime || hasLocation;

  return (
    <section id="cha-de-panela" className="scroll-mt-20 bg-paper py-24 sm:py-32">
      <Container size="narrow">
        <Reveal>
          <p className="hr-ornament mb-6 text-xs uppercase tracking-[0.3em] text-ink-faint">
            {settings?.event_name ?? "Chá de Panela"}
          </p>
          <h2 className="mb-12 text-center font-serif-display text-3xl italic text-ink sm:text-5xl">
            Um encontro para celebrar
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-sm border border-line-soft bg-card px-6 py-6 sm:px-10 sm:py-8">
            {hasAnything ? (
              <div className="divide-y divide-line-soft">
                {hasDate && (
                  <InfoRow
                    icon={<CalendarIcon />}
                    label="Data"
                    value={formatEventDate(settings!.event_date!)}
                  />
                )}
                {hasTime && (
                  <InfoRow
                    icon={<ClockIcon />}
                    label="Horário"
                    value={formatEventTime(settings!.event_time!)}
                  />
                )}
                {hasLocation && (
                  <InfoRow
                    icon={<PinIcon />}
                    label="Local"
                    value={
                      [settings?.location_name, settings?.address]
                        .filter(Boolean)
                        .join(" — ")
                    }
                  />
                )}
              </div>
            ) : (
              <p className="py-6 text-center text-base leading-relaxed text-ink-soft">
                Estamos com o coração cheio e os detalhes quase prontos.
                <br />
                Em breve contaremos a data, o horário e o endereço deste
                encontro tão especial.
              </p>
            )}

            {settings?.address && settings?.maps_url && (
              <div className="mt-6 flex justify-center border-t border-line-soft pt-6">
                <LinkButton
                  href={settings.maps_url}
                  target="_blank"
                  variant="outline"
                  size="sm"
                >
                  Como chegar
                </LinkButton>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" strokeLinecap="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21s7-6.5 7-11.5A7 7 0 1 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.25" />
    </svg>
  );
}
