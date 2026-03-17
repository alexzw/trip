import { Plus, Trash2 } from 'lucide-react'
import type { TripDay } from '../types'

interface DayNavigatorProps {
  days: TripDay[]
  selectedDayId: string
  onSelectDay: (dayId: string) => void
  onAddDay: () => void
  onDeleteDay: () => void
  editMode: boolean
  getProgress: (day: TripDay) => number
}

export function DayNavigator({
  days,
  selectedDayId,
  onSelectDay,
  onAddDay,
  onDeleteDay,
  editMode,
  getProgress,
}: DayNavigatorProps) {
  return (
    <aside className="space-y-4">
      <div className="top-safe sticky z-20 print:hidden">
        <div className="panel p-3">
          <div>
            <div className="text-sm font-semibold text-ink">Days</div>
            <p className="text-xs text-ink/55">頂部可滑動，內容區左右 swipe 切 day</p>
          </div>

          {editMode ? (
            <div className="mt-3 flex gap-2">
              <button
                onClick={onAddDay}
                className="rounded-full border border-sage/20 bg-sage/10 p-2 text-sage"
                aria-label="新增一天"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={onDeleteDay}
                className="rounded-full border border-red-200 bg-red-50 p-2 text-red-500"
                aria-label="刪除目前一天"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : null}

          <div className="scrollbar-thin mt-3 flex gap-2 overflow-x-auto pb-1">
            {days.map((day) => {
              const active = day.id === selectedDayId
              return (
                <button
                  key={day.id}
                  onClick={() => onSelectDay(day.id)}
                  className={`min-w-fit rounded-full border px-4 py-3 text-left transition ${
                    active
                      ? 'border-pine bg-pine text-white shadow-sm'
                      : 'border-ink/10 bg-white/75 text-ink/70 hover:border-sage/30 hover:bg-sand'
                  }`}
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.22em]">
                    Day {day.dayNumber}
                  </div>
                  <div className={`mt-1 text-sm font-semibold ${active ? 'text-white' : 'text-ink'}`}>
                    {day.city}
                  </div>
                  <div className={`mt-1 text-xs ${active ? 'text-white/75' : 'text-ink/50'}`}>
                    {getProgress(day)}% 完成
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
