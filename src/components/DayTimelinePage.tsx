import { ChevronLeft, ChevronRight, Hotel, Link2, MapPinned, NotebookPen, Umbrella } from 'lucide-react'
import type { TripDay } from '../types'
import { formatDisplayDate, getCurrentEntryIndex, getTrackableEntries } from '../utils/trip'
import { AppHeader } from './AppHeader'
import { EventCard } from './EventCard'
import { EmptyState } from './EmptyState'
import { SectionBlock } from './SectionBlock'
import { SectionHeader } from './SectionHeader'

interface DayTimelinePageProps {
  day: TripDay
  onBack: () => void
  onPrevDay: () => void
  onNextDay: () => void
  onOpenEvent: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onToggleDone: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
}

const categoryEmoji: Record<string, string> = {
  transportation: '✈️',
  itinerary: '📍',
  meals: '🍽️',
}

export function DayTimelinePage({
  day,
  onBack,
  onPrevDay,
  onNextDay,
  onOpenEvent,
  onToggleDone,
}: DayTimelinePageProps) {
  const entries = getTrackableEntries(day)
  const currentIndex = getCurrentEntryIndex(day)

  return (
    <div className="space-y-4">
      <header className="sticky top-0 z-20 -mx-4 border-b border-slate bg-[#F7F6F3]/95 px-4 pb-4 pt-2 backdrop-blur">
        <AppHeader
          eyebrow={`Day ${day.dayNumber}`}
          title={day.city || day.title}
          subtitle={day.summary || '這一天的完整 timeline'}
          meta={formatDisplayDate(day.date, day.weekday)}
          backLabel="Itinerary"
          onBack={onBack}
          action={
            <div className="mt-14 flex items-center gap-2">
              <button onClick={onPrevDay} className="rounded-full border border-slate bg-white p-2 text-mist">
                <ChevronLeft size={16} />
              </button>
              <button onClick={onNextDay} className="rounded-full border border-slate bg-white p-2 text-mist">
                <ChevronRight size={16} />
              </button>
            </div>
          }
        />
      </header>

      <section className="rounded-2xl border border-slate bg-white p-5 shadow-card">
        <SectionHeader title="Overview" subtitle="今日主題與閱讀前提。" />
        <div className="mt-3 text-[18px] font-semibold text-ink">{day.title}</div>
        <div className="mt-2 text-[14px] leading-6 text-mist">{day.summary || '未填當日摘要'}</div>
      </section>

      <section className="rounded-2xl border border-slate bg-white p-5 shadow-card">
        <SectionHeader title="Schedule" subtitle="一眼看清今天時間線，不要長段落。" />
        {entries.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No events yet" description="加一個交通、行程或餐飲項目，這天就會開始有節奏。" />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {entries.map((entry, index) => (
              <EventCard
                key={entry.id}
                item={entry.item}
                categoryLabel={entry.collection}
                icon={categoryEmoji[entry.collection]}
                state={entry.item.isDone ? 'completed' : index === currentIndex ? 'current' : index === currentIndex + 1 ? 'next' : 'upcoming'}
                onOpen={() => onOpenEvent(entry.collection, entry.item.id)}
                onToggleDone={() => onToggleDone(entry.collection, entry.item.id)}
              />
            ))}
          </div>
        )}
      </section>

      <SectionBlock title="Stay" subtitle="酒店、天氣與當日基礎資訊">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] text-ink">
            <Hotel size={15} className="text-mist" />
            {day.hotel || '未安排住宿'}
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] text-ink">
            <MapPinned size={15} className="text-mist" />
            {day.weather || '未設定天氣'}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock title="Notes" subtitle="保留必要但非即時決策內容" defaultOpen={false}>
        <div className="space-y-3">
          {day.notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate bg-[#FBFBFA] px-4 py-3 text-[14px] text-mist">未填 notes</div>
          ) : (
            day.notes.map((note) => (
              <div key={note.id} className="rounded-2xl border border-slate bg-white p-4">
                <div className="flex items-start gap-2">
                  <NotebookPen size={15} className="mt-0.5 text-mist" />
                  <div>
                    <div className="text-[14px] font-medium text-ink">{note.title}</div>
                    <div className="mt-1 text-[14px] leading-6 text-mist">{note.content}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionBlock>

      <SectionBlock title="Plan B" subtitle="雨天或變動時使用" defaultOpen={false}>
        <div className="space-y-3">
          {day.planB.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate bg-[#FBFBFA] px-4 py-3 text-[14px] text-mist">未設定備案</div>
          ) : (
            day.planB.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate bg-white p-4">
                <div className="flex items-start gap-2">
                  <Umbrella size={15} className="mt-0.5 text-mist" />
                  <div>
                    <div className="text-[14px] font-medium text-ink">{item.title}</div>
                    <div className="mt-1 text-[14px] leading-6 text-mist">{item.content}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionBlock>

      <SectionBlock title="Links" subtitle="票券、地圖與狀態頁" defaultOpen={false}>
        <div className="space-y-3">
          {day.links.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate bg-[#FBFBFA] px-4 py-3 text-[14px] text-mist">未加入 day-level links</div>
          ) : (
            day.links.map((link) => (
              <button
                key={link.id}
                onClick={() => window.open(link.url, '_blank', 'noreferrer')}
                className="flex w-full items-center justify-between rounded-2xl border border-slate bg-white px-4 py-3 text-left text-[14px] font-medium text-ink"
              >
                <span>{link.label}</span>
                <Link2 size={15} className="text-mist" />
              </button>
            ))
          )}
        </div>
      </SectionBlock>
    </div>
  )
}
