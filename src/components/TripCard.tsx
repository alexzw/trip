import { ArrowRight, CalendarRange, MapPin } from 'lucide-react'
import type { TripData } from '../types'

interface TripCardProps {
  trip: TripData
  status: 'upcoming' | 'ongoing' | 'completed' | 'draft'
  totalDays: number
  onOpen: () => void
}

const statusLabel = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
  draft: 'Draft',
}

export function TripCard({ trip, status, totalDays, onOpen }: TripCardProps) {
  const destination = trip.cityTags.join(' · ') || trip.route.slice(1, -1).join(' · ') || '未設定目的地'

  return (
    <button
      onClick={onOpen}
      className="w-full rounded-[18px] border border-slate bg-white p-5 text-left shadow-card transition active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex rounded-full bg-[#F1F1EF] px-3 py-1 text-[12px] font-medium text-mist">
            {statusLabel[status]}
          </div>
          <h2 className="mt-4 text-[20px] font-semibold tracking-tight text-ink">{trip.title}</h2>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-mist">
            <MapPin size={14} />
            <span className="truncate">{destination}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-mist">
            <CalendarRange size={14} />
            <span>{trip.dateRange || '未設定日期'}</span>
          </div>
        </div>
        <div className="rounded-2xl bg-[#F7F6F3] px-3 py-2 text-right">
          <div className="text-[11px] uppercase tracking-[0.18em] text-mist">Days</div>
          <div className="mt-1 text-[20px] font-semibold text-ink">{totalDays}</div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate pt-4">
        <div className="text-[13px] text-mist">{trip.travelers.map((traveler) => traveler.name).join(' · ')}</div>
        <div className="inline-flex items-center gap-2 text-[13px] font-medium text-sage">
          <span>Open trip</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </button>
  )
}
