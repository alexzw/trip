import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate/80 pb-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-pine/70">Travel OS</div>
          <h2 className="section-title mt-2">{title}</h2>
          {subtitle ? <p className="muted mt-1">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
