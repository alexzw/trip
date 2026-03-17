import { Coins, Images, ListTodo, Map } from 'lucide-react'
import type { AppTab } from '../types'

interface TripTabsProps {
  activeTab: Exclude<AppTab, 'home'>
  onChange: (tab: Exclude<AppTab, 'home'>) => void
}

const tabs = [
  { id: 'itinerary', label: 'Itinerary', icon: ListTodo },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'expenses', label: 'Expenses', icon: Coins },
  { id: 'memories', label: 'Memories', icon: Images },
] as const

export function TripTabs({ activeTab, onChange }: TripTabsProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-slate bg-[#F7F6F3]/95 px-4 pb-3 pt-2 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-full border px-4 text-[13px] font-medium whitespace-nowrap transition ${
                active
                  ? 'border-sage bg-sage text-white'
                  : 'border-slate bg-white text-mist'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
