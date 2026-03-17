import { Check, ChevronRight, MapPin, Star } from 'lucide-react'
import type { MealItem, TimelineItem } from '../types'
import { formatTimeRange } from '../utils/trip'

interface EventCardProps {
  item: TimelineItem | MealItem
  categoryLabel: string
  icon: string
  state: 'completed' | 'current' | 'next' | 'upcoming'
  onOpen: () => void
  onToggleDone: () => void
}

export function EventCard({ item, categoryLabel, icon, state, onOpen, onToggleDone }: EventCardProps) {
  const stateClass =
    state === 'current'
      ? 'border-sage bg-[#EEF4F1]'
      : state === 'next'
        ? 'border-[#D8E6E0] bg-[#F8FBF9]'
        : 'border-slate bg-white'

  return (
    <article className={`rounded-2xl border p-4 shadow-card transition ${stateClass} ${item.isDone ? 'opacity-55' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggleDone}
          className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
            item.isDone ? 'border-sage bg-sage text-white' : 'border-slate bg-white text-mist'
          }`}
          aria-label={item.isDone ? '標記為未完成' : '標記完成'}
        >
          {item.isDone ? <Check size={14} /> : <span className="h-2.5 w-2.5 rounded-full bg-current/20" />}
        </button>
        <button onClick={onOpen} className="flex-1 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[12px] font-medium text-mist">{formatTimeRange(item.time, item.endTime)}</div>
            <div className="text-[12px] text-mist">{categoryLabel}</div>
          </div>
          <div className="mt-2 flex items-start gap-3">
            <div className="text-[18px]">{icon}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-semibold text-ink">{item.title}</h3>
                {item.isStarred ? <Star size={14} className="fill-[#E8AFA6] text-[#E8AFA6]" /> : null}
              </div>
              {'locationName' in item && item.locationName ? (
                <div className="mt-1 flex items-center gap-1 text-[13px] text-mist">
                  <MapPin size={13} />
                  <span>{item.locationName}</span>
                </div>
              ) : null}
              {item.description ? <p className="mt-2 text-[13px] leading-5 text-mist">{item.description}</p> : null}
            </div>
            <ChevronRight size={16} className="mt-1 shrink-0 text-mist" />
          </div>
        </button>
      </div>
    </article>
  )
}
