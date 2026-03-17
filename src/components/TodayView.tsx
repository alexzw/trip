import { useEffect, useState } from 'react'
import {
  BedDouble,
  ChevronDown,
  ChevronUp,
  CloudSun,
  Plus,
  PencilLine,
  ExternalLink,
  MapPinned,
  QrCode,
  Ticket,
} from 'lucide-react'
import type { MealItem, TimelineItem, TripDay } from '../types'
import {
  formatDisplayDate,
  formatTimeRange,
  getCurrentEntryIndex,
  getNextAction,
  getNextMeal,
  getTimelineWindow,
} from '../utils/trip'

interface TodayViewProps {
  day: TripDay
  onToggleDone: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onEditItem: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onAddItem: (collection: 'transportation' | 'itinerary' | 'meals') => void
}

const iconByCollection: Record<'transportation' | 'itinerary' | 'meals', string> = {
  transportation: '🚆',
  itinerary: '📍',
  meals: '🍽️',
}

function openPrimaryLink(item: TimelineItem | MealItem) {
  return item.links?.[0]?.url
}

function itemLocation(item: TimelineItem | MealItem, fallback?: string) {
  return ('locationName' in item ? item.locationName : undefined) || item.description || fallback || ''
}

function MiniLinkButton({ url, label }: { url?: string; label: string }) {
  if (!url) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-pine/10 bg-pine/10 px-4 py-2 text-sm font-semibold text-pine"
    >
      <ExternalLink size={14} />
      {label}
    </a>
  )
}

