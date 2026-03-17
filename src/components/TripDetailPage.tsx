import { CalendarRange, CheckCheck, ChevronRight, MapPinned } from 'lucide-react'
import type { AppTab, ChecklistSection, ExpenseItem, Footprint, MemoryEntry, TripData } from '../types'
import { formatDateRange, getChecklistProgress, getNextAction, getTripDateMeta } from '../utils/trip'
import { AppHeader } from './AppHeader'
import { DayCard } from './DayCard'
import { EmptyState } from './EmptyState'
import { ExpensesView } from './ExpensesView'
import { MemoriesView } from './MemoriesView'
import { SectionBlock } from './SectionBlock'
import { SectionHeader } from './SectionHeader'
import { TripMapTab } from './TripMapTab'
import { TripTabs } from './TripTabs'

interface TripDetailPageProps {
  trip: TripData
  activeTab: Exclude<AppTab, 'home'>
  footprints: Footprint[]
  expenses: ExpenseItem[]
  memories: MemoryEntry[]
  finalChecks: ChecklistSection[]
  packingChecklist: ChecklistSection[]
  onBack: () => void
  onChangeTab: (tab: Exclude<AppTab, 'home'>) => void
  onOpenDay: (dayId: string) => void
  onAddExpense: () => void
  onAddMemory: () => void
}

export function TripDetailPage({
  trip,
  activeTab,
  footprints,
  expenses,
  memories,
  finalChecks,
  packingChecklist,
  onBack,
  onChangeTab,
  onOpenDay,
  onAddExpense,
  onAddMemory,
}: TripDetailPageProps) {
  const meta = getTripDateMeta(trip)
  const nextAction = trip.days.map((day) => ({ day, entry: getNextAction(day) })).find((item) => item.entry)
  const checklistProgress = getChecklistProgress([...finalChecks, ...packingChecklist])

  return (
    <div className="space-y-5">
      <AppHeader
        eyebrow="Trip detail"
        title={trip.title}
        subtitle={trip.route.join(' → ')}
        meta={`${formatDateRange(meta.start, meta.end)} · ${trip.days.length} days`}
        backLabel="Trips"
        onBack={onBack}
        action={
          <div className="rounded-2xl border border-slate bg-white px-3 py-2 text-right">
            <div className="inline-flex items-center gap-1.5 text-[12px] text-mist">
              <CalendarRange size={13} />
              {trip.days.length} days
            </div>
          </div>
        }
      />

      <TripTabs activeTab={activeTab} onChange={onChangeTab} />

      {activeTab === 'itinerary' ? (
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate bg-white p-5 shadow-card">
            <SectionHeader title="Next action" subtitle="你最可能下一步會打開的內容。" />
            {nextAction?.entry ? (
              <>
                <div className="mt-3 text-[20px] font-semibold text-ink">{nextAction.entry.item.title}</div>
                <div className="mt-1 text-[14px] text-mist">
                  Day {nextAction.day.dayNumber} · {nextAction.day.city}
                </div>
              </>
            ) : (
              <div className="mt-3 text-[14px] text-mist">整個旅程目前未安排事件。</div>
            )}
          </section>

          <section className="rounded-2xl border border-slate bg-white p-5 shadow-card">
            <SectionHeader
              title="Day list"
              subtitle="先選一天，再進入完整 timeline。"
              badge={trip.cityTags.join(' · ')}
              action={<MapPinned size={14} className="mt-1 shrink-0 text-mist" />}
            />
            <div className="mt-4 space-y-3">
              {trip.days.map((day) => (
                <DayCard key={day.id} day={day} onOpen={() => onOpenDay(day.id)} />
              ))}
            </div>
          </section>

          <SectionBlock title="Trip notes" subtitle="保留有用資訊，但不要蓋過 day list" defaultOpen={false}>
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] leading-6 text-mist">
                路線：{trip.route.join(' → ')}
              </div>
              <div className="rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] leading-6 text-mist">
                成員：{trip.travelers.map((traveler) => traveler.note ? `${traveler.name}（${traveler.note}）` : traveler.name).join('、')}
              </div>
            </div>
          </SectionBlock>

          <button
            onClick={() => onChangeTab('expenses')}
            className="flex w-full items-center justify-between rounded-2xl border border-slate bg-white px-4 py-4 text-left shadow-card"
          >
            <div>
              <div className="text-[16px] font-semibold text-ink">Checklist progress</div>
              <div className="mt-1 text-[14px] text-mist">尚有 {checklistProgress.remaining} 項未完成</div>
            </div>
            <ChevronRight size={16} className="text-mist" />
          </button>
        </div>
      ) : null}

      {activeTab === 'map' ? (
        <TripMapTab trip={trip} footprints={footprints} onAddMemory={onAddMemory} />
      ) : null}

      {activeTab === 'expenses' ? (
        <div className="space-y-4">
          <section className="rounded-2xl border border-[#E7EEE9] bg-[#F7FBF8] p-5">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-2xl bg-white p-2 text-sage">
                <CheckCheck size={16} />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-ink">Trip admin</div>
                <div className="mt-1 text-[14px] leading-6 text-mist">
                  Expenses 放在這裡，因為旅途中通常會和票券、付款、預算一起看。
                </div>
              </div>
            </div>
          </section>
          <ExpensesView trip={trip} expenses={expenses} onAdd={onAddExpense} />
        </div>
      ) : null}

      {activeTab === 'memories' ? (
        <MemoriesView trip={trip} memories={memories} footprints={footprints} onAdd={onAddMemory} />
      ) : null}

      {activeTab !== 'itinerary' && activeTab !== 'map' && activeTab !== 'expenses' && activeTab !== 'memories' ? (
        <EmptyState title="Unknown tab" description="請重新選擇旅程分頁。" />
      ) : null}
    </div>
  )
}
