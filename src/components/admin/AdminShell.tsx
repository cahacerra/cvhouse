"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { signOut } from "@/app/admin/login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/presentes", label: "Presentes" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper-alt">
      <header className="sticky top-0 z-40 border-b border-line-soft bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-serif-display text-lg text-ink">
              C&nbsp;&amp;&nbsp;V <span className="text-ink-faint">admin</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "text-sm transition-colors",
                    pathname === item.href
                      ? "text-ink font-medium"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm text-ink-soft underline underline-offset-4 hover:text-ink sm:inline"
            >
              Ver site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-line-soft px-6 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex-none text-sm",
                pathname === item.href ? "text-ink font-medium" : "text-ink-soft",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

      {email && (
        <p className="pb-6 text-center text-xs text-ink-faint">
          Conectado como {email}
        </p>
      )}
    </div>
  );
}
