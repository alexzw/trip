import { Heart } from 'lucide-react'
import type { Footprint, MemoryEntry, TripData } from '../types'
import { formatDisplayDate, groupMemoriesByDay } from '../utils/trip'
import { EmptyState } from './EmptyState'
import { MemoryCard } from './MemoryCard'
import { SectionHeader } from './SectionHeader'
import { SectionBlock } from './SectionBlock'

interface MemoriesViewProps {
  trip: TripData
  memories: MemoryEntry[]
  footprints: Footprint[]
  onAdd: () => void
}

export function MemoriesView({ trip, memories, footprints, onAdd }: MemoriesViewProps) {
  const grouped = groupMemoriesByDay(memories, trip.id)
  const tripFootprints = footprints.filter((item) => item.tripId === trip.id)

  if (Object.keys(grouped).length === 0 && tripFootprints.length === 0) {
    return (
      <EmptyState
        title="No memories yet"
        description="旅程結束之後，這裡可以放照片、感受和真正去過的地方。"
        actionLabel="新增回憶"
        onAction={onAdd}
      />
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#ECE7DF] bg-[#FFFCF8] p-5">
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-mist">
          <Heart size={14} />
          Memory album
        </div>
        <div className="mt-3 text-[20px] font-semibold text-ink">{trip.title}</div>
        <div className="mt-2 text-[14px] leading-6 text-mist">
          {tripFootprints.length} visited places · {memories.filter((item) => item.tripId === trip.id).length} memory notes
        </div>
      </section>

      {Object.entries(grouped).map(([date, items]) => (
        <SectionBlock key={date} title={formatDisplayDate(date)} subtitle="Travel journal">
          <div className="space-y-3">
            <SectionHeader title="Memory cards" subtitle="更偏回顧與感受，而不是排程。" />
            {items.map((item) => (
              <MemoryCard key={item.id} item={item} onAddPhoto={onAdd} />
            ))}
          </div>
        </SectionBlock>
      ))}
    </div>
  )
}
