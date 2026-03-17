import { ExternalLink, PencilLine } from 'lucide-react'

interface NextActionCardProps {
  title: string
  time: string
  location?: string
  subtitle?: string
  onNavigate?: () => void
  onEdit?: () => void
  onToggleDone?: () => void
  isDone?: boolean
}

export function NextActionCard({
  title,
  time,
  location,
  subtitle,
  onNavigate,
  onEdit,
  onToggleDone,
  isDone,
}: NextActionCardProps) {
  return (
    <section className="touch-card border-[#DCEAE4] bg-[linear-gradient(180deg,#FFFFFF_0%,#F7FBF9_100%)] p-5">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-sage">
        <span className="text-[14px]">🔥</span>
        <span>Next Action</span>
      </div>
      <div className="mt-4 text-[20px] font-bold leading-tight text-ink">{title}</div>
      <div className="mt-2 text-[14px] text-mist">{time}</div>
      {location ? <div className="mt-1 text-[16px] font-medium text-ink">{location}</div> : null}
      {subtitle ? <div className="mt-2 text-[14px] text-mist">{subtitle}</div> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {onNavigate ? (
          <button
            onClick={onNavigate}
            className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-[14px] font-medium text-white"
          >
            <ExternalLink size={14} />
            導航
          </button>
        ) : null}
        {onEdit ? (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full border border-slate bg-white px-4 py-2 text-[14px] font-medium text-ink"
          >
            <PencilLine size={14} />
            編輯
          </button>
        ) : null}
        {onToggleDone ? (
          <button
            onClick={onToggleDone}
            className={`rounded-full px-4 py-2 text-[14px] font-medium ${
              isDone ? 'border border-slate bg-[#F4F5F2] text-mist' : 'bg-ink text-white'
            }`}
          >
            {isDone ? 'Undo' : '完成'}
          </button>
        ) : null}
      </div>
    </section>
  )
}
