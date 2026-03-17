import { useEffect, useMemo, useState } from 'react'
import { CalendarRange, Download, Heart, Import, List, Map, Plus, Search } from 'lucide-react'
import type { ChangeEvent } from 'react'
import type { Footprint, FootprintCategory, FootprintView, TripData } from '../types'
import { createEmptyFootprint, footprintMatchesQuery, footprintYear } from '../utils/footprints'
import { FootprintCard } from './FootprintCard'
import { MapView } from './MapView'
import { SectionCard } from './SectionCard'

interface FootprintsPageProps {
  trip: TripData
  footprints: Footprint[]
  onAdd: (footprint: Footprint) => void
  onUpdate: (footprintId: string, updater: (footprint: Footprint) => Footprint) => void
  onDelete: (footprintId: string) => void
  onImport: (file: File | null) => void
  onExport: () => void
}

const palette = ['#2F5D50', '#D17D6F', '#8B6F47', '#7C8E86']

function colorForTripFactory(tripIds: string[]) {
  return (tripId: string) => palette[Math.max(tripIds.indexOf(tripId), 0) % palette.length]
}

function formatPrettyDate(date: string) {
  if (!date) return '未填日期'
  return new Intl.DateTimeFormat('zh-HK', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(new Date(date))
}

function groupBy<T>(items: T[], keyFn: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyFn(item)
    acc[key] = [...(acc[key] ?? []), item]
    return acc
  }, {})
}

