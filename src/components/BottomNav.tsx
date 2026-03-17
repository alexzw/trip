import { Coins, House, Images, ListTodo, Map, type LucideIcon } from 'lucide-react'
import type { AppTab } from '../types'

interface BottomNavProps {
  activeTab: AppTab
  onChange: (tab: AppTab) => void
}

const tabs: Array<{ id: AppTab; label: string; icon: LucideIcon }> = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'itinerary', label: 'Itinerary', icon: ListTodo },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'expenses', label: 'Expenses', icon: Coins },
  { id: 'memories', label: 'Memories', icon: Images },
]

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 min-h-[88px] border-t border-slate bg-white/96 px-2 pt-2 shadow-[0_-6px_18px_rgba(17,24,39,0.05)] backdrop-blur md:px-4">
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
                  ? 'bg-[#F1F4F2] text-sage'
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
      <div className="h-[max(env(safe-area-inset-bottom),12px)]" />
    </nav>
  )
}
