import { Heart, MapPinned } from 'lucide-react'
import type { Footprint } from '../types'

interface FootprintCardProps {
  footprint: Footprint
  onEdit?: () => void
  onFavorite?: () => void
}

export function FootprintCard({ footprint, onEdit, onFavorite }: FootprintCardProps) {
  return (
    <article className="memory-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[16px] font-semibold text-ink">{footprint.placeName}</div>
          <div className="mt-1 text-[14px] text-mist">
            {footprint.city} • {footprint.date || '未填日期'}
          </div>
          <div className="mt-1 text-[12px] font-medium text-[#9A7E77]">{footprint.tripTitle}</div>
        </div>
        <button
          onClick={onFavorite}
          className={`rounded-full p-2 ${footprint.isFavorite ? 'bg-[#FCEBE7] text-[#D17D6F]' : 'bg-white text-mist'}`}
          aria-label="收藏足跡"
        >
          <Heart size={16} fill={footprint.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      {footprint.note ? <div className="mt-3 text-[14px] text-mist">{footprint.note}</div> : null}
      <div className="mt-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-[12px] text-mist">
          <MapPinned size={14} />
          {footprint.category}
        </div>
        {onEdit ? (
          <button onClick={onEdit} className="text-[12px] font-medium text-sage">
            編輯
          </button>
        ) : null}
      </div>
    </article>
  )
}
