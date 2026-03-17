interface InfoRowProps {
  label: string
  value: string
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-[#FAFAF8] px-3 py-3">
      <span className="text-[12px] font-medium text-mist">{label}</span>
      <span className="text-right text-[14px] text-ink">{value}</span>
    </div>
  )
}
