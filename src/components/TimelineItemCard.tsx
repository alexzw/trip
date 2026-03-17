import { Check, PencilLine } from 'lucide-react'
import type { MealItem, TimelineItem } from '../types'

interface TimelineItemCardProps {
  time: string
  title: string
  subtitle?: string
  icon: string
  state?: 'current' | 'completed' | 'upcoming'
  onToggleDone?: () => void
  onEdit?: () => void
  compact?: boolean
}

export function TimelineItemCard({
  time,
  title,
  subtitle,
  icon,
  state = 'upcoming',
  onToggleDone,
  onEdit,
  compact = false,
}: TimelineItemCardProps) {
  const stateClass =
    state === 'current'
      ? 'border-[#CFE2DB] bg-[#F3FAF7]'
      : state === 'completed'
        ? 'border-slate bg-[#F7F7F5] text-mist'
        : 'border-slate bg-white'

  return (
    <article className={`touch-card ${stateClass} ${compact ? 'p-3' : 'p-4'}`}>
      <div className="grid grid-cols-[56px_1fr_auto] items-start gap-3">
        <div>
          <div className="text-[12px] font-semibold text-mist">{time || '--:--'}</div>
          <div className="mt-2 text-xl leading-none">{state === 'completed' ? '✔' : icon}</div>
        </div>
        <div className="min-w-0">
          <div className={`text-[16px] font-semibold ${state === 'completed' ? 'text-mist' : 'text-ink'}`}>
            {title || '未命名項目'}
          </div>
          {subtitle ? <div className="mt-1 text-[14px] text-mist">{subtitle}</div> : null}
        </div>
        <div className="flex flex-col gap-2">
          {onEdit ? (
            <button
              onClick={onEdit}
              className="rounded-full border border-slate bg-white p-2 text-mist"
              aria-label="編輯項目"
            >
              <PencilLine size={14} />
            </button>
          ) : null}
          {onToggleDone ? (
            <button
              onClick={onToggleDone}
              className={`rounded-full p-2 ${state === 'completed' ? 'bg-[#EEF2F0] text-mist' : 'bg-[#EEF5F2] text-sage'}`}
              aria-label={state === 'completed' ? '恢復項目' : '完成項目'}
            >
              <Check size={14} />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function timelineSubtitle(item: TimelineItem | MealItem, fallback?: string) {
  return ('locationName' in item ? item.locationName : undefined) || item.description || fallback || ''
}
