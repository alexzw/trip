import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState, type ReactNode } from 'react'

interface SectionBlockProps {
  title: string
  subtitle?: string
  children: ReactNode
  defaultOpen?: boolean
  action?: ReactNode
}

export function SectionBlock({
  title,
  subtitle,
  children,
  defaultOpen = true,
  action,
}: SectionBlockProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="panel p-4">
      <button onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 text-left">
        <div>
          <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
          {subtitle ? <p className="mt-1 text-[13px] text-mist">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {open ? <ChevronUp size={18} className="text-mist" /> : <ChevronDown size={18} className="text-mist" />}
        </div>
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </section>
  )
}
