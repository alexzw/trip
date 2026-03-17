import { Plus } from 'lucide-react'
import type { ExpenseItem, TripData } from '../types'
import { formatDisplayDate, getTripExpenseTotal, groupExpensesByDay } from '../utils/trip'
import { EmptyState } from './EmptyState'
import { ExpenseItemRow } from './ExpenseItemRow'
import { SectionHeader } from './SectionHeader'
import { SectionBlock } from './SectionBlock'

interface ExpensesViewProps {
  trip: TripData
  expenses: ExpenseItem[]
  onAdd: () => void
}

export function ExpensesView({ trip, expenses, onAdd }: ExpensesViewProps) {
  const grouped = groupExpensesByDay(expenses, trip.id)
  const total = getTripExpenseTotal(expenses, trip.id)

  if (Object.keys(grouped).length === 0) {
    return (
      <EmptyState
        title="No expenses yet"
        description="旅途中想記帳時，這裡會變成很順手的每日花費列表。"
        actionLabel="新增支出"
        onAction={onAdd}
      />
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <SectionHeader title="Trip total" subtitle="輕量但實用的旅程花費總覽。" />
            <div className="mt-2 text-[28px] font-semibold text-ink">JPY {total.toLocaleString()}</div>
          </div>
          <button onClick={onAdd} className="inline-flex h-11 items-center gap-2 rounded-full border border-slate px-4 text-[14px] font-medium text-ink">
            <Plus size={16} />
            Add
          </button>
        </div>
      </section>
      {Object.entries(grouped).map(([date, items]) => (
        <SectionBlock key={date} title={formatDisplayDate(date)} subtitle={`${items.length} items`}>
          <div className="space-y-3">
            {items.map((item) => <ExpenseItemRow key={item.id} item={item} />)}
          </div>
        </SectionBlock>
      ))}
    </div>
  )
}
