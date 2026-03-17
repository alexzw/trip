import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { ChecklistSection } from '../types'

interface ChecklistGroupProps {
  sections: ChecklistSection[]
  groupKey: 'finalChecks' | 'packingChecklist' | 'packingZones'
  onToggle: (group: 'finalChecks' | 'packingChecklist' | 'packingZones', sectionId: string, itemId: string) => void
}

export function ChecklistGroup({ sections, groupKey, onToggle }: ChecklistGroupProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isOpen = openSections[section.id] ?? true
        const done = section.items.filter((item) => item.checked).length

        return (
          <article key={section.id} className="touch-card">
            <button
              onClick={() => setOpenSections((current) => ({ ...current, [section.id]: !current[section.id] }))}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <div className="text-[16px] font-medium text-ink">{section.title}</div>
                {section.description ? <div className="mt-1 text-[14px] text-mist">{section.description}</div> : null}
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[12px] font-medium text-mist">
                  {done}/{section.items.length}
                </span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {isOpen ? (
              <div className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 rounded-xl px-3 py-3 ${
                      item.checked ? 'bg-[#F6F7F5] text-mist' : 'bg-[#FCFCFB]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => onToggle(groupKey, section.id, item.id)}
                      className="mt-1 h-4 w-4 rounded border-slate text-sage focus:ring-sage"
                    />
                    <span className={`text-[14px] leading-6 ${item.checked ? 'line-through' : ''}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