export function TodayView({ day, onToggleDone, onEditItem, onAddItem }: TodayViewProps) {
  const [essentialsOpen, setEssentialsOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const nextAction = getNextAction(day)
  const nextMeal = getNextMeal(day)
  const timeline = getTimelineWindow(day, 5)
  const currentIndex = getCurrentEntryIndex(day)
  const keyTransport = day.transportation.filter(
    (item) => item.bookingReference || item.seatInfo || item.links?.some((link) => link.type === 'ticket'),
  )
  const qrLinks = [
    ...day.links.filter((link) => link.type === 'ticket' || link.type === 'status'),
    ...keyTransport.flatMap((item) => item.links ?? []).filter((link) => link.type === 'ticket' || link.type === 'status'),
  ]

  return (
    <div className="space-y-4">
      <section className="panel overflow-hidden p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-pine/70">Today</div>
            <h1 className="mt-2 font-display text-[2.2rem] font-semibold leading-none text-ink">Day {day.dayNumber}</h1>
            <div className="mt-2 text-lg font-semibold text-ink">{day.city}</div>
            <div className="mt-1 text-sm text-mist">{formatDisplayDate(day.date, day.weekday)}</div>
          </div>
          <div className="rounded-[22px] border border-white/80 bg-[#f6f8fc]/90 px-4 py-3 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-pine/65">天氣</div>
            <div className="mt-1 text-sm font-medium text-ink/85">{day.weather}</div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onAddItem('itinerary')}
            className="inline-flex items-center gap-2 rounded-full border border-pine/10 bg-pine/10 px-4 py-2 text-sm font-semibold text-pine"
          >
            <Plus size={14} />
            加行程
          </button>
          <button
            onClick={() => onAddItem('transportation')}
            className="inline-flex items-center gap-2 rounded-full border border-slate bg-white px-4 py-2 text-sm font-semibold text-ink"
          >
            <Plus size={14} />
            加交通
          </button>
          <button
            onClick={() => onAddItem('meals')}
            className="inline-flex items-center gap-2 rounded-full border border-slate bg-white px-4 py-2 text-sm font-semibold text-ink"
          >
            <Plus size={14} />
            加餐飲
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-white/90 bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] px-5 py-5 text-ink shadow-[0_18px_50px_rgba(10,132,255,0.08)]">
        <div className="text-xs font-semibold uppercase tracking-[0.26em] text-pine/75">Next Action</div>
        {nextAction ? (
          <div className="mt-4">
            <div className="text-sm font-semibold text-pine/80">
              {formatTimeRange(nextAction.item.time, nextAction.item.endTime)} · {iconByCollection[nextAction.collection]}{' '}
              {nextAction.collection === 'transportation'
                ? '交通'
                : nextAction.collection === 'meals'
                  ? '餐飲'
                  : '行程'}
            </div>
            <div className="mt-2 text-[1.95rem] font-semibold leading-tight tracking-[-0.02em]">{nextAction.item.title}</div>
            <div className="mt-2 text-sm leading-6 text-mist">
              {itemLocation(nextAction.item, '打開地圖即可出發')}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <MiniLinkButton url={openPrimaryLink(nextAction.item)} label="一鍵打開地圖" />
              <button
                onClick={() => onEditItem(nextAction.collection, nextAction.item.id)}
                className="inline-flex items-center gap-2 rounded-full border border-slate bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                <PencilLine size={14} />
                編輯
              </button>
              <button
                onClick={() => onToggleDone(nextAction.collection, nextAction.item.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  nextAction.item.isDone
                    ? 'border-slate bg-[#f5f7fb] text-mist'
                    : 'border-pine/15 bg-pine text-white shadow-[0_8px_20px_rgba(10,132,255,0.18)]'
                }`}
              >
                {nextAction.item.isDone ? 'Undo 完成' : '完成這一步'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/80">今天暫時沒有已排定項目。</div>
        )}
      </section>

      <section className="panel p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-ink">🕐 Timeline</div>
            <p className="mt-1 text-sm text-mist">只保留現在附近最值得看的 3-5 個 item</p>
          </div>
          <div className="rounded-full border border-slate bg-white px-3 py-1 text-xs font-semibold text-pine">
            {new Intl.DateTimeFormat('zh-HK', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }).format(now)}
          </div>
        </div>

        <div className="space-y-3">
          {timeline.entries.map((entry, index) => {
            const absoluteIndex = timeline.startIndex + index
            const isCurrent = absoluteIndex === currentIndex
            const isNext = absoluteIndex === currentIndex + 1
            const done = entry.item.isDone
            return (
              <article
                key={`${entry.collection}-${entry.id}`}
                className={`grid grid-cols-[68px_1fr] gap-3 rounded-[24px] border p-4 transition ${
                  isCurrent
                    ? 'border-pine/18 bg-[#f3f8ff] shadow-[0_0_0_1px_rgba(10,132,255,0.05)]'
                    : isNext
                      ? 'border-gold/25 bg-gold/10'
                      : done
                        ? 'border-slate/80 bg-[#f7f9fc] text-mist/70'
                        : 'border-slate/80 bg-white'
                }`}
              >
                <div className="pt-1 text-sm font-semibold text-ink/80">
                  <div>{entry.item.time}</div>
                  <div className="mt-2 text-xl leading-none">{done ? '✔' : iconByCollection[entry.collection]}</div>
                </div>

                <div className="min-w-0">
                  <div className="text-base font-semibold text-ink">{entry.item.title}</div>
                  <div className="mt-1 text-sm text-mist">
                    {itemLocation(entry.item, day.city)}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => onToggleDone(entry.collection, entry.item.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        done ? 'bg-slate/60 text-mist' : 'bg-[#f2f6fd] text-ink'
                      }`}
                    >
                      {done ? '恢復這一步' : '標記完成'}
                    </button>
                    <button
                      onClick={() => onEditItem(entry.collection, entry.item.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate bg-white px-3 py-1.5 text-xs font-semibold text-ink"
                    >
                      <PencilLine size={13} />
                      編輯
                    </button>
                    <MiniLinkButton url={openPrimaryLink(entry.item)} label="地圖" />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="panel p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-ink">🍽 下一餐</div>
            <p className="mt-1 text-sm text-mist">肚餓時不用再翻整份 itinerary</p>
          </div>
        </div>
        {nextMeal ? (
          <div className="mt-3 rounded-[24px] border border-slate bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {formatTimeRange(nextMeal.time, nextMeal.endTime)}
            </div>
            <div className="mt-2 text-lg font-semibold text-ink">{nextMeal.title}</div>
            {nextMeal.description ? <p className="mt-2 text-sm leading-6 text-mist">{nextMeal.description}</p> : null}
            <div className="mt-3">
              <MiniLinkButton url={openPrimaryLink(nextMeal)} label="快速導航" />
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-[24px] bg-[#f7f9fc] p-4 text-sm text-mist">今天還沒有餐飲安排。</div>
        )}
      </section>

      <section className="panel p-4">
        <button
          onClick={() => setEssentialsOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div>
            <div className="text-base font-semibold text-ink">🎫 Today Essentials</div>
            <p className="mt-1 text-sm text-mist">票券、QR、預約號、酒店都集中在這裡</p>
          </div>
          {essentialsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {essentialsOpen ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-[24px] border border-slate bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                <BedDouble size={16} className="text-sage" />
                今日酒店
              </div>
              <div className="text-sm text-ink/80">{day.hotel}</div>
            </div>

            {keyTransport.length ? (
              <div className="rounded-[24px] border border-slate bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                  <Ticket size={16} className="text-sage" />
                  車票 / 航班 / 預約號
                </div>
                <div className="space-y-3">
                  {keyTransport.map((item) => (
                    <div key={item.id} className="rounded-[20px] bg-[#f5f7fb] p-3">
                      <div className="text-sm font-semibold text-ink">{item.title}</div>
                      <div className="mt-1 text-xs text-mist">{formatTimeRange(item.time, item.endTime)}</div>
                      {item.bookingReference ? (
                        <div className="mt-2 text-sm text-pine">預約號：{item.bookingReference}</div>
                      ) : null}
                      {item.seatInfo ? <div className="mt-1 text-sm text-pine">座位：{item.seatInfo}</div> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {qrLinks.length ? (
              <div className="rounded-[24px] border border-slate bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                  <QrCode size={16} className="text-sage" />
                  快速打開
                </div>
                <div className="flex flex-wrap gap-2">
                  {qrLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-pine/10 bg-pine/10 px-3 py-2 text-sm font-medium text-pine"
                    >
                      <ExternalLink size={14} />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-slate bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                  <CloudSun size={16} className="text-sage" />
                  天氣
                </div>
                <div className="text-sm text-ink/80">{day.weather}</div>
              </div>
              <div className="rounded-[24px] border border-slate bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                  <MapPinned size={16} className="text-sage" />
                  今日重點
                </div>
                <div className="text-sm text-ink/80">{day.summary}</div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
