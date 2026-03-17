import { getChecklistProgress } from '../utils/trip'
import { ChecklistGroup } from './ChecklistGroup'
import { SectionCard } from './SectionCard'

interface ChecklistPanelProps {
  finalChecks: Parameters<typeof getChecklistProgress>[0]
  packingChecklist: Parameters<typeof getChecklistProgress>[0]
  packingZones: Parameters<typeof getChecklistProgress>[0]
  onToggle: (group: 'finalChecks' | 'packingChecklist' | 'packingZones', sectionId: string, itemId: string) => void
}

function ProgressCard({
  title,
  subtitle,
  percent,
  remaining,
  colorClass,
}: {
  title: string
  subtitle: string
  percent: number
  remaining: number
  colorClass: string
}) {
  return (
    <section className="touch-card">
      <div className="text-[16px] font-medium text-ink">{title}</div>
      <div className="mt-1 text-[14px] text-mist">{subtitle}</div>
      <div className="mt-4 h-2 rounded-full bg-[#EEF0EB]">
        <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-3 text-[12px] font-medium text-mist">尚有 {remaining} 項未完成</div>
    </section>
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
    <div className="space-y-5">
      <div className="grid gap-4">
        <ProgressCard
          title="Final Check"
          subtitle="出發前最後確認"
          percent={finalStats.percent}
          remaining={finalStats.remaining}
          colorClass="bg-sage"
        />
        <ProgressCard
          title="Packing Checklist"
          subtitle="行李與分包進度"
          percent={packingStats.percent}
          remaining={packingStats.remaining}
          colorClass="bg-[#B78628]"
        />
      </div>

      <SectionCard title="出發前 Final Check" subtitle="Notion 風格的任務清單">
        <ChecklistGroup sections={finalChecks} groupKey="finalChecks" onToggle={onToggle} />
      </SectionCard>

      <SectionCard title="行李 Checklist" subtitle="按分類整理，快速勾選">
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
