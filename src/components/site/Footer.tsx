import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { EventSettings } from "@/lib/types";

export function Footer({ settings }: { settings: EventSettings | null }) {
  return (
    <footer className="border-t border-line-soft bg-paper-alt py-12">
      <Container className="flex flex-col items-center gap-4 text-center">
        <p className="font-serif-display text-2xl text-ink">
          {settings?.couple_names ?? "Catarina & Vitor"}
        </p>
        <div className="hr-ornament w-full max-w-xs text-xs" />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <Link href="/" className="hover:text-ink">
            Início
          </Link>
          <Link href="/presentes" className="hover:text-ink">
            Lista de presentes
          </Link>
          {settings?.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              Instagram
            </a>
          )}
        </div>
        <p className="text-xs text-ink-faint">
          Feito com carinho para celebrar um novo capítulo.
        </p>
      </Container>
    </footer>
  );
}
