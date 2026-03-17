import { ArrowRight, CalendarDays, CheckCircle2, CloudSun, Hotel } from 'lucide-react'
import type { TripDay } from '../types'
import { formatDisplayDate, getDayProgress } from '../utils/trip'

interface DayCardProps {
  day: TripDay
  onOpen: () => void
}

export function DayCard({ day, onOpen }: DayCardProps) {
  const progress = getDayProgress(day)
  const nextHeadline = day.itinerary[0]?.title ?? day.transportation[0]?.title ?? day.meals[0]?.title ?? '未安排'

  return (
    <button
      onClick={onOpen}
      className="w-full rounded-2xl border border-slate bg-white p-4 text-left shadow-card transition active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-medium text-mist">Day {day.dayNumber}</div>
          <div className="mt-1 text-[18px] font-semibold text-ink">{day.city || day.title}</div>
          <div className="mt-1 text-[13px] text-mist">{formatDisplayDate(day.date, day.weekday)}</div>
        </div>
        <div className="rounded-2xl bg-[#F7F6F3] px-3 py-2 text-right">
          <div className="text-[11px] uppercase tracking-[0.16em] text-mist">Done</div>
          <div className="mt-1 text-[18px] font-semibold text-ink">{progress}%</div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-[13px] text-mist">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} />
          <span className="truncate">{nextHeadline}</span>
        </div>
        <div className="flex items-center gap-2">
          <CloudSun size={14} />
          <span>{day.weather || '未設定天氣'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Hotel size={14} />
          <span className="truncate">{day.hotel || '未安排住宿'}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate pt-3">
        <div className="inline-flex items-center gap-2 text-[12px] text-mist">
          <CheckCircle2 size={14} />
          <span>{day.transportation.length + day.itinerary.length + day.meals.length} items</span>
        </div>
        <div className="inline-flex items-center gap-2 text-[13px] font-medium text-sage">
          <span>Open timeline</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </button>
  )
}
