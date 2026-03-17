import { ExternalLink } from 'lucide-react'

interface MealCardProps {
  title: string
  time: string
  description?: string
  onNavigate?: () => void
}

export function MealCard({ title, time, description, onNavigate }: MealCardProps) {
  return (
    <section className="touch-card">
      <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-mist">Next Meal</div>
      <div className="mt-3 text-[16px] font-semibold text-ink">{title || '未安排'}</div>
      <div className="mt-1 text-[14px] text-mist">{time}</div>
      {description ? <div className="mt-2 text-[14px] text-mist">{description}</div> : null}
      {onNavigate ? (
        <button
          onClick={onNavigate}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D9E6E0] bg-[#F1F7F4] px-4 py-2 text-[14px] font-medium text-sage"
        >
          <ExternalLink size={14} />
          導航
        </button>
      ) : null}
    </section>
  )
}
