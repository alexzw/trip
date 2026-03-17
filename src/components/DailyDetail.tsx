import { useState, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Footprints,
  PencilLine,
  Plus,
  Star,
  StarOff,
  Trash2,
} from 'lucide-react'
import type { FilterCategory, MealItem, TimelineItem, TripDay } from '../types'
import { formatDisplayDate, formatTimeRange } from '../utils/trip'

interface DailyDetailProps {
  day: TripDay
  categoryFilter: FilterCategory
  query: string
  onToggleDone: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onToggleStar: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onEditItem: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onAddItem: (collection: 'transportation' | 'itinerary' | 'meals') => void
  onDeleteItem: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onMoveItem: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string, direction: 'up' | 'down') => void
  onAddToFootprint: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  isInFootprints: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => boolean
}

type FoldKey = 'transportation' | 'itinerary' | 'meals' | 'notes' | 'planB' | 'links'

function matchesQuery(texts: Array<string | undefined>, query: string) {
  if (!query.trim()) {
    return true
  }

  const normalized = query.trim().toLowerCase()
  return texts.some((entry) => (entry ?? '').toLowerCase().includes(normalized))
}

function LinkButtons({ items }: { items?: TripDay['links'] | TimelineItem['links'] | MealItem['links'] }) {
  if (!items || items.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-pine/10 bg-pine/10 px-3 py-2 text-xs font-medium text-pine"
        >
          <ExternalLink size={14} />
          {link.label}
        </a>
      ))}
    </div>
  )
}

function SectionShell({
  title,
  subtitle,
  open,
  onToggle,
  count,
  children,
}: {
  title: string
  subtitle: string
  open: boolean
  onToggle: () => void
  count?: number
  children: ReactNode
}) {
  return (
    <section className="panel p-4">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-left">
        <div>
          <div className="text-base font-semibold text-ink">{title}</div>
          <p className="mt-1 text-sm text-mist">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {typeof count === 'number' ? (
            <span className="rounded-full border border-slate bg-white px-3 py-1 text-xs font-semibold text-pine">
              {count}
            </span>
          ) : null}
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </section>
  )
}