export function FootprintsPage({
  trip,
  footprints,
  onAdd,
  onUpdate,
  onDelete,
  onImport,
  onExport,
}: FootprintsPageProps) {
  const [view, setView] = useState<FootprintView>('map')
  const [query, setQuery] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [tripFilter, setTripFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | FootprintCategory>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Footprint>(() => createEmptyFootprint(trip))

  const tripIds = useMemo(() => Array.from(new Set(footprints.map((footprint) => footprint.tripId))), [footprints])
  const colorForTrip = useMemo(() => colorForTripFactory(tripIds), [tripIds])
  const years = useMemo(() => Array.from(new Set(footprints.map((footprint) => footprintYear(footprint.date)))).sort().reverse(), [footprints])
  const trips = useMemo(() => Array.from(new Set(footprints.map((footprint) => footprint.tripTitle))), [footprints])
  const cities = useMemo(() => Array.from(new Set(footprints.map((footprint) => footprint.city).filter(Boolean))).sort(), [footprints])

  const filtered = footprints.filter((footprint) => {
    const yearMatch = yearFilter === 'all' || footprintYear(footprint.date) === yearFilter
    const tripMatch = tripFilter === 'all' || footprint.tripTitle === tripFilter
    const cityMatch = cityFilter === 'all' || footprint.city === cityFilter
    const categoryMatch = categoryFilter === 'all' || footprint.category === categoryFilter
    return yearMatch && tripMatch && cityMatch && categoryMatch && footprintMatchesQuery(footprint, query)
  })

  useEffect(() => {
    if (selectedId) {
      const match = footprints.find((footprint) => footprint.id === selectedId)
      if (match) {
        setDraft(match)
        return
      }
    }
    setDraft(createEmptyFootprint(trip))
  }, [selectedId, footprints, trip])

  const timelineGroups = useMemo(() => groupBy(filtered, (footprint) => footprintYear(footprint.date)), [filtered])
  const summaryGroups = useMemo(() => groupBy(filtered, (footprint) => footprint.tripTitle), [filtered])
  const mappable = filtered.filter((footprint) => typeof footprint.latitude === 'number' && typeof footprint.longitude === 'number')
  const selectedMapFootprint = filtered.find((footprint) => footprint.id === selectedMapId) ?? null

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    onImport(event.target.files?.[0] ?? null)
    event.target.value = ''
  }

  const saveDraft = () => {
    if (!draft.placeName.trim()) return
    if (selectedId) {
      onUpdate(selectedId, () => draft)
    } else {
      onAdd({ ...draft, id: crypto.randomUUID() })
    }
    setSelectedId(null)
    setDraft(createEmptyFootprint(trip))
  }

  return (
    <div className="space-y-5">
      <section className="memory-card p-5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#B08A83]">Footprints</div>
        <h2 className="mt-2 text-[20px] font-bold text-ink">Travel Memory</h2>
        <p className="mt-2 text-[14px] text-mist">偏 Airbnb / memory style，留住你真正去過的地方。</p>

        <div className="mt-4 grid gap-3">
          <label className="flex items-center gap-3 rounded-2xl border border-[#F1E6E3] bg-white px-4 py-3">
            <Search size={16} className="text-mist" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜尋 place / city / note / trip..."
              className="w-full border-0 bg-transparent text-[14px] outline-none placeholder:text-mist"
            />
          </label>

          <div className="grid grid-cols-4 gap-2 rounded-2xl bg-[#F7EFED] p-1">
            {([
              ['map', 'Map', Map],
              ['list', 'List', List],
              ['timeline', 'Timeline', CalendarRange],
              ['summary', 'Trip', Heart],
            ] as const).map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`rounded-xl px-3 py-2 text-[12px] font-medium ${view === id ? 'bg-white text-ink' : 'text-mist'}`}
              >
                <Icon size={14} className="mx-auto mb-1" />
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="rounded-2xl border border-[#F1E6E3] bg-white px-3 py-3 text-[14px] outline-none">
              <option value="all">全部年份</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
            <select value={tripFilter} onChange={(event) => setTripFilter(event.target.value)} className="rounded-2xl border border-[#F1E6E3] bg-white px-3 py-3 text-[14px] outline-none">
              <option value="all">全部旅程</option>
              {trips.map((tripTitle) => <option key={tripTitle} value={tripTitle}>{tripTitle}</option>)}
            </select>
            <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)} className="rounded-2xl border border-[#F1E6E3] bg-white px-3 py-3 text-[14px] outline-none">
              <option value="all">全部城市</option>
              {cities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as 'all' | FootprintCategory)} className="rounded-2xl border border-[#F1E6E3] bg-white px-3 py-3 text-[14px] outline-none">
              <option value="all">全部類型</option>
              <option value="attraction">景點</option>
              <option value="restaurant">餐廳</option>
              <option value="hotel">酒店</option>
              <option value="station">車站</option>
              <option value="walk">散步</option>
              <option value="shopping">購物</option>
              <option value="transport">交通</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>
      </section>

      {view === 'map' ? (
        <div className="space-y-4">
          <MapView footprints={mappable} colorForTrip={colorForTrip} onSelect={setSelectedMapId} />
          {selectedMapFootprint ? (
            <div className="memory-card p-4">
              <div className="text-[16px] font-semibold text-ink">{selectedMapFootprint.placeName}</div>
              <div className="mt-1 text-[14px] text-mist">
                {selectedMapFootprint.tripTitle} • {formatPrettyDate(selectedMapFootprint.date)}
              </div>
              {selectedMapFootprint.note ? <div className="mt-2 text-[14px] text-mist">{selectedMapFootprint.note}</div> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {view === 'list' ? (
        <div className="space-y-3">
          {filtered.map((footprint) => (
            <FootprintCard
              key={footprint.id}
              footprint={footprint}
              onEdit={() => setSelectedId(footprint.id)}
              onFavorite={() => onUpdate(footprint.id, (current) => ({ ...current, isFavorite: !current.isFavorite }))}
            />
          ))}
        </div>
      ) : null}

      {view === 'timeline' ? (
        <SectionCard title="Timeline View" subtitle="依年份回看旅行足跡">
          <div className="space-y-5">
            {Object.entries(timelineGroups).sort((a, b) => b[0].localeCompare(a[0])).map(([year, items]) => (
              <div key={year}>
                <div className="mb-3 text-[16px] font-semibold text-ink">{year}</div>
                <div className="space-y-3">
                  {items.map((footprint) => (
                    <FootprintCard key={footprint.id} footprint={footprint} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {view === 'summary' ? (
        <SectionCard title="Trip Summary" subtitle="每次旅行的記憶摘要">
          <div className="grid gap-3">
            {Object.entries(summaryGroups).map(([tripTitle, items]) => (
              <article key={tripTitle} className="memory-card p-4">
                <div className="text-[16px] font-semibold text-ink">{tripTitle}</div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-3">
                    <div className="text-[12px] text-mist">Places</div>
                    <div className="mt-1 text-[20px] font-bold text-ink">{items.length}</div>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <div className="text-[12px] text-mist">Cities</div>
                    <div className="mt-1 text-[20px] font-bold text-ink">{new Set(items.map((item) => item.city)).size}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title={selectedId ? '編輯足跡' : '新增足跡'}
        subtitle="手動記錄實際去過的地方"
        action={
          <div className="flex gap-2">
            <button onClick={onExport} className="rounded-full border border-slate bg-white px-4 py-2 text-[12px] font-medium text-ink">
              <Download size={14} className="mr-1 inline" />
              Export
            </button>
            <label className="rounded-full border border-slate bg-white px-4 py-2 text-[12px] font-medium text-ink">
              <Import size={14} className="mr-1 inline" />
              Import
              <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
            </label>
          </div>
        }
      >
        <div className="grid gap-3">
          <button onClick={() => { setSelectedId(null); setDraft(createEmptyFootprint(trip)) }} className="inline-flex items-center gap-2 rounded-full border border-[#F1E6E3] bg-[#FFF7F5] px-4 py-2 text-[14px] font-medium text-[#B08A83]">
            <Plus size={14} />
            新增 Footprint
          </button>
          <input value={draft.placeName} onChange={(event) => setDraft((current) => ({ ...current, placeName: event.target.value }))} placeholder="地點名稱" className="rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} placeholder="日期" className="rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] outline-none" />
            <input value={draft.tripTitle} onChange={(event) => setDraft((current) => ({ ...current, tripTitle: event.target.value }))} placeholder="Trip" className="rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={draft.city} onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))} placeholder="城市" className="rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] outline-none" />
            <input value={draft.country} onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))} placeholder="國家" className="rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] outline-none" />
          </div>
          <textarea value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} rows={3} placeholder="備註" className="rounded-2xl border border-slate bg-white px-4 py-3 text-[14px] outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <button onClick={saveDraft} className="rounded-2xl bg-sage px-4 py-3 text-[14px] font-medium text-white">{selectedId ? '儲存修改' : '新增足跡'}</button>
            {selectedId ? (
              <button onClick={() => { onDelete(selectedId); setSelectedId(null) }} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-500">刪除</button>
            ) : null}
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
