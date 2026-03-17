import { useEffect, useMemo, useState } from 'react'
import {
  Archive,
  CalendarRange,
  Download,
  ExternalLink,
  Heart,
  Import,
  List,
  Map,
  MapPinned,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet'
import type { ChangeEvent } from 'react'
import type { Footprint, FootprintCategory, FootprintView, TripData } from '../types'
import { createEmptyFootprint, footprintMatchesQuery, footprintYear } from '../utils/footprints'
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

const palette = ['#40604f', '#c68c8c', '#758aa6', '#8d7b5b', '#766a91']

function colorForTrip(tripId: string, allTripIds: string[]) {
  const index = Math.max(allTripIds.indexOf(tripId), 0)
  return palette[index % palette.length]
}

function formatPrettyDate(date: string) {
  if (!date) return '未填日期'
  return new Intl.DateTimeFormat('zh-HK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

function groupBy<T>(items: T[], keyFn: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyFn(item)
    acc[key] = [...(acc[key] ?? []), item]
    return acc
  }, {})
}

function LinkButton({ url }: { url?: string }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-sage/20 bg-sage/10 px-3 py-1.5 text-xs font-medium text-sage"
    >
      <ExternalLink size={14} />
      查看地圖
    </a>
  )
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

  const tripIds = useMemo(
    () => Array.from(new Set(footprints.map((footprint) => footprint.tripId))),
    [footprints],
  )
  const years = useMemo(
    () => Array.from(new Set(footprints.map((footprint) => footprintYear(footprint.date)))).sort().reverse(),
    [footprints],
  )
  const trips = useMemo(
    () => Array.from(new Set(footprints.map((footprint) => footprint.tripTitle))),
    [footprints],
  )
  const cities = useMemo(
    () => Array.from(new Set(footprints.map((footprint) => footprint.city).filter(Boolean))).sort(),
    [footprints],
  )

  const filtered = footprints.filter((footprint) => {
    const yearMatch = yearFilter === 'all' || footprintYear(footprint.date) === yearFilter
    const tripMatch = tripFilter === 'all' || footprint.tripTitle === tripFilter
    const cityMatch = cityFilter === 'all' || footprint.city === cityFilter
    const categoryMatch = categoryFilter === 'all' || footprint.category === categoryFilter
    return (
      yearMatch &&
      tripMatch &&
      cityMatch &&
      categoryMatch &&
      footprintMatchesQuery(footprint, query)
    )
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
  const mappable = filtered.filter(
    (footprint) => typeof footprint.latitude === 'number' && typeof footprint.longitude === 'number',
  )
  const selectedMapFootprint = mappable.find((footprint) => footprint.id === selectedMapId) ?? null

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

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    onImport(event.target.files?.[0] ?? null)
    event.target.value = ''
  }

  return (
    <div className="space-y-5">
      <section className="panel flight-grid overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="chip border-sky/20 bg-sky/10 text-sky">Travel Memory Archive</div>
            <h2 className="mt-4 font-display text-4xl text-ink">Footprints / Travel Memory</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-mist">
              這裡不是規劃行程，而是沉澱真正去過的地方。之後你可以按年份、旅程、城市回看 travel memory，慢慢累積成自己的 archive。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="chip">{footprints.length} 個足跡</span>
              <span className="chip">{Object.keys(summaryGroups).length} 個旅程</span>
              <span className="chip">photo-import schema 已預留</span>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:col-span-2">
                <Search size={18} className="text-mist" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜尋地點、城市、旅程、備註..."
                  className="w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-mist"
                />
              </label>
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-ink outline-none"
              >
                <option value="all">全部年份</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={tripFilter}
                onChange={(event) => setTripFilter(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-ink outline-none"
              >
                <option value="all">全部旅程</option>
                {trips.map((tripTitle) => (
                  <option key={tripTitle} value={tripTitle}>
                    {tripTitle}
                  </option>
                ))}
              </select>
              <select
                value={cityFilter}
                onChange={(event) => setCityFilter(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-ink outline-none"
              >
                <option value="all">全部城市</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as 'all' | FootprintCategory)}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-ink outline-none"
              >
                <option value="all">全部類型</option>
                <option value="attraction">景點</option>
                <option value="restaurant">餐廳</option>
                <option value="hotel">酒店</option>
                <option value="station">車站</option>
                <option value="walk">散步點</option>
                <option value="shopping">購物</option>
                <option value="transport">交通</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-1">
              <div className="grid grid-cols-4 gap-1">
              {([
                ['map', 'Map', Map],
                ['list', 'List', List],
                ['timeline', 'Timeline', CalendarRange],
                ['summary', 'Summary', Sparkles],
              ] as const).map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`rounded-[18px] px-3 py-3 text-sm font-medium transition ${
                    view === id ? 'bg-gradient-to-b from-sky to-pine text-white shadow-sm' : 'text-mist'
                  }`}
                >
                  <Icon size={16} className="mx-auto mb-1" />
                  {label}
                </button>
              ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedId(null)
                  setDraft(createEmptyFootprint(trip))
                }}
                className="rounded-full border border-sky/20 bg-sky/10 px-4 py-2 text-sm font-medium text-sky"
              >
                <Plus size={16} className="mr-1 inline" />
                新增 Footprint
              </button>
              <button
                onClick={onExport}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink/80"
              >
                <Download size={16} className="mr-1 inline" />
                Export JSON
              </button>
              <label className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink/80">
                <Import size={16} className="mr-1 inline" />
                Import JSON
                <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          {view === 'map' ? (
            <SectionCard title="Map View" subtitle="同一旅程用同色，無座標時自動 fallback 到其他 view">
              {mappable.length ? (
                <div className="overflow-hidden rounded-[28px] border border-ink/10">
                  <MapContainer center={[35.6812, 139.7671]} zoom={5} style={{ height: 460, width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mappable.map((footprint) => (
                      <CircleMarker
                        key={footprint.id}
                        center={[footprint.latitude as number, footprint.longitude as number]}
                        eventHandlers={{
                          click: () => setSelectedMapId(footprint.id),
                        }}
                        pathOptions={{
                          color: colorForTrip(footprint.tripId, tripIds),
                          fillColor: colorForTrip(footprint.tripId, tripIds),
                          fillOpacity: 0.72,
                        }}
                        radius={8}
                      />
                    ))}
                  </MapContainer>
                </div>
              ) : (
                <div className="rounded-3xl bg-sand/70 p-6 text-sm text-ink/55">
                  目前沒有可畫在地圖上的座標資料。之後加入 latitude / longitude，或未來從 photo-import 帶入位置後，這裡就會自動出現 markers。
                </div>
              )}
              {selectedMapFootprint ? (
                <div className="bottom-safe fixed inset-x-0 bottom-20 z-30 px-3 md:absolute md:bottom-6 md:left-6 md:right-6 md:px-0">
                  <div className="mx-auto max-w-xl rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-card backdrop-blur">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-ink/45">
                          {selectedMapFootprint.tripTitle}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-ink">{selectedMapFootprint.placeName}</div>
                        <div className="mt-1 text-sm text-ink/65">
                          {formatPrettyDate(selectedMapFootprint.date)} · {selectedMapFootprint.city}
                        </div>
                        {selectedMapFootprint.note ? (
                          <p className="mt-2 text-sm leading-6 text-ink/60">{selectedMapFootprint.note}</p>
                        ) : null}
                      </div>
                      <button
                        onClick={() => setSelectedMapId(null)}
                        className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink/60"
                      >
                        關閉
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <LinkButton url={selectedMapFootprint.mapLink} />
                      <button
                        onClick={() => setSelectedId(selectedMapFootprint.id)}
                        className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/70"
                      >
                        編輯
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </SectionCard>
          ) : null}

          {view === 'list' ? (
            <SectionCard title="List View" subtitle="卡片式顯示每個 footprint">
              <div className="space-y-3">
                {filtered.map((footprint) => (
                  <article
                    key={footprint.id}
                    className="rounded-3xl border border-ink/10 bg-white p-4 transition hover:border-sage/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-ink/45">
                          {formatPrettyDate(footprint.date)} · {footprint.tripTitle}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-ink">{footprint.placeName}</div>
                        <div className="mt-1 text-sm text-ink/65">
                          {footprint.city} · {footprint.country} · {footprint.category}
                        </div>
                        {footprint.note ? (
                          <p className="mt-3 text-sm leading-6 text-ink/65">{footprint.note}</p>
                        ) : null}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedId(footprint.id)}
                          className="rounded-full border border-ink/10 p-2 text-ink/60"
                          aria-label="編輯 footprint"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() =>
                            onUpdate(footprint.id, (current) => ({
                              ...current,
                              isFavorite: !current.isFavorite,
                            }))
                          }
                          className={`rounded-full border p-2 ${
                            footprint.isFavorite
                              ? 'border-blossom/20 bg-blossom/15 text-[#8f5e5e]'
                              : 'border-ink/10 text-ink/60'
                          }`}
                          aria-label="收藏 footprint"
                        >
                          <Heart size={15} fill={footprint.isFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => onDelete(footprint.id)}
                          className="rounded-full border border-red-200 p-2 text-red-500"
                          aria-label="刪除 footprint"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <LinkButton url={footprint.mapLink} />
                      <span className="chip bg-white">{footprint.source}</span>
                    </div>
                  </article>
                ))}
                {filtered.length === 0 ? (
                  <div className="rounded-3xl bg-sand/70 p-5 text-sm text-ink/55">沒有符合條件的 footprints。</div>
                ) : null}
              </div>
            </SectionCard>
          ) : null}

          {view === 'timeline' ? (
            <SectionCard title="Timeline View" subtitle="依年份 / 日期回顧旅行足跡">
              <div className="space-y-5">
                {Object.entries(timelineGroups)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([year, items]) => (
                    <div key={year}>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="font-display text-2xl text-ink">{year}</div>
                        <div className="h-px flex-1 bg-ink/10" />
                      </div>
                      <div className="space-y-3">
                        {items
                          .slice()
                          .sort((a, b) => a.date.localeCompare(b.date))
                          .map((footprint) => (
                            <div key={footprint.id} className="flex gap-3 rounded-3xl border border-ink/10 bg-white p-4">
                              <div className="mt-1 h-3 w-3 rounded-full bg-sage" />
                              <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-ink/45">
                                  {formatPrettyDate(footprint.date)} · {footprint.tripTitle}
                                </div>
                                <div className="mt-1 text-sm font-semibold text-ink">{footprint.placeName}</div>
                                <div className="mt-1 text-sm text-ink/65">
                                  {footprint.city} · {footprint.category}
                                </div>
                                {footprint.note ? (
                                  <p className="mt-2 text-sm leading-6 text-ink/60">{footprint.note}</p>
                                ) : null}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                {filtered.length === 0 ? (
                  <div className="rounded-3xl bg-sand/70 p-5 text-sm text-ink/55">沒有符合條件的 footprints。</div>
                ) : null}
              </div>
            </SectionCard>
          ) : null}

          {view === 'summary' ? (
            <SectionCard title="Trip Summary View" subtitle="按 trip 回顧去過多少城市與地點">
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(summaryGroups).map(([tripTitle, items]) => {
                  const cityCount = new Set(items.map((item) => item.city)).size
                  const representative = items.slice(0, 3).map((item) => item.placeName)
                  return (
                    <article key={tripTitle} className="rounded-3xl border border-ink/10 bg-white p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-ink/45">Trip Archive</div>
                      <div className="mt-2 text-lg font-semibold text-ink">{tripTitle}</div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-sand/60 p-3">
                          <div className="text-xs text-ink/45">Cities</div>
                          <div className="mt-1 text-xl font-semibold text-ink">{cityCount}</div>
                        </div>
                        <div className="rounded-2xl bg-sand/60 p-3">
                          <div className="text-xs text-ink/45">Footprints</div>
                          <div className="mt-1 text-xl font-semibold text-ink">{items.length}</div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-ink/65">
                        代表地點：{representative.join('、') || '尚未記錄'}
                      </div>
                    </article>
                  )
                })}
                {filtered.length === 0 ? (
                  <div className="rounded-3xl bg-sand/70 p-5 text-sm text-ink/55">沒有符合條件的 footprints。</div>
                ) : null}
              </div>
            </SectionCard>
          ) : null}
        </div>

        <div className="space-y-5">
          <SectionCard
            title={selectedId ? '編輯 Footprint' : '手動新增 Footprint'}
            subtitle="手動補記 itinerary 以外、但你實際去過的地方"
          >
            <div className="grid gap-3">
              <input
                value={draft.placeName}
                onChange={(event) => setDraft((current) => ({ ...current, placeName: event.target.value }))}
                placeholder="地點名稱"
                className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={draft.date}
                  onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                  placeholder="日期"
                  className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
                />
                <input
                  value={draft.tripTitle}
                  onChange={(event) => setDraft((current) => ({ ...current, tripTitle: event.target.value }))}
                  placeholder="Trip"
                  className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={draft.city}
                  onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))}
                  placeholder="城市"
                  className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
                />
                <input
                  value={draft.country}
                  onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))}
                  placeholder="國家"
                  className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
                />
              </div>
              <select
                value={draft.category}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    category: event.target.value as FootprintCategory,
                  }))
                }
                className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
              >
                <option value="attraction">景點</option>
                <option value="restaurant">餐廳</option>
                <option value="hotel">酒店</option>
                <option value="station">車站</option>
                <option value="walk">散步點</option>
                <option value="shopping">購物</option>
                <option value="transport">交通</option>
                <option value="other">其他</option>
              </select>
              <input
                value={draft.mapLink ?? ''}
                onChange={(event) => setDraft((current) => ({ ...current, mapLink: event.target.value }))}
                placeholder="地圖連結"
                className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={draft.latitude ?? ''}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      latitude: event.target.value ? Number(event.target.value) : undefined,
                    }))
                  }
                  placeholder="Latitude（可選）"
                  className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
                />
                <input
                  value={draft.longitude ?? ''}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      longitude: event.target.value ? Number(event.target.value) : undefined,
                    }))
                  }
                  placeholder="Longitude（可選）"
                  className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
                />
              </div>
              <textarea
                value={draft.note}
                onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
                placeholder="備註"
                rows={4}
                className="rounded-2xl border border-ink/10 bg-sand/60 px-3 py-3 text-sm outline-none"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={saveDraft}
                  className="rounded-2xl bg-pine px-4 py-3 text-sm font-semibold text-white"
                >
                  {selectedId ? '儲存修改' : '新增 Footprint'}
                </button>
                <button
                  onClick={() => {
                    setSelectedId(null)
                    setDraft(createEmptyFootprint(trip))
                  }}
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-medium text-ink/70"
                >
                  清空表單
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Archive Notes" subtitle="為未來 Apple ecosystem 擴充預留">
            <div className="space-y-3 text-sm leading-7 text-ink/65">
              <div className="rounded-3xl border border-ink/10 bg-sand/60 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold text-ink">
                  <Archive size={16} className="text-sage" />
                  Photo-import Ready
                </div>
                `photos[]`、`takenAt`、`latitude / longitude`、`source = photo-import` 已在 schema 預留，之後可接 Apple Photos / iPhone location metadata。
              </div>
              <div className="rounded-3xl border border-ink/10 bg-sand/60 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold text-ink">
                  <MapPinned size={16} className="text-sage" />
                  Graceful Fallback
                </div>
                沒有座標的 footprint 仍然會出現在 List / Timeline / Summary，不會因為 map data 不完整而報錯。
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
