interface PageHeaderProps {
  title: string
  subtitle?: string
  meta?: string
  action?: React.ReactNode
}

export function PageHeader({ title, subtitle, meta, action }: PageHeaderProps) {
  return (
    <header className="mb-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-ink">{title}</h1>
          {subtitle ? <p className="mt-1 text-[14px] text-mist">{subtitle}</p> : null}
          {meta ? <p className="mt-2 text-[12px] font-medium text-mist">{meta}</p> : null}
        </div>
        {action}
      </div>
    </header>
  )
}
