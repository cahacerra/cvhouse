"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

const NAV_LINKS = [
  { label: "Nossa história", hash: "historia" },
  { label: "Chá de panela", hash: "cha-de-panela" },
  { label: "Lista de presentes", href: "/presentes" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled || open
          ? "bg-paper/90 backdrop-blur-sm border-b border-line-soft"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link
          href="/"
          className="font-serif-display text-xl tracking-wide text-ink"
          aria-label="Catarina & Vitor — início"
        >
          C&nbsp;&amp;&nbsp;V
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href ?? `${isHome ? "" : "/"}#${link.hash}`}
              className="text-sm tracking-wide text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center sm:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={clsx(
                "h-px w-full bg-ink transition-transform",
                open && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={clsx(
                "h-px w-full bg-ink transition-transform",
                open && "-translate-y-[3.5px] -rotate-45",
              )}
            />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line-soft bg-paper px-6 pb-6 pt-2 sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href ?? `${isHome ? "" : "/"}#${link.hash}`}
              onClick={() => setOpen(false)}
              className="py-3 text-base text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