function TimelineRows({
  items,
  collection,
  query,
  categoryFilter,
  onToggleDone,
  onToggleStar,
  onEditItem,
  onAddItem,
  onDeleteItem,
  onMoveItem,
  onAddToFootprint,
  isInFootprints,
}: {
  items: TimelineItem[] | MealItem[]
  collection: 'transportation' | 'itinerary' | 'meals'
  query: string
  categoryFilter: FilterCategory
  onToggleDone: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onToggleStar: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onEditItem: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onAddItem: (collection: 'transportation' | 'itinerary' | 'meals') => void
  onDeleteItem: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  onMoveItem: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string, direction: 'up' | 'down') => void
  onAddToFootprint: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => void
  isInFootprints: (collection: 'transportation' | 'itinerary' | 'meals', itemId: string) => boolean
}) {
  const filteredItems = items.filter((item) => {
    const categoryMatch =
      collection === 'meals'
        ? categoryFilter === 'all' || categoryFilter === 'meal'
        : categoryFilter === 'all' || item.category === categoryFilter

    return (
      categoryMatch &&
      matchesQuery(
        [item.title, item.description, 'bookingReference' in item ? item.bookingReference : undefined],
        query,
      )
    )
  })

  if (!filteredItems.length) {
    return (
      <div className="space-y-3">
        <div className="rounded-[24px] bg-[#f7f9fc] p-4 text-sm text-mist">沒有符合條件的項目。</div>
        <button
          onClick={() => onAddItem(collection)}
          className="inline-flex items-center gap-2 rounded-full border border-pine/10 bg-pine/10 px-4 py-2 text-sm font-semibold text-pine"
        >
          <Plus size={14} />
          新增一項
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => onAddItem(collection)}
        className="inline-flex items-center gap-2 rounded-full border border-pine/10 bg-pine/10 px-4 py-2 text-sm font-semibold text-pine"
      >
        <Plus size={14} />
        新增一項
      </button>
      {filteredItems.map((item) => (
        <article
          key={item.id}
          className={`grid grid-cols-[68px_1fr] gap-3 rounded-[24px] border p-4 transition ${
            item.isDone
              ? 'border-ink/5 bg-ink/5 text-ink/45'
              : item.flag === 'important' || item.flag === 'must-do'
                ? 'border-blossom/30 bg-blossom/10'
                : 'border-slate/80 bg-white'
          }`}
        >
          <button
            onClick={() => onToggleDone(collection, item.id)}
            className="text-left text-sm font-semibold text-ink/80"
            aria-label={item.isDone ? '標記未完成' : '標記完成'}
          >
            <div>{item.time}</div>
            <div className="mt-2 text-xl leading-none">{item.isDone ? '✔' : collection === 'meals' ? '🍽️' : collection === 'transportation' ? '🚆' : '📍'}</div>
          </button>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-ink">{item.title}</div>
                <div className="mt-1 text-sm text-mist">
                  {formatTimeRange(item.time, 'endTime' in item ? item.endTime : undefined)}
                </div>
                {item.description ? <p className="mt-2 text-sm leading-6 text-mist">{item.description}</p> : null}
                {'bookingReference' in item && item.bookingReference ? (
                  <div className="mt-2 text-sm text-pine">預約號：{item.bookingReference}</div>
                ) : null}
                {'seatInfo' in item && item.seatInfo ? (
                  <div className="mt-1 text-sm text-pine">座位：{item.seatInfo}</div>
                ) : null}
              </div>

              <button
                onClick={() => onToggleStar(collection, item.id)}
                className={`rounded-full p-2 ${
                  item.isStarred ? 'text-[#bf8a8a]' : 'text-ink/25 hover:text-[#bf8a8a]'
                }`}
                aria-label={item.isStarred ? '取消收藏' : '加入收藏'}
              >
                {item.isStarred ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => onToggleDone(collection, item.id)}
                className={`rounded-full px-3 py-2 text-xs font-semibold ${
                  item.isDone ? 'bg-slate/60 text-mist' : 'bg-[#f2f6fd] text-ink'
                }`}
              >
                {item.isDone ? '恢復這一步' : '標記完成'}
              </button>
              <button
                onClick={() => onEditItem(collection, item.id)}
                className="inline-flex items-center gap-2 rounded-full border border-slate bg-white px-3 py-2 text-xs font-semibold text-ink"
              >
                <PencilLine size={13} />
                編輯
              </button>
              <button
                onClick={() => onMoveItem(collection, item.id, 'up')}
                className="inline-flex items-center gap-2 rounded-full border border-slate bg-white px-3 py-2 text-xs font-semibold text-ink"
              >
                <ArrowUp size={13} />
                上移
              </button>
              <button
                onClick={() => onMoveItem(collection, item.id, 'down')}
                className="inline-flex items-center gap-2 rounded-full border border-slate bg-white px-3 py-2 text-xs font-semibold text-ink"
              >
                <ArrowDown size={13} />
                下移
              </button>
              <button
                onClick={() => onDeleteItem(collection, item.id)}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-500"
              >
                <Trash2 size={13} />
                刪除
              </button>
              <button
                onClick={() => onAddToFootprint(collection, item.id)}
                disabled={isInFootprints(collection, item.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${
                  isInFootprints(collection, item.id)
                    ? 'bg-ink/10 text-ink/45'
                    : 'border border-pine/10 bg-pine/10 text-pine hover:bg-pine/15'
                }`}
              >
                <Footprints size={14} />
                {isInFootprints(collection, item.id) ? '已加入足跡' : 'Mark as Visited'}
              </button>
            </div>
            <LinkButtons items={item.links} />
          </div>
        </article>
      ))}
    </div>
  )
}

export function DailyDetail({
  day,
  categoryFilter,
  query,
  onToggleDone,
  onToggleStar,
  onEditItem,
  onAddItem,
  onDeleteItem,
  onMoveItem,
  onAddToFootprint,
  isInFootprints,
}: DailyDetailProps) {
  const [folds, setFolds] = useState<Record<FoldKey, boolean>>({
    transportation: false,
    itinerary: true,
    meals: false,
    notes: false,
    planB: false,
    links: false,
  })

  const toggleFold = (key: FoldKey) => setFolds((current) => ({ ...current, [key]: !current[key] }))
  const filteredNotes = day.notes.filter((item) => matchesQuery([item.title, item.content], query))
  const filteredPlanB = day.planB.filter((item) => matchesQuery([item.title, item.content], query))
  const filteredLinks = day.links.filter((item) => matchesQuery([item.label, item.url], query))

  return (
    <div id="day-section" className="space-y-4">
      <section className="panel p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-pine/70">
                Day {day.dayNumber}
              </div>
              <h2 className="mt-2 font-display text-[2rem] leading-tight text-ink">{day.title}</h2>
              <div className="mt-2 text-sm text-mist">{formatDisplayDate(day.date, day.weekday)}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {day.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="metric-card">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-pine/70">城市</div>
              <div className="mt-2 text-base font-semibold text-ink">{day.city}</div>
            </div>
            <div className="metric-card">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/90">天氣</div>
              <div className="mt-2 text-base font-semibold text-ink">{day.weather}</div>
            </div>
            <div className="metric-card">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-rose/90">住宿</div>
              <div className="mt-2 text-base font-semibold text-ink">{day.hotel}</div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate bg-white p-4 text-sm leading-6 text-ink/80">{day.summary}</div>
        </div>
      </section>

      <SectionShell
        title="交通"
        subtitle="航班、車站、移動安排"
        open={folds.transportation}
        onToggle={() => toggleFold('transportation')}
        count={day.transportation.length}
      >
        <TimelineRows
          items={day.transportation}
          collection="transportation"
          query={query}
          categoryFilter={categoryFilter}
          onToggleDone={onToggleDone}
          onToggleStar={onToggleStar}
          onEditItem={onEditItem}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
          onMoveItem={onMoveItem}
          onAddToFootprint={onAddToFootprint}
          isInFootprints={isInFootprints}
        />
      </SectionShell>

      <SectionShell
        title="行程時間軸"
        subtitle="今天真正要做的事"
        open={folds.itinerary}
        onToggle={() => toggleFold('itinerary')}
        count={day.itinerary.length}
      >
        <TimelineRows
          items={day.itinerary}
          collection="itinerary"
          query={query}
          categoryFilter={categoryFilter}
          onToggleDone={onToggleDone}
          onToggleStar={onToggleStar}
          onEditItem={onEditItem}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
          onMoveItem={onMoveItem}
          onAddToFootprint={onAddToFootprint}
          isInFootprints={isInFootprints}
        />
      </SectionShell>

      <SectionShell
        title="餐飲"
        subtitle="下一餐和餐廳地圖都放這裡"
        open={folds.meals}
        onToggle={() => toggleFold('meals')}
        count={day.meals.length}
      >
        <TimelineRows
          items={day.meals}
          collection="meals"
          query={query}
          categoryFilter={categoryFilter}
          onToggleDone={onToggleDone}
          onToggleStar={onToggleStar}
          onEditItem={onEditItem}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
          onMoveItem={onMoveItem}
          onAddToFootprint={onAddToFootprint}
          isInFootprints={isInFootprints}
        />
      </SectionShell>

      <SectionShell
        title="備註"
        subtitle="票券、注意事項、補充資訊"
        open={folds.notes}
        onToggle={() => toggleFold('notes')}
        count={filteredNotes.length}
      >
        {filteredNotes.length ? (
          <div className="space-y-3">
            {filteredNotes.map((item) => (
              <article key={item.id} className="rounded-[24px] border border-slate bg-white p-4">
                <div className="text-base font-semibold text-ink">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-mist">{item.content}</p>
                <LinkButtons items={item.links} />
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] bg-[#f7f9fc] p-4 text-sm text-mist">暫時沒有補充備註。</div>
        )}
      </SectionShell>

      <SectionShell
        title="Plan B"
        subtitle="雨天或體力變化時直接看備案"
        open={folds.planB}
        onToggle={() => toggleFold('planB')}
        count={filteredPlanB.length}
      >
        {filteredPlanB.length ? (
          <div className="space-y-3">
            {filteredPlanB.map((item) => (
              <article key={item.id} className="rounded-[24px] border border-gold/20 bg-[#fff7eb] p-4">
                <div className="text-base font-semibold text-ink">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-mist">{item.content}</p>
                <LinkButtons items={item.links} />
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] bg-[#f7f9fc] p-4 text-sm text-mist">這一天沒有設定 Plan B。</div>
        )}
      </SectionShell>

      <SectionShell
        title="外部連結"
        subtitle="地圖、票券、補充資訊"
        open={folds.links}
        onToggle={() => toggleFold('links')}
        count={filteredLinks.length}
      >
        {filteredLinks.length ? (
          <LinkButtons items={filteredLinks} />
        ) : (
          <div className="rounded-[24px] bg-[#f7f9fc] p-4 text-sm text-mist">目前沒有符合條件的連結。</div>
        )}
      </SectionShell>
    </div>
  )
}
