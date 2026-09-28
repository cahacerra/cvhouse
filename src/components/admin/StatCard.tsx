export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-line-soft bg-card px-6 py-5">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </p>
      <p className="mt-2 font-serif-display text-3xl text-ink">{value}</p>
    </div>
  );
}
