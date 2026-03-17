import { useDeferredValue, useEffect, useMemo, useState, type TouchEvent } from 'react'
import { BottomNav } from './components/BottomNav'
import { ChecklistPanel } from './components/ChecklistPanel'
import { DailyDetail } from './components/DailyDetail'
import { DayNavigator } from './components/DayNavigator'
import { EditModePanel } from './components/EditModePanel'
import { FootprintsPage } from './components/FootprintsPage'
import { OverviewPanel } from './components/OverviewPanel'
import { QuickEditSheet } from './components/QuickEditSheet'
import { ShoppingPanel } from './components/ShoppingPanel'
import { TodayView } from './components/TodayView'
import { Toolbar } from './components/Toolbar'
import { defaultNewDay, defaultTripData } from './data/tripData'
import { useLocalStorage } from './hooks/useLocalStorage'
import type {
  ExternalLink,
  FilterCategory,
  Footprint,
  MainTab,
  MealItem,
  NoteItem,
  PlanBItem,
  TimelineItem,
  TravelFlag,
  TripDay,
} from './types'
import { buildFootprintFromItem } from './utils/footprints'
import { dayHasLinks, getDayProgress, getOverallProgress, matchesDay, reorderList } from './utils/trip'

const STORAGE_KEY = 'travel-trip-manager'
const FOOTPRINTS_STORAGE_KEY = 'travel-footprints'

function getInitialDayId(days: TripDay[]) {
  const today = new Date().toISOString().slice(0, 10)
  return days.find((day) => day.date === today)?.id ?? days[0]?.id ?? ''
}

