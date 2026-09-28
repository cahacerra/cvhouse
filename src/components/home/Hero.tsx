"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { EditorialImage } from "@/components/ui/EditorialImage";
import type { SitePhoto } from "@/lib/types";

export function Hero({
  coupleNames,
  photo,
}: {
  coupleNames: string;
  photo: SitePhoto | null;
}) {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-accent-dark sm:items-center"
    >
      <EditorialImage
        src={photo?.image_url}
        alt={photo?.alt_text ?? "Catarina e Vitor"}
        label="Foto de abertura — adicione em Configurações → Fotos"
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-accent-dark/90 via-accent-dark/45 to-accent-dark/25" />

      <div className="relative z-10 w-full px-6 pb-16 pt-40 text-center sm:px-8 sm:pb-0">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-xs uppercase tracking-[0.35em] text-paper/90"
        >
          Nosso novo capítulo
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex justify-center"
        >
          <Image
            src="/logo.webp"
            alt={coupleNames}
            width={340}
            height={340}
            priority
            className="h-40 w-40 drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] sm:h-52 sm:w-52 md:h-64 md:w-64"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-md font-serif-display text-lg text-paper/90 sm:text-xl"
        >
          Um novo capítulo começa aqui.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="#historia"
            className="group inline-flex flex-col items-center gap-3 text-sm tracking-wide text-paper/90 transition-colors hover:text-paper"
          >
            Entre para a nossa história
            <span className="flex h-10 w-6 items-start justify-center rounded-full border border-paper/50 pt-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-paper/90 transition-transform" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
