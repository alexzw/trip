import { ExternalLink, MapPin, Pencil, Star, X } from 'lucide-react'
import { useState } from 'react'
import type { MealItem, TimelineItem } from '../types'
import { formatTimeRange } from '../utils/trip'

interface EventDetailSheetProps {
  item: TimelineItem | MealItem | null
  collection: 'transportation' | 'itinerary' | 'meals' | null
  open: boolean
  onClose: () => void
  onToggleStar: () => void
  onAddFootprint?: () => void
  onSave: (updates: Partial<TimelineItem & MealItem>) => void
}

export function EventDetailSheet({
  item,
  collection,
  open,
  onClose,
  onToggleStar,
  onAddFootprint,
  onSave,
}: EventDetailSheetProps) {
  const [editing, setEditing] = useState(false)

  if (!open || !item || !collection) return null

  const update = (field: string, value: string) => {
    onSave({ [field]: value } as Partial<TimelineItem & MealItem>)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <button className="absolute inset-0" onClick={onClose} aria-label="Close event detail" />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[28px] border border-slate bg-white px-5 pb-8 pt-5 shadow-[0_-10px_40px_rgba(17,24,39,0.12)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#E5E7EB]" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-mist">{collection}</div>
            {editing ? (
              <input
                value={item.title}
                onChange={(event) => update('title', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate bg-[#F7F6F3] px-3 py-2 text-[20px] font-semibold text-ink outline-none"
              />
            ) : (
              <h3 className="mt-2 text-[22px] font-semibold text-ink">{item.title}</h3>
            )}
            <div className="mt-2 text-[14px] text-mist">{formatTimeRange(item.time, item.endTime)}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleStar} className="rounded-full border border-slate p-2 text-mist">
              <Star size={16} className={item.isStarred ? 'fill-[#E8AFA6] text-[#E8AFA6]' : ''} />
            </button>
            <button onClick={() => setEditing((value) => !value)} className="rounded-full border border-slate p-2 text-mist">
              <Pencil size={16} />
            </button>
            <button onClick={onClose} className="rounded-full border border-slate p-2 text-mist">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {onAddFootprint ? (
            <button
              onClick={onAddFootprint}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-slate bg-[#F7F6F3] px-4 text-[14px] font-medium text-ink"
            >
              Mark as visited
            </button>
          ) : null}

          {'locationName' in item ? (
            editing ? (
              <input
                value={item.locationName ?? ''}
                onChange={(event) => update('locationName', event.target.value)}
                placeholder="Location"
                className="w-full rounded-xl border border-slate bg-[#F7F6F3] px-3 py-3 text-[14px] outline-none"
              />
            ) : item.locationName ? (
              <div className="flex items-center gap-2 text-[14px] text-ink">
                <MapPin size={16} className="text-mist" />
                <span>{item.locationName}</span>
              </div>
            ) : null
          ) : null}

          {editing ? (
            <textarea
              value={item.description ?? ''}
              onChange={(event) => update('description', event.target.value)}
              rows={4}
              placeholder="Notes"
              className="w-full rounded-xl border border-slate bg-[#F7F6F3] px-3 py-3 text-[14px] outline-none"
            />
          ) : item.description ? (
            <div className="rounded-2xl border border-slate bg-[#F7F6F3] p-4 text-[14px] leading-6 text-mist">
              {item.description}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate bg-[#FBFBFA] p-4 text-[14px] text-mist">
              未填備註
            </div>
          )}

          {'bookingReference' in item ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate bg-white p-4">
                <div className="text-[12px] text-mist">Booking</div>
                {editing ? (
                  <input
                    value={item.bookingReference ?? ''}
                    onChange={(event) => update('bookingReference', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate bg-[#F7F6F3] px-3 py-2 text-[14px] outline-none"
                  />
                ) : (
                  <div className="mt-2 text-[15px] font-medium text-ink">{item.bookingReference || '—'}</div>
                )}
              </div>
              <div className="rounded-2xl border border-slate bg-white p-4">
                <div className="text-[12px] text-mist">Seat</div>
                {editing ? (
                  <input
                    value={item.seatInfo ?? ''}
                    onChange={(event) => update('seatInfo', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate bg-[#F7F6F3] px-3 py-2 text-[14px] outline-none"
                  />
                ) : (
                  <div className="mt-2 text-[15px] font-medium text-ink">{item.seatInfo || '—'}</div>
                )}
              </div>
            </div>
          ) : null}

          {(item.links?.length ?? 0) > 0 ? (
            <div className="grid gap-2">
              {item.links?.map((link) => (
                <button
                  key={link.id}
                  onClick={() => window.open(link.url, '_blank', 'noreferrer')}
                  className="inline-flex min-h-[46px] items-center justify-between rounded-2xl border border-slate bg-white px-4 text-[14px] font-medium text-ink"
                >
                  <span>{link.label}</span>
                  <ExternalLink size={15} className="text-mist" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
