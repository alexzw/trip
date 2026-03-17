import { Archive, CalendarDays, CheckSquare, House, Menu, type LucideIcon } from 'lucide-react'
import type { MainTab } from '../types'

interface BottomNavProps {
  activeTab: MainTab
  onChange: (tab: MainTab) => void
}

const tabs: Array<{ id: MainTab; label: string; icon: LucideIcon }> = [
  { id: 'today', label: 'Today', icon: House },
  { id: 'days', label: 'Days', icon: CalendarDays },
  { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  { id: 'more', label: 'More', icon: Menu },
  { id: 'footprints', label: 'Footprints', icon: Archive },
]

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate bg-white/96 px-2 pt-2 shadow-[0_-6px_18px_rgba(17,24,39,0.05)] backdrop-blur md:px-4">
      <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = tab.id === activeTab

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex min-h-[60px] flex-col items-center justify-center rounded-[14px] px-2 py-2 text-[11px] font-semibold transition ${
                active
                  ? 'bg-sage text-white shadow-[0_8px_16px_rgba(47,93,80,0.16)]'
                  : 'text-mist hover:bg-[#F4F4F1] hover:text-ink'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} className="mb-1.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
      <div className="h-[max(env(safe-area-inset-bottom),8px)]" />
    </nav>
  )
}
