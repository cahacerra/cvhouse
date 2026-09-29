import Image from "next/image";
import { clsx } from "clsx";

/**
 * Renders a real photo when `src` is set; otherwise a tasteful placeholder
 * that tells the admin, in small print, which photo belongs there. This lets
 * every editorial slot on the site stay populated and well-composed before
 * real photography is uploaded through /admin/configuracoes.
 *
 * `className` must include a position utility (`relative` for normal-flow
 * sizing, or `absolute inset-0 ...` for a full-bleed background) — it is
 * never assumed here, since Tailwind can't reliably let a caller override a
 * hardcoded `relative` with its own `absolute`.
 */
export function EditorialImage({
  src,
  alt,
  label,
  className,
  sizes = "100vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={clsx("overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-end overflow-hidden border border-dashed border-line",
        className,
      )}
      style={{
        background:
          "linear-gradient(150deg, #f3ecdf 0%, #ece2cd 45%, #e7dac0 100%)",
      }}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(151,118,79,0.06) 0px, rgba(151,118,79,0.06) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <svg
        className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-accent/40"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M24 6c3 6 3 10 0 14-3-4-3-8 0-14Z" />
        <path d="M24 42c3-6 3-10 0-14-3 4-3 8 0 14Z" />
        <path d="M6 24c6-3 10-3 14 0-4 3-8 3-14 0Z" />
        <path d="M42 24c-6-3-10-3-14 0 4 3 8 3 14 0Z" />
        <circle cx="24" cy="24" r="3" />
      </svg>
      <p className="relative z-10 m-3 rounded-full bg-paper/80 px-3 py-1 text-[11px] tracking-wide text-ink-faint">
        {label}
      </p>
    </div>
  );
}
