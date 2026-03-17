import { BedDouble, CloudSun, Flag, MapPinned } from 'lucide-react'
import type { TripDay } from '../types'
import { formatTimeRange } from '../utils/trip'
import { SectionCard } from './SectionCard'

interface QuickViewProps {
  day: TripDay
}

export function QuickView({ day }: QuickViewProps) {
  const essentials = [...day.transportation, ...day.itinerary]
    .filter((item) => item.isStarred || item.flag === 'important' || item.flag === 'must-do')
    .slice(0, 5)

  return (
    <SectionCard
      title="今日模式 / Quick View"
      subtitle="旅行途中快速打開看的精簡版"
      action={<span className="chip bg-blossom/20 text-[#8f5e5e]">Day {day.dayNumber}</span>}
    >
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-3">
          <div className="rounded-3xl bg-gradient-to-br from-sand to-blossom/10 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-ink/45">{day.weekday}</div>
            <div className="mt-2 font-display text-[1.9rem] leading-tight text-ink">{day.title}</div>
            <p className="mt-2 text-sm leading-7 text-ink/65">{day.summary}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-ink/10 bg-white p-4">
              <CloudSun size={18} className="text-sage" />
              <div className="mt-3 text-sm font-semibold">天氣</div>
              <div className="mt-1 text-sm text-ink/65">{day.weather}</div>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-white p-4">
              <BedDouble size={18} className="text-sage" />
              <div className="mt-3 text-sm font-semibold">住宿</div>
              <div className="mt-1 text-sm text-ink/65">{day.hotel}</div>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-white p-4">
              <MapPinned size={18} className="text-sage" />
              <div className="mt-3 text-sm font-semibold">城市</div>
              <div className="mt-1 text-sm text-ink/65">{day.city}</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-sage/15 bg-sage/10 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-sage">
            <Flag size={16} />
            今天重點
          </div>
          <div className="space-y-3">
            {essentials.length > 0 ? (
              essentials.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/90 p-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                    {formatTimeRange(item.time, item.endTime)}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink">{item.title}</div>
                  {item.description ? (
                    <p className="mt-1 text-sm text-ink/65">{item.description}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white/90 p-4 text-sm text-ink/55">
                這一天還沒有標記重要項目，之後可在清單內加星。
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
