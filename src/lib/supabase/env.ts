/**
 * Reads Supabase connection details from the environment. Falls back to
 * inert placeholders instead of throwing, so `next build` and pages that
 * don't touch the network still work before the project is connected to a
 * real Supabase instance. Any actual network call made with placeholders
 * will fail at request time, and pages are written to handle that
 * gracefully (see src/lib/data/*).
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
