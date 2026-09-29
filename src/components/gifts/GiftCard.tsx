import { clsx } from "clsx";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { formatPrice } from "@/lib/format";
import type { GiftWithCategory } from "@/lib/types";

export function GiftCard({
  gift,
  onOpen,
}: {
  gift: GiftWithCategory;
  onOpen: () => void;
}) {
  const available = gift.quantity_total - gift.quantity_reserved;
  const isChosen = available <= 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={clsx(
        "group flex h-full flex-col overflow-hidden rounded-sm border border-line-soft bg-card text-left transition-shadow duration-300 hover:shadow-lg",
      )}
    >
      <div className="relative">
        <EditorialImage
          src={gift.image_url}
          alt={gift.name}
          label="Foto do presente"
          className={clsx(
            "relative aspect-[4/3] w-full transition-all duration-500",
            isChosen && "grayscale-[60%] opacity-70",
          )}
          sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
        />
        {gift.is_test && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[10px] uppercase tracking-wide text-paper">
            Presente de teste
          </span>
        )}
        {gift.featured && !isChosen && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] uppercase tracking-wide text-paper">
            Destaque
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {gift.category && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            {gift.category.name}
          </p>
        )}
        <p className="font-serif-display text-lg leading-snug text-ink">
          {gift.name}
        </p>
        {gift.description && (
          <p className="line-clamp-2 text-sm text-ink-soft">
            {gift.description}
          </p>
        )}

        <div className="mt-auto pt-3">
          {isChosen ? (
            <p className="text-sm italic text-ink-faint">
              Este presente já encontrou seu dono.
            </p>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-ink">
                {formatPrice(gift.price)}
              </span>
              <span className="text-xs uppercase tracking-wide text-accent underline underline-offset-4 transition-colors group-hover:text-accent-dark">
                Ver presente
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
