interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate bg-[#FAFAF8] px-4 py-6 text-center">
      <div className="text-[16px] font-medium text-ink">{title}</div>
      <div className="mt-2 text-[14px] text-mist">{description}</div>
      {actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="mt-4 inline-flex min-h-[42px] items-center justify-center rounded-full border border-slate bg-white px-4 text-[14px] font-medium text-ink"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
