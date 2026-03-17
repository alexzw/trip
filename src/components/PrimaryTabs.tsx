import { Archive, CalendarDays, CheckSquare, House, Menu } from 'lucide-react'
import type { MainTab } from '../types'

interface PrimaryTabsProps {
  activeTab: MainTab
  onChange: (tab: MainTab) => void
}

const tabs: Array<{ id: MainTab; label: string; icon: typeof House }> = [
  { id: 'today', label: 'Today', icon: House },
  { id: 'days', label: 'Days', icon: CalendarDays },
  { id: 'footprints', label: 'Footprints', icon: Archive },
  { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  { id: 'more', label: 'More', icon: Menu },
]

export function PrimaryTabs({ activeTab, onChange }: PrimaryTabsProps) {
  return (
    <nav className="panel top-safe sticky z-30 p-2 print:hidden">
      <div className="scrollbar-thin flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = tab.id === activeTab

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`inline-flex min-w-fit items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium transition sm:px-4 ${
                active
                  ? 'bg-pine text-white shadow-sm'
                  : 'bg-white/70 text-ink/65 hover:bg-sand hover:text-ink'
              }`}
            >
              <Icon size={16} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
