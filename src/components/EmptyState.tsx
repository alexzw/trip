interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate bg-[#FAFAF8] px-4 py-6 text-center">
      <div className="text-[16px] font-medium text-ink">{title}</div>
      <div className="mt-2 text-[14px] text-mist">{description}</div>
    </div>
  )
}
