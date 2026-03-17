import { CalendarDays, Cherry, MapPinned, Users } from 'lucide-react'
import type { TripData } from '../types'

interface OverviewPanelProps {
  trip: TripData
  overallProgress: number
}

export function OverviewPanel({ trip, overallProgress }: OverviewPanelProps) {
  return (
    <section id="overview" className="panel overflow-hidden p-5 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-5">
          <div>
            <div className="chip mb-4 border-pine/10 bg-pine/10 text-pine">Travel Control Center</div>
            <h1 className="font-display text-[2rem] leading-tight text-ink sm:text-5xl">
              {trip.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-mist sm:text-base">
              這是偏 Apple app 風格的 travel dashboard。整體更克制、留白更多、閱讀負擔更低，適合在 iPhone 上快速做決策。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="metric-card">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-pine">
                <CalendarDays size={16} />
                旅程長度
              </div>
              <div className="text-xl font-semibold text-ink sm:text-2xl">{trip.days.length} Days</div>
              <p className="mt-2 text-sm text-mist">{trip.dateRange}</p>
            </div>
            <div className="metric-card">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gold">
                <Users size={16} />
                成員
              </div>
              <div className="text-base font-semibold text-ink sm:text-lg">
                {trip.travelers.map((traveler) => traveler.name).join('、')}
              </div>
              <p className="mt-2 text-sm text-mist">
                {trip.travelers.find((traveler) => traveler.note)?.note}
              </p>
            </div>
            <div className="metric-card">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-rose">
                <Cherry size={16} />
                目前進度
              </div>
              <div className="text-xl font-semibold text-ink sm:text-2xl">{overallProgress}%</div>
              <p className="mt-2 text-sm text-mist">可勾選項目平均完成度</p>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <MapPinned size={16} className="text-pine" />
              路線
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-ink/80">
              {trip.route.map((stop, index) => (
                <span key={`${stop}-${index}`} className="chip">
                  {stop}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="section-title">櫻花觀看指數</h2>
              <p className="muted mt-1">依日本氣象 2026/3/12 第8回預測推算</p>
            </div>
            <span className="chip">持續更新</span>
          </div>

          <div className="space-y-3">
            {trip.sakuraForecast.map((entry) => (
              <article
                key={entry.id}
                className="rounded-3xl border border-slate bg-gradient-to-r from-white to-[#f7fbff] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-ink">{entry.label}</div>
                    <p className="mt-1 text-sm text-mist">{entry.prediction}</p>
                  </div>
                  <div className="rounded-full border border-gold/20 bg-[#fff7eb] px-3 py-1 text-sm font-semibold text-gold">
                    {entry.score}/10
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-mist">{entry.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 rounded-3xl bg-[#f7f9fc] p-4 text-sm leading-6 text-mist">
            以上為按城市級預測推算，實際花況仍會受風雨與地點微氣候影響。
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {trip.cityTags.map((city) => (
          <span key={city} className="chip bg-white">
            {city}
          </span>
        ))}
      </div>
    </section>
  )
}
