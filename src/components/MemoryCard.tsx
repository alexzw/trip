import { ImagePlus } from 'lucide-react'
import type { MemoryEntry } from '../types'

interface MemoryCardProps {
  item: MemoryEntry
  onAddPhoto: () => void
}

export function MemoryCard({ item, onAddPhoto }: MemoryCardProps) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-semibold text-ink">
            {item.emoji ? `${item.emoji} ` : ''}
            {item.title}
          </div>
          {item.placeName ? <div className="mt-1 text-[13px] text-mist">{item.placeName}</div> : null}
        </div>
        <button onClick={onAddPhoto} className="rounded-full border border-slate p-2 text-mist">
          <ImagePlus size={15} />
        </button>
      </div>
      {item.caption ? <div className="mt-3 text-[14px] font-medium text-ink">{item.caption}</div> : null}
      {item.note ? <p className="mt-2 text-[14px] leading-6 text-mist">{item.note}</p> : null}
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title} className="mt-4 h-44 w-full rounded-2xl object-cover" />
      ) : (
        <div className="mt-4 flex h-32 items-center justify-center rounded-2xl border border-dashed border-[#E6DED4] bg-[#FCF8F4] text-[13px] text-mist">
          Photo placeholder
        </div>
      )}
    </article>
  )
}
