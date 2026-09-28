"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { signIn, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = { error: null };

export function LoginForm({
  next,
  unauthorized,
}: {
  next: string;
  unauthorized: boolean;
}) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      {(state.error || unauthorized) && (
        <p className="rounded-sm bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error ??
            "Esta conta não tem acesso ao painel administrativo."}
        </p>
      )}

      <label className="flex flex-col gap-2 text-sm text-ink">
        E-mail
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded-sm border border-line bg-card px-4 py-3 text-base text-ink outline-none transition-colors focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-ink">
        Senha
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="rounded-sm border border-line bg-card px-4 py-3 text-base text-ink outline-none transition-colors focus:border-accent"
        />
      </label>

      <Button type="submit" variant="primary" size="lg" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
