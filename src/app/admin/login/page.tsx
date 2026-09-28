import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Painel administrativo — Catarina & Vitor" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-alt px-6 py-16">
      <Container size="narrow" className="max-w-sm px-0">
        <div className="rounded-sm border border-line-soft bg-card p-8 shadow-sm">
          <p className="text-center font-serif-display text-2xl text-ink">
            C&nbsp;&amp;&nbsp;V
          </p>
          <p className="mt-1 text-center text-sm text-ink-faint">
            Painel administrativo
          </p>

          <div className="mt-8">
            <LoginForm
              next={params.next ?? "/admin"}
              unauthorized={params.error === "unauthorized"}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-ink-soft underline underline-offset-4 hover:text-ink">
            Voltar para o site
          </Link>
        </p>
      </Container>
    </div>
  );
}
