interface StatusBadgeProps {
  tone: 'default' | 'current' | 'done' | 'warning'
  label: string
}

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const className =
    tone === 'current'
      ? 'bg-[#EEF5F2] text-sage'
      : tone === 'done'
        ? 'bg-[#F1F1EF] text-mist'
        : tone === 'warning'
          ? 'bg-[#FCF4E8] text-[#B78628]'
          : 'bg-[#F3F4F6] text-mist'

  return <span className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${className}`}>{label}</span>
}
