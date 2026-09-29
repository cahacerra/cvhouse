"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { GiftWithCategory, ReserveGiftResult } from "@/lib/types";

type Step = "details" | "confirm-intent" | "already-bought" | "success" | "unavailable";

export function GiftModal({
  gift,
  onClose,
  onReserved,
}: {
  gift: GiftWithCategory;
  onClose: () => void;
  onReserved: (giftId: string, remaining: number) => void;
}) {
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const available = gift.quantity_total - gift.quantity_reserved;
  const isChosen = available <= 0;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleConfirm() {
    if (!name.trim()) {
      setNameError("Conte pra gente o seu nome.");
      return;
    }
    setNameError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("reserve_gift", {
        p_gift_id: gift.id,
        p_guest_name: name.trim(),
        p_message: message.trim() || null,
        p_quantity: 1,
      });

      const result = (error ? null : (data as unknown as ReserveGiftResult)) ?? {
        success: false,
        error: "unknown" as const,
      };

      if (result.success) {
        onReserved(gift.id, result.remaining ?? Math.max(available - 1, 0));
        setStep("success");
      } else {
        setStep("unavailable");
      }
    } catch {
      setStep("unavailable");
    } finally {
      setSubmitting(false);
    }
  }

  function handleBuy() {
    if (gift.product_url) {
      window.open(gift.product_url, "_blank", "noopener,noreferrer");
    }
    setStep("already-bought");
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={gift.name}
          className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-paper shadow-2xl sm:rounded-sm"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between border-b border-line-soft px-5 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
              {gift.category?.name ?? "Presente"}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto">
            {step === "details" && (
              <div>
                <EditorialImage
                  src={gift.image_url}
                  alt={gift.name}
                  label="Foto do presente"
                  className="relative aspect-[4/3] w-full"
                  sizes="(min-width: 640px) 32rem, 100vw"
                />
                <div className="p-6">
                  <h3 className="font-serif-display text-2xl text-ink">
                    {gift.name}
                  </h3>
                  {gift.description && (
                    <p className="mt-3 text-base leading-relaxed text-ink-soft">
                      {gift.description}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
                    <span className="text-lg font-medium text-ink">
                      {formatPrice(gift.price)}
                    </span>
                    {gift.store_name && <span>Loja: {gift.store_name}</span>}
                    {!isChosen && gift.quantity_total > 1 && (
                      <span>{available} disponíveis</span>
                    )}
                  </div>

                  {isChosen ? (
                    <p className="mt-6 rounded-sm bg-paper-alt px-4 py-4 text-sm italic text-ink-soft">
                      Este presente já encontrou seu dono. Obrigada por pensar
                      nele! 🤍
                    </p>
                  ) : (
                    <div className="mt-7 flex flex-col gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={() => setStep("confirm-intent")}
                      >
                        Quero presentear
                      </Button>
                      <button
                        type="button"
                        onClick={() => setStep("already-bought")}
                        className="text-center text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
                      >
                        Já comprei este presente
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === "confirm-intent" && (
              <div className="p-6 sm:p-8">
                <p className="text-center text-lg leading-relaxed text-ink">
                  Que escolha linda! ❤️
                  <br />
                  <br />
                  Você será direcionado para a loja onde poderá realizar a
                  compra.
                  <br />
                  <br />
                  Depois de finalizar a compra, pedimos que confirme o
                  presente para que ele seja reservado para você e não seja
                  escolhido por outra pessoa.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <Button variant="primary" size="lg" onClick={handleBuy}>
                    Comprar presente
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setStep("details")}
                  >
                    Voltar para a lista
                  </Button>
                </div>
              </div>
            )}

            {step === "already-bought" && (
              <div className="p-6 sm:p-8">
                <h3 className="font-serif-display text-xl text-ink">
                  Já comprei este presente
                </h3>
                <p className="mt-2 text-sm text-ink-soft">
                  Conte pra gente quem é você, para reservarmos {gift.name}
                  {" "}em seu nome.
                </p>

                <div className="mt-6 flex flex-col gap-4">
                  <label className="flex flex-col gap-2 text-sm text-ink">
                    Nome
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="rounded-sm border border-line bg-card px-4 py-3 text-base text-ink outline-none transition-colors focus:border-accent"
                    />
                    {nameError && (
                      <span className="text-xs text-danger">{nameError}</span>
                    )}
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-ink">
                    Mensagem para Catarina &amp; Vitor (opcional)
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="Deixe um recado, se quiser"
                      className="resize-none rounded-sm border border-line bg-card px-4 py-3 text-base text-ink outline-none transition-colors focus:border-accent"
                    />
                  </label>
                </div>

                <div className="mt-7 flex flex-col gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleConfirm}
                    disabled={submitting}
                  >
                    {submitting ? "Confirmando…" : "Confirmar meu presente"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setStep("details")}
                    disabled={submitting}
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="p-8 text-center sm:p-10">
                <p className="text-3xl">🤍</p>
                <p className="mt-4 text-lg leading-relaxed text-ink">
                  Que carinho receber esse presente de você. Obrigada por
                  fazer parte do início da nossa casa e da nossa família.
                </p>
                <Button
                  variant="outline"
                  size="md"
                  className="mt-8"
                  onClick={onClose}
                >
                  Voltar para a lista
                </Button>
              </div>
            )}

            {step === "unavailable" && (
              <div className="p-8 text-center sm:p-10">
                <p className="text-lg leading-relaxed text-ink">
                  Ah, esse presente acabou de ser escolhido por outra pessoa.
                  Mas encontramos muitos outros presentes esperando por você.
                  🤍
                </p>
                <Button
                  variant="primary"
                  size="md"
                  className="mt-8"
                  onClick={onClose}
                >
                  Voltar para a lista
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
