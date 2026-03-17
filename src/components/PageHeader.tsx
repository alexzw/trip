interface PageHeaderProps {
  title: string
  subtitle?: string
  meta?: string
  action?: React.ReactNode
  emoji?: string
}

export function PageHeader({ title, subtitle, meta, action, emoji }: PageHeaderProps) {
  return (
    <header className="mb-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-[22px] font-semibold text-ink">
            {emoji ? <span className="text-[20px]">{emoji}</span> : null}
            <span>{title}</span>
          </h1>
          {subtitle ? <p className="mt-1 text-[14px] text-mist">{subtitle}</p> : null}
          {meta ? <p className="mt-2 text-[12px] font-medium text-mist">{meta}</p> : null}
        </div>
        {action}
      </div>
    </header>
  )
}
