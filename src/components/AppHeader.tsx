import { ArrowLeft } from 'lucide-react'

interface AppHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  meta?: string
  backLabel?: string
  onBack?: () => void
  action?: React.ReactNode
}

export function AppHeader({
  eyebrow,
  title,
  subtitle,
  meta,
  backLabel,
  onBack,
  action,
}: AppHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {onBack && backLabel ? (
            <button
              onClick={onBack}
              className="mb-4 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-slate bg-white px-4 text-[13px] font-medium text-ink"
            >
              <ArrowLeft size={15} />
              {backLabel}
            </button>
          ) : null}
          {eyebrow ? <div className="text-[12px] uppercase tracking-[0.18em] text-mist">{eyebrow}</div> : null}
          <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle ? <p className="mt-2 text-[14px] leading-6 text-mist">{subtitle}</p> : null}
          {meta ? <div className="mt-2 text-[13px] text-mist">{meta}</div> : null}
        </div>
        {action}
      </div>
    </header>
  )
}
