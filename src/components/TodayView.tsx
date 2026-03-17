import { useMemo, useState } from 'react'
import type { MealItem, TimelineItem, TripDay } from '../types'
import {
  formatDisplayDate,
  formatTimeRange,
  getNextAction,
  getNextMeal,
  getTimelineWindow,
} from '../utils/trip'
import { EssentialsCard } from './EssentialsCard'
import { MealCard } from './MealCard'
import { NextActionCard } from './NextActionCard'
import { TimelineItemCard, timelineSubtitle } from './TimelineItemCard'

interface TodayViewProps {
  day: TripDay
  onToggleDone: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onEditItem: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onAddItem: (collection: 'transportation' | 'itinerary' | 'meals') => void
}

function openPrimaryLink(item: TimelineItem | MealItem) {
  const url = item.links?.[0]?.url
  if (url) window.open(url, '_blank', 'noreferrer')
}

export function TodayView({ day, onToggleDone, onEditItem, onAddItem }: TodayViewProps) {
  const [essentialsOpen, setEssentialsOpen] = useState(false)

  const nextAction = getNextAction(day)
  const nextMeal = getNextMeal(day)
  const timelineWindow = getTimelineWindow(day, 5)

  const quickTimeline = useMemo(() => timelineWindow.entries, [timelineWindow.entries])

  const essentialBlocks = [
    ...day.transportation
      .filter((item) => item.bookingReference || item.seatInfo)
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        label: item.title,
        value: [item.bookingReference ? `預約：${item.bookingReference}` : '', item.seatInfo ? `座位：${item.seatInfo}` : '']
          .filter(Boolean)
          .join(' · '),
      })),
  ]

  const quickLinks = [
    ...day.links.filter((link) => link.type === 'ticket' || link.type === 'status'),
    ...day.transportation.flatMap((item) => item.links ?? []).filter((link) => link.type === 'ticket'),
  ].slice(0, 4)

  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-sage">Today</div>
            <div className="mt-2 text-[20px] font-bold text-ink">Day {day.dayNumber}</div>
            <div className="mt-1 text-[16px] font-medium text-ink">{day.city}</div>
            <div className="mt-1 text-[14px] text-mist">{formatDisplayDate(day.date, day.weekday)}</div>
          </div>
          <div className="rounded-2xl bg-[#F5F6F3] px-4 py-3 text-right">
            <div className="text-[12px] font-medium text-mist">天氣</div>
            <div className="mt-1 text-[14px] font-medium text-ink">{day.weather}</div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onAddItem('itinerary')}
            className="rounded-full bg-sage px-4 py-2 text-[14px] font-medium text-white"
          >
            加行程
          </button>
          <button
            onClick={() => onAddItem('transportation')}
            className="rounded-full border border-slate bg-white px-4 py-2 text-[14px] font-medium text-ink"
          >
            加交通
          </button>
          <button
            onClick={() => onAddItem('meals')}
            className="rounded-full border border-slate bg-white px-4 py-2 text-[14px] font-medium text-ink"
          >
            加餐飲
          </button>
        </div>
      </section>

      {nextAction ? (
        <NextActionCard
          title={nextAction.item.title}
          time={formatTimeRange(nextAction.item.time, nextAction.item.endTime)}
          location={('locationName' in nextAction.item ? nextAction.item.locationName : undefined) || day.city}
          subtitle={nextAction.item.description}
          onNavigate={nextAction.item.links?.[0]?.url ? () => openPrimaryLink(nextAction.item) : undefined}
          onEdit={() => onEditItem(nextAction.collection, nextAction.item.id)}
          onToggleDone={() => onToggleDone(nextAction.collection, nextAction.item.id)}
          isDone={nextAction.item.isDone}
        />
      ) : null}

      <section className="panel p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[16px] font-medium text-ink">Timeline</div>
            <div className="mt-1 text-[14px] text-mist">只保留 3–5 個當前最重要 item</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="space-y-3">
            {quickTimeline.map((entry, index) => {
              const state = entry.item.isDone
                ? 'completed'
                : timelineWindow.currentIndex - timelineWindow.startIndex === index
                  ? 'current'
                  : 'upcoming'
              const icon =
                entry.collection === 'transportation' ? '🚉' : entry.collection === 'meals' ? '🍽️' : '📍'

              return (
                <TimelineItemCard
                  key={entry.item.id}
                  time={entry.item.time}
                  title={entry.item.title}
                  subtitle={timelineSubtitle(entry.item, day.city)}
                  icon={icon}
                  state={state}
                  compact
                  onToggleDone={() => onToggleDone(entry.collection, entry.item.id)}
                  onEdit={() => onEditItem(entry.collection, entry.item.id)}
                />
              )
            })}
          </div>
        </div>
      </section>

      <MealCard
        title={nextMeal?.title ?? '未安排'}
        time={nextMeal ? formatTimeRange(nextMeal.time, nextMeal.endTime) : '待安排'}
        description={nextMeal?.description}
        onNavigate={nextMeal?.links?.[0]?.url ? () => openPrimaryLink(nextMeal) : undefined}
      />

      <EssentialsCard
        open={essentialsOpen}
        onToggle={() => setEssentialsOpen((value) => !value)}
        hotel={day.hotel}
        blocks={essentialBlocks}
        quickLinks={quickLinks}
      />
    </div>
  )
}
