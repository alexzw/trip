interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  badge?: string
}

export function SectionHeader({ title, subtitle, action, badge }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
          {badge ? (
            <span className="rounded-full bg-[#F1F1EF] px-2.5 py-1 text-[11px] font-medium text-mist">
              {badge}
            </span>
          ) : null}
        </div>
        {subtitle ? <p className="mt-1 text-[14px] leading-6 text-mist">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
