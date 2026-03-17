import { Coins } from 'lucide-react'
import type { ExpenseItem } from '../types'

interface ExpenseItemRowProps {
  item: ExpenseItem
}

export function ExpenseItemRow({ item }: ExpenseItemRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate bg-white px-4 py-3">
      <div className="min-w-0">
        <div className="truncate text-[14px] font-medium text-ink">{item.title}</div>
        <div className="mt-1 text-[12px] capitalize text-mist">{item.category}</div>
      </div>
      <div className="ml-3 inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold text-ink">
        <Coins size={14} className="text-mist" />
        {item.currency} {item.amount.toLocaleString()}
      </div>
    </div>
  )
}
