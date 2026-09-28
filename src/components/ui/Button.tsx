import { clsx } from "clsx";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-accent-dark active:scale-[0.98] shadow-sm",
  secondary:
    "bg-accent text-paper hover:bg-accent-dark active:scale-[0.98] shadow-sm",
  outline:
    "border border-ink/30 text-ink hover:border-ink hover:bg-ink/5 active:scale-[0.98]",
  ghost: "text-ink-soft hover:text-ink underline underline-offset-4",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2 min-h-9",
  md: "text-sm sm:text-base px-6 py-3 min-h-11",
  lg: "text-base sm:text-lg px-8 py-4 min-h-13",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  target,
}: CommonProps & { href: string; target?: string }) {
  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
