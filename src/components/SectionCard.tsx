import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <section className="panel p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate pb-4">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle ? <p className="muted mt-1">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
