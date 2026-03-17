import {
  Download,
  Filter,
  Import,
  PencilLine,
  Printer,
  Search,
  Sparkles,
} from 'lucide-react'
import type { ChangeEvent } from 'react'
import type { FilterCategory } from '../types'

interface ToolbarProps {
  query: string
  city: string
  category: FilterCategory
  hasPlanBOnly: boolean
  hasLinksOnly: boolean
  editMode: boolean
  cities: string[]
  onQueryChange: (value: string) => void
  onCityChange: (value: string) => void
  onCategoryChange: (value: FilterCategory) => void
  onPlanBToggle: () => void
  onLinksToggle: () => void
  onEditToggle: () => void
  onTodayMode: () => void
  onExportJson: () => void
  onImportJson: (file: File | null) => void
  onPrint: () => void
}

export function Toolbar({
  query,
  city,
  category,
  hasPlanBOnly,
  hasLinksOnly,
  editMode,
  cities,
  onQueryChange,
  onCityChange,
  onCategoryChange,
  onPlanBToggle,
  onLinksToggle,
  onEditToggle,
  onTodayMode,
  onExportJson,
  onImportJson,
  onPrint,
}: ToolbarProps) {
  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    onImportJson(event.target.files?.[0] ?? null)
    event.target.value = ''
  }

  return (
    <section className="panel top-safe sticky z-20 p-3 print:hidden sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))]">
        <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-sand/60 px-4 py-3">
          <Search size={18} className="text-ink/45" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜尋餐廳、城市、航班、預約號、備註..."
            className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-ink/35"
          />
        </label>

        <label className="rounded-2xl border border-ink/10 bg-white/70 px-3 py-3 text-sm">
          <span className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
            <Filter size={14} />
            城市
          </span>
          <select
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            className="w-full border-0 bg-transparent outline-none"
          >
            <option value="all">全部城市</option>
            {cities.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-2xl border border-ink/10 bg-white/70 px-3 py-3 text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
            類型
          </span>
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value as FilterCategory)}
            className="w-full border-0 bg-transparent outline-none"
          >
            <option value="all">全部</option>
            <option value="transport">交通</option>
            <option value="activity">景點 / 行程</option>
            <option value="meal">餐飲</option>
            <option value="shopping">購物</option>
            <option value="stay">住宿</option>
            <option value="note">備註</option>
          </select>
        </label>

        <button
          onClick={onPlanBToggle}
          className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
            hasPlanBOnly
              ? 'border-sage bg-sage/15 text-sage'
              : 'border-ink/10 bg-white/70 text-ink/70'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em]">篩選</div>
          <div className="mt-1">只看有 Plan B</div>
        </button>

        <button
          onClick={onLinksToggle}
          className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
            hasLinksOnly
              ? 'border-pine bg-pine/15 text-pine'
              : 'border-ink/10 bg-white/70 text-ink/70'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em]">篩選</div>
          <div className="mt-1">只看有外部連結</div>
        </button>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button
            onClick={onTodayMode}
            className="rounded-2xl border border-ink/10 bg-white/80 px-3 py-3 text-sm font-medium text-ink/70"
          >
            <Sparkles size={16} className="mx-auto mb-1" />
            回 Today
          </button>

          <button
            onClick={onEditToggle}
            className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
              editMode
                ? 'border-sage bg-sage/20 text-sage'
                : 'border-ink/10 bg-white/80 text-ink/70'
            }`}
          >
            <PencilLine size={16} className="mx-auto mb-1" />
            Edit
          </button>

          <button
            onClick={onExportJson}
            className="rounded-2xl border border-ink/10 bg-white/80 px-3 py-3 text-sm font-medium text-ink/70"
          >
            <Download size={16} className="mx-auto mb-1" />
            匯出
          </button>

          <label className="cursor-pointer rounded-2xl border border-ink/10 bg-white/80 px-3 py-3 text-center text-sm font-medium text-ink/70">
            <Import size={16} className="mx-auto mb-1" />
            匯入
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>

          <button
            onClick={onPrint}
            className="rounded-2xl border border-ink/10 bg-white/80 px-3 py-3 text-sm font-medium text-ink/70"
          >
            <Printer size={16} className="mx-auto mb-1" />
            Print
          </button>
        </div>
      </div>
    </section>
  )
}