function App() {
  const [trip, setTrip] = useLocalStorage(STORAGE_KEY, defaultTripData())
  const [footprints, setFootprints] = useLocalStorage<Footprint[]>(FOOTPRINTS_STORAGE_KEY, [])
  const [activeTab, setActiveTab] = useState<MainTab>('today')
  const [selectedDayId, setSelectedDayId] = useState(() => getInitialDayId(defaultTripData().days))
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [cityFilter, setCityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all')
  const [hasPlanBOnly, setHasPlanBOnly] = useState(false)
  const [hasLinksOnly, setHasLinksOnly] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [toast, setToast] = useState('')
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [quickEditTarget, setQuickEditTarget] = useState<{
    collection: 'transportation' | 'itinerary' | 'meals'
    itemId: string
  } | null>(null)

  const filteredDays = useMemo(
    () =>
      trip.days.filter((day) => {
        const cityMatch = cityFilter === 'all' || day.city.includes(cityFilter)
        const planBMatch = !hasPlanBOnly || day.planB.length > 0
        const linksMatch = !hasLinksOnly || dayHasLinks(day)

        return cityMatch && planBMatch && linksMatch && matchesDay(day, deferredQuery, categoryFilter)
      }),
    [trip.days, cityFilter, hasPlanBOnly, hasLinksOnly, deferredQuery, categoryFilter],
  )

  useEffect(() => {
    if (!trip.days.some((day) => day.id === selectedDayId)) {
      setSelectedDayId(getInitialDayId(trip.days))
    }
  }, [trip.days, selectedDayId])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const selectedDay =
    trip.days.find((day) => day.id === selectedDayId) ??
    filteredDays[0] ??
    trip.days[0]

  const quickEditItem =
    quickEditTarget && selectedDay
      ? selectedDay[quickEditTarget.collection].find((item) => item.id === quickEditTarget.itemId) ?? null
      : null

  const selectRelativeDay = (direction: 'prev' | 'next') => {
    if (!selectedDay) return
    const available = filteredDays.length ? filteredDays : trip.days
    const index = available.findIndex((day) => day.id === selectedDay.id)
    if (index < 0) return
    const nextIndex = direction === 'prev' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= available.length) return
    setSelectedDayId(available[nextIndex].id)
  }

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null)
  }

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX === null) return
    const endX = event.changedTouches[0]?.clientX ?? 0
    const diff = endX - touchStartX
    if (Math.abs(diff) > 60) {
      selectRelativeDay(diff > 0 ? 'prev' : 'next')
    }
    setTouchStartX(null)
  }

  const updateSelectedDay = (updater: (day: TripDay) => TripDay) => {
    if (!selectedDay) return

    setTrip((current) => ({
      ...current,
      days: current.days.map((day) => (day.id === selectedDay.id ? updater(day) : day)),
    }))
  }

  const updateChecklistGroup = (
    group: 'finalChecks' | 'packingChecklist' | 'packingZones',
    sectionId: string,
    itemId: string,
  ) => {
    setTrip((current) => ({
      ...current,
      [group]: current[group].map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item,
              ),
            }
          : section,
      ),
    }))
  }

  const toggleTrackableItem = (
    collection: 'transportation' | 'itinerary' | 'meals',
    itemId: string,
    field: 'isDone' | 'isStarred',
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: day[collection].map((item) =>
        item.id === itemId ? { ...item, [field]: !item[field] } : item,
      ),
    }))
  }

  const updateDayField = (field: keyof TripDay, value: string | string[]) => {
    updateSelectedDay((day) => ({ ...day, [field]: value }))
  }

  const updateTimelineField = (
    collection: 'transportation' | 'itinerary',
    itemId: string,
    field: keyof TimelineItem,
    value: string | boolean | FilterCategory | TravelFlag | undefined,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: day[collection].map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const updateMealField = (
    itemId: string,
    field: keyof MealItem,
    value: string | boolean | TravelFlag | undefined,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      meals: day.meals.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    }))
  }

  const updateNoteField = (
    itemId: string,
    field: keyof NoteItem,
    value: string | TravelFlag | undefined,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      notes: day.notes.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    }))
  }

  const updatePlanBField = (itemId: string, field: keyof PlanBItem, value: string) => {
    updateSelectedDay((day) => ({
      ...day,
      planB: day.planB.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    }))
  }

  const updateLinkList = (
    links: ExternalLink[],
    linkId: string,
    field: keyof ExternalLink,
    value: string,
  ) => links.map((link) => (link.id === linkId ? { ...link, [field]: value } : link))

  const createNewLink = (): ExternalLink => ({
    id: crypto.randomUUID(),
    label: '查看連結',
    url: '',
    type: 'info',
  })

  const updateDayLink = (linkId: string, field: keyof ExternalLink, value: string) => {
    updateSelectedDay((day) => ({
      ...day,
      links: updateLinkList(day.links, linkId, field, value),
    }))
  }

  const updateNestedItemLinks = (
    collection: 'transportation' | 'itinerary' | 'meals' | 'notes' | 'planB',
    itemId: string,
    linkId: string,
    field: keyof ExternalLink,
    value: string,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: day[collection].map((item) =>
        item.id === itemId
          ? {
              ...item,
              links: updateLinkList(item.links ?? [], linkId, field, value),
            }
          : item,
      ),
    }))
  }

  const addTimelineItem = (collection: 'transportation' | 'itinerary') => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: [
        ...day[collection],
        {
          id: crypto.randomUUID(),
          time: '',
          title: '',
          category: collection === 'transportation' ? 'transport' : 'activity',
          isDone: false,
          isStarred: false,
        },
      ],
    }))
  }

  const addMeal = () => {
    updateSelectedDay((day) => ({
      ...day,
      meals: [
        ...day.meals,
        { id: crypto.randomUUID(), time: '', title: '', category: 'meal', isDone: false, isStarred: false },
      ],
    }))
  }

  const addNote = () => {
    updateSelectedDay((day) => ({
      ...day,
      notes: [...day.notes, { id: crypto.randomUUID(), title: '', content: '' }],
    }))
  }

  const addPlanB = () => {
    updateSelectedDay((day) => ({
      ...day,
      planB: [...day.planB, { id: crypto.randomUUID(), title: '', content: '' }],
    }))
  }

  const addDayLink = () => {
    updateSelectedDay((day) => ({
      ...day,
      links: [...day.links, createNewLink()],
    }))
  }

  const addItemLink = (
    collection: 'transportation' | 'itinerary' | 'meals' | 'notes' | 'planB',
    itemId: string,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: day[collection].map((item) =>
        item.id === itemId
          ? {
              ...item,
              links: [...(item.links ?? []), createNewLink()],
            }
          : item,
      ),
    }))
  }

  const deleteItem = (
    collection: 'transportation' | 'itinerary' | 'meals' | 'notes' | 'planB',
    itemId: string,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: day[collection].filter((item) => item.id !== itemId),
    }))
  }

  const deleteDayLink = (linkId: string) => {
    updateSelectedDay((day) => ({
      ...day,
      links: day.links.filter((link) => link.id !== linkId),
    }))
  }

  const deleteItemLink = (
    collection: 'transportation' | 'itinerary' | 'meals' | 'notes' | 'planB',
    itemId: string,
    linkId: string,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: day[collection].map((item) =>
        item.id === itemId
          ? {
              ...item,
              links: (item.links ?? []).filter((link) => link.id !== linkId),
            }
          : item,
      ),
    }))
  }

  const moveItem = (
    collection: 'transportation' | 'itinerary' | 'meals' | 'notes' | 'planB',
    index: number,
    direction: 'up' | 'down',
  ) => {
    updateSelectedDay((day) => {
      switch (collection) {
        case 'transportation':
          return { ...day, transportation: reorderList(day.transportation, index, direction) }
        case 'itinerary':
          return { ...day, itinerary: reorderList(day.itinerary, index, direction) }
        case 'meals':
          return { ...day, meals: reorderList(day.meals, index, direction) }
        case 'notes':
          return { ...day, notes: reorderList(day.notes, index, direction) }
        case 'planB':
          return { ...day, planB: reorderList(day.planB, index, direction) }
      }
    })
  }

  const addDay = () => {
    setTrip((current) => {
      const nextDay = defaultNewDay(current.days.length + 1)
      setSelectedDayId(nextDay.id)
      return { ...current, days: [...current.days, nextDay] }
    })
  }

  const deleteCurrentDay = () => {
    if (!selectedDay || trip.days.length <= 1) return

    setTrip((current) => {
      const remainingDays = current.days
        .filter((day) => day.id !== selectedDay.id)
        .map((day, index) => ({ ...day, dayNumber: index + 1 }))

      setSelectedDayId(remainingDays[0]?.id ?? '')
      return { ...current, days: remainingDays }
    })
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(trip, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'trip-manager-backup.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importJson = async (file: File | null) => {
    if (!file) return
    const text = await file.text()
    const parsed = JSON.parse(text) as typeof trip
    setTrip(parsed)
    setSelectedDayId(parsed.days[0]?.id ?? '')
    setToast('已匯入 itinerary')
  }

  const addFootprint = (footprint: Footprint) => {
    let added = false

    setFootprints((current) => {
      if (
        footprint.relatedItemId &&
        current.some(
          (entry) =>
            entry.tripId === footprint.tripId &&
            entry.relatedDayId === footprint.relatedDayId &&
            entry.relatedItemId === footprint.relatedItemId,
        )
      ) {
        return current
      }

      added = true
      return [footprint, ...current]
    })

    setToast(added ? '已加入足跡' : '這個地點已經在足跡裡')
  }

  const updateFootprint = (footprintId: string, updater: (footprint: Footprint) => Footprint) => {
    setFootprints((current) =>
      current.map((footprint) => (footprint.id === footprintId ? updater(footprint) : footprint)),
    )
  }

  const deleteFootprint = (footprintId: string) => {
    setFootprints((current) => current.filter((footprint) => footprint.id !== footprintId))
    setToast('已刪除足跡')
  }

  const addItemToFootprint = (
    collection: 'transportation' | 'itinerary' | 'meals',
    itemId: string,
  ) => {
    if (!selectedDay) return
    const item = selectedDay[collection].find((entry) => entry.id === itemId)
    if (!item) return
    addFootprint(buildFootprintFromItem({ trip, day: selectedDay, item, collection }))
  }

  const isInFootprints = (
    _collection: 'transportation' | 'itinerary' | 'meals',
    itemId: string,
  ) =>
    footprints.some(
      (footprint) =>
        footprint.tripId === trip.id &&
        footprint.relatedDayId === selectedDay?.id &&
        footprint.relatedItemId === itemId,
    )

  const exportFootprintsJson = () => {
    const blob = new Blob([JSON.stringify(footprints, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'footprints-backup.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importFootprintsJson = async (file: File | null) => {
    if (!file) return
    const text = await file.text()
    const parsed = JSON.parse(text) as Footprint[]
    setFootprints(parsed)
    setToast('已匯入 footprints')
  }

  const cities = Array.from(new Set(trip.days.flatMap((day) => day.city.split(' / ')).filter(Boolean)))
  const overallProgress = getOverallProgress(trip)

  return (
    <div className="min-h-screen bg-paper-glow">
      <div className="mobile-shell mx-auto max-w-[1500px] px-3 py-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {activeTab === 'days' ? (
            <>
              <Toolbar
                query={query}
                city={cityFilter}
                category={categoryFilter}
                hasPlanBOnly={hasPlanBOnly}
                hasLinksOnly={hasLinksOnly}
                editMode={editMode}
                cities={cities}
                onQueryChange={setQuery}
                onCityChange={setCityFilter}
                onCategoryChange={setCategoryFilter}
                onPlanBToggle={() => setHasPlanBOnly((value) => !value)}
                onLinksToggle={() => setHasLinksOnly((value) => !value)}
                onEditToggle={() => setEditMode((value) => !value)}
                onTodayMode={() => setActiveTab('today')}
                onExportJson={exportJson}
                onImportJson={importJson}
                onPrint={() => window.print()}
              />
              <DayNavigator
                days={filteredDays}
                selectedDayId={selectedDay?.id ?? ''}
                onSelectDay={setSelectedDayId}
                onAddDay={addDay}
                onDeleteDay={deleteCurrentDay}
                editMode={editMode}
                getProgress={getDayProgress}
              />
            </>
          ) : null}
        </div>

        <div className="mt-4 space-y-5">
          {activeTab === 'today' && selectedDay ? (
            <main onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <TodayView
                day={selectedDay}
                onToggleDone={(collection, itemId) => toggleTrackableItem(collection, itemId, 'isDone')}
                onEditItem={(collection, itemId) => setQuickEditTarget({ collection, itemId })}
              />
            </main>
          ) : null}

          {activeTab === 'days' ? (
            selectedDay ? (
              <main className="space-y-5" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <DailyDetail
                  day={selectedDay}
                  categoryFilter={categoryFilter}
                  query={deferredQuery}
                  onToggleDone={(collection, itemId) => toggleTrackableItem(collection, itemId, 'isDone')}
                  onToggleStar={(collection, itemId) => toggleTrackableItem(collection, itemId, 'isStarred')}
                  onEditItem={(collection, itemId) => setQuickEditTarget({ collection, itemId })}
                  onAddToFootprint={addItemToFootprint}
                  isInFootprints={isInFootprints}
                />

                {editMode ? (
                  <EditModePanel
                    day={selectedDay}
                    onDayChange={updateDayField}
                    onTimelineChange={updateTimelineField}
                    onMealChange={updateMealField}
                    onNoteChange={updateNoteField}
                    onPlanBChange={updatePlanBField}
                    onDayLinkChange={updateDayLink}
                    onItemLinkChange={updateNestedItemLinks}
                    onAddTimelineItem={addTimelineItem}
                    onAddMeal={addMeal}
                    onAddNote={addNote}
                    onAddPlanB={addPlanB}
                    onAddDayLink={addDayLink}
                    onAddItemLink={addItemLink}
                    onDeleteItem={deleteItem}
                    onDeleteDayLink={deleteDayLink}
                    onDeleteItemLink={deleteItemLink}
                    onMoveItem={moveItem}
                  />
                ) : null}
              </main>
            ) : (
              <section className="panel p-10 text-center text-sm text-ink/55">
                沒有符合目前搜尋 / 篩選條件的 day。
              </section>
            )
          ) : null}

          {activeTab === 'checklist' ? (
            <ChecklistPanel
              finalChecks={trip.finalChecks}
              packingChecklist={trip.packingChecklist}
              packingZones={trip.packingZones}
              onToggle={updateChecklistGroup}
            />
          ) : null}

          {activeTab === 'footprints' ? (
            <FootprintsPage
              trip={trip}
              footprints={footprints}
              onAdd={addFootprint}
              onUpdate={updateFootprint}
              onDelete={deleteFootprint}
              onImport={importFootprintsJson}
              onExport={exportFootprintsJson}
            />
          ) : null}

          {activeTab === 'more' ? (
            <div className="space-y-5">
              <OverviewPanel trip={trip} overallProgress={overallProgress} />
              <ShoppingPanel suggestions={trip.shoppingSuggestions} futureFeatures={trip.futureFeatures} />
            </div>
          ) : null}
        </div>
      </div>

      {toast ? (
        <div className="bottom-safe fixed inset-x-0 bottom-24 z-50 px-4">
          <div className="mx-auto max-w-sm rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-white shadow-card">
            {toast}
          </div>
        </div>
      ) : null}

      <QuickEditSheet
        open={Boolean(quickEditTarget && quickEditItem)}
        collection={quickEditTarget?.collection ?? null}
        item={quickEditItem}
        onClose={() => setQuickEditTarget(null)}
        onTimelineChange={(collection, itemId, field, value) =>
          updateTimelineField(collection, itemId, field, value)
        }
        onMealChange={(itemId, field, value) => updateMealField(itemId, field, value)}
      />

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default App
