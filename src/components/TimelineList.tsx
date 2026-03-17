import { Plus } from 'lucide-react'
import type { MealItem, TimelineItem } from '../types'
import { TimelineItemCard, timelineSubtitle } from './TimelineItemCard'

type Collection = 'transportation' | 'itinerary' | 'meals'

interface TimelineListProps {
  items: Array<TimelineItem | MealItem>
  collection: Collection
  currentIndex?: number
  onToggleDone?: (itemId: string) => void
  onEdit?: (itemId: string) => void
  onAdd?: () => void
}

function iconForCollection(collection: Collection) {
  if (collection === 'transportation') return '🚉'
  if (collection === 'meals') return '🍽️'
  return '📍'
}

export function TimelineList({
  items,
  collection,
  currentIndex,
  onToggleDone,
  onEdit,
  onAdd,
}: TimelineListProps) {
  return (
    <div className="space-y-3">
      {onAdd ? (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full border border-[#D9E6E0] bg-[#F1F7F4] px-4 py-2 text-[14px] font-medium text-sage"
        >
          <Plus size={14} />
          新增
        </button>
      ) : null}

      {items.map((item, index) => (
        <TimelineItemCard
          key={item.id}
          time={item.time}
          title={item.title}
          subtitle={timelineSubtitle(item)}
          icon={iconForCollection(collection)}
          state={item.isDone ? 'completed' : currentIndex === index ? 'current' : 'upcoming'}
          onToggleDone={onToggleDone ? () => onToggleDone(item.id) : undefined}
          onEdit={onEdit ? () => onEdit(item.id) : undefined}
        />
      ))}
    </div>
  )
}
