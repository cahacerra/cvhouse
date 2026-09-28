import { Reveal } from "@/components/ui/Reveal";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { formatEventDate, formatEventTime } from "@/lib/format";
import type { EventSettings, SitePhoto } from "@/lib/types";

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
      <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full border border-paper/40 text-paper">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-paper/70">
          {label}
        </p>
        <p className="mt-1 text-base text-paper sm:text-lg">{value}</p>
      </div>
    </div>
  );
}

export function EventInfo({
  settings,
  photo,
}: {
  settings: EventSettings | null;
  photo: SitePhoto | null;
}) {
  const hasDate = Boolean(settings?.event_date);
  const hasTime = Boolean(settings?.event_time);
  const hasLocation = Boolean(settings?.location_name || settings?.address);
  const hasAnything = hasDate || hasTime || hasLocation;

  return (
    <section id="cha-de-panela" className="scroll-mt-20 grid md:grid-cols-2">
      <div className="relative h-[360px] sm:h-[480px] md:h-auto md:min-h-[720px]">
        <EditorialImage
          src={photo?.image_url}
          alt={photo?.alt_text ?? "Catarina e Vitor"}
          label="Foto do Chá de Panela — adicione em Configurações → Fotos"
          className="absolute inset-0 h-full w-full"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div className="flex items-center bg-olive-deep px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto w-full max-w-xl">
          <Reveal className="text-center md:text-left">
            <RingsIcon className="mx-auto mb-6 h-10 w-10 text-paper/80 md:mx-0" />
            <p className="hr-ornament mb-6 text-xs uppercase tracking-[0.3em] text-paper/70 md:justify-start">
              {settings?.event_name ?? "Chá de Panela"}
            </p>
            <h2 className="mb-12 font-serif-display text-3xl italic text-paper sm:text-5xl">
              Um encontro para celebrar
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-paper/20 px-2 pt-2 sm:px-0">
              {hasAnything ? (
                <div className="divide-y divide-paper/15">
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
                <p className="py-6 text-center text-base leading-relaxed text-paper/85 md:text-left">
                  Estamos com o coração cheio e os detalhes quase prontos.
                  <br />
                  Em breve contaremos a data, o horário e o endereço deste
                  encontro tão especial.
                </p>
              )}

              {settings?.address && settings?.maps_url && (
                <div className="mt-6 flex justify-center border-t border-paper/15 pt-6 md:justify-start">
                  <a
                    href={settings.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-paper/50 px-5 py-2.5 text-sm text-paper transition-colors hover:border-paper hover:bg-paper/10"
                  >
                    Como chegar
                  </a>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function RingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="16" r="10" />
      <circle cx="30" cy="16" r="10" />
    </svg>
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
