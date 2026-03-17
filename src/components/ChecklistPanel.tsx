import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { ChecklistSection } from '../types'
import { getChecklistProgress } from '../utils/trip'
import { SectionCard } from './SectionCard'

interface ChecklistPanelProps {
  finalChecks: ChecklistSection[]
  packingChecklist: ChecklistSection[]
  packingZones: ChecklistSection[]
  onToggle: (group: 'finalChecks' | 'packingChecklist' | 'packingZones', sectionId: string, itemId: string) => void
}

function ChecklistGroup({
  sections,
  groupKey,
  onToggle,
}: {
  sections: ChecklistSection[]
  groupKey: 'finalChecks' | 'packingChecklist' | 'packingZones'
  onToggle: ChecklistPanelProps['onToggle']
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleOpen = (sectionId: string) =>
    setOpenSections((current) => ({ ...current, [sectionId]: !current[sectionId] }))

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isOpen = openSections[section.id] ?? true
        const completed = section.items.filter((item) => item.checked).length
        return (
          <article key={section.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <button
              onClick={() => toggleOpen(section.id)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <div className="text-sm font-semibold text-ink">{section.title}</div>
                {section.description ? (
                  <p className="mt-1 text-sm text-mist">{section.description}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-sky">
                  {completed}/{section.items.length}
                </span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>
            {isOpen ? (
              <div className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl px-3 py-2 transition ${
                      item.checked ? 'bg-white/5 text-mist' : 'hover:bg-white/5'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => onToggle(groupKey, section.id, item.id)}
                      className="mt-1 h-4 w-4 rounded border-ink/20 text-sage focus:ring-sage"
                    />
                    <span className={`text-sm leading-6 ${item.checked ? 'line-through' : ''}`}>
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

export function ChecklistPanel({
  finalChecks,
  packingChecklist,
  packingZones,
  onToggle,
}: ChecklistPanelProps) {
  const finalStats = getChecklistProgress(finalChecks)
  const packingStats = getChecklistProgress([...packingChecklist, ...packingZones])

  return (
    <div id="checklists" className="grid gap-5 xl:grid-cols-2">
      <SectionCard
        title="出發前 Final Check"
        subtitle={`完成 ${finalStats.percent}% · 尚有 ${finalStats.remaining} 項未完成`}
        action={
          <div className="min-w-[120px]">
            <div className="h-2 rounded-full bg-sand">
              <div
                className="h-2 rounded-full bg-pine transition-all"
                style={{ width: `${finalStats.percent}%` }}
              />
            </div>
          </div>
        }
      >
        <ChecklistGroup sections={finalChecks} groupKey="finalChecks" onToggle={onToggle} />
      </SectionCard>

      <SectionCard
        title="行李 Checklist"
        subtitle={`完成 ${packingStats.percent}% · 尚有 ${packingStats.remaining} 項未完成`}
        action={
          <div className="min-w-[120px]">
            <div className="h-2 rounded-full bg-sand">
              <div
                className="h-2 rounded-full bg-sage transition-all"
                style={{ width: `${packingStats.percent}%` }}
              />
            </div>
          </div>
        }
      >
        <ChecklistGroup
          sections={[...packingChecklist, ...packingZones]}
          groupKey="packingChecklist"
          onToggle={(_, sectionId, itemId) => {
            const targetGroup = packingChecklist.some((section) => section.id === sectionId)
              ? 'packingChecklist'
              : 'packingZones'
            onToggle(targetGroup, sectionId, itemId)
          }}
        />
      </SectionCard>
    </div>
  )
}
