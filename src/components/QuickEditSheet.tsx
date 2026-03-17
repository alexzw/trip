import { X } from 'lucide-react'
import type { FilterCategory, MealItem, TimelineItem } from '../types'

interface QuickEditSheetProps {
  open: boolean
  collection: 'transportation' | 'itinerary' | 'meals' | null
  item: TimelineItem | MealItem | null
  onClose: () => void
  onTimelineChange: (
    collection: 'transportation' | 'itinerary',
    itemId: string,
    field: keyof TimelineItem,
    value: string | boolean | FilterCategory | undefined,
  ) => void
  onMealChange: (
    itemId: string,
    field: keyof MealItem,
    value: string | boolean | undefined,
  ) => void
}

export function QuickEditSheet({
  open,
  collection,
  item,
  onClose,
  onTimelineChange,
  onMealChange,
}: QuickEditSheetProps) {
  if (!open || !collection || !item) return null

  const updateField = (field: string, value: string) => {
    if (collection === 'meals') {
      onMealChange(item.id, field as keyof MealItem, value)
      return
    }

    onTimelineChange(collection, item.id, field as keyof TimelineItem, value)
  }

  return (
    <div className="bottom-safe fixed inset-x-0 bottom-0 z-50 bg-black/15 px-3 pb-3 pt-12 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl rounded-[30px] border border-white/85 bg-white p-5 shadow-[0_-12px_40px_rgba(15,23,42,0.15)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-pine/70">Quick Edit</div>
            <h3 className="mt-2 text-xl font-semibold text-ink">編輯這一步</h3>
            <p className="mt-1 text-sm text-mist">改完即時儲存，不用另外按 save。</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate bg-white p-2 text-mist"
            aria-label="關閉編輯"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-3">
          <input
            value={item.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="標題"
            className="rounded-2xl border border-slate bg-[#f8fafd] px-4 py-3 text-sm outline-none"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={item.time}
              onChange={(event) => updateField('time', event.target.value)}
              placeholder="開始時間"
              className="rounded-2xl border border-slate bg-[#f8fafd] px-4 py-3 text-sm outline-none"
            />
            <input
              value={item.endTime ?? ''}
              onChange={(event) => updateField('endTime', event.target.value)}
              placeholder="結束時間"
              className="rounded-2xl border border-slate bg-[#f8fafd] px-4 py-3 text-sm outline-none"
            />
          </div>

          {'locationName' in item ? (
            <input
              value={item.locationName ?? ''}
              onChange={(event) => updateField('locationName', event.target.value)}
              placeholder="地點名稱"
              className="rounded-2xl border border-slate bg-[#f8fafd] px-4 py-3 text-sm outline-none"
            />
          ) : null}

          <textarea
            value={item.description ?? ''}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="補充描述"
            rows={4}
            className="rounded-2xl border border-slate bg-[#f8fafd] px-4 py-3 text-sm outline-none"
          />

          {'bookingReference' in item ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={item.bookingReference ?? ''}
                onChange={(event) => updateField('bookingReference', event.target.value)}
                placeholder="預約號"
                className="rounded-2xl border border-slate bg-[#f8fafd] px-4 py-3 text-sm outline-none"
              />
              <input
                value={item.seatInfo ?? ''}
                onChange={(event) => updateField('seatInfo', event.target.value)}
                placeholder="座位資訊"
                className="rounded-2xl border border-slate bg-[#f8fafd] px-4 py-3 text-sm outline-none"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
