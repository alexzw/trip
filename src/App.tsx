import { useEffect, useMemo, useState, type TouchEvent } from 'react'
import { AppShell } from './components/AppShell'
import { BottomNav } from './components/BottomNav'
import { DayTimelinePage } from './components/DayTimelinePage'
import { EventDetailSheet } from './components/EventDetailSheet'
import { FloatingActionButton } from './components/FloatingActionButton'
import { TripDetailPage } from './components/TripDetailPage'
import { TripsHomePage } from './components/TripsHomePage'
import { defaultNewDay, defaultNewTrip, defaultTripStore } from './data/tripData'
import { useLocalStorage } from './hooks/useLocalStorage'
import type {
  AppTab,
  ExpenseItem,
  Footprint,
  MealItem,
  MemoryEntry,
  TimelineItem,
  TripData,
  TripDay,
  TripStore,
} from './types'
import { buildFootprintFromItem } from './utils/footprints'

const STORE_KEY = 'travel-trip-manager'
const FOOTPRINTS_KEY = 'travel-footprints'

type AppScreen = 'home' | 'trip' | 'day'
type EventCollection = 'transportation' | 'itinerary' | 'meals'

function getInitialDayId(days: TripDay[]) {
  const today = new Date().toISOString().slice(0, 10)
  return days.find((day) => day.date === today)?.id ?? days[0]?.id ?? ''
}

function normalizeStorePayload(payload: TripStore | TripData | null | undefined): TripStore {
  if (payload && 'trips' in payload) {
    return payload
  }

  if (payload && 'days' in payload) {
    return {
      trips: [payload],
      expenses: [],
      memories: [],
    }
  }

  return defaultTripStore()
}

function blankTimelineItem(collection: EventCollection): TimelineItem | MealItem {
  const base = {
    id: crypto.randomUUID(),
    time: '',
    title: collection === 'transportation' ? 'New transport' : collection === 'meals' ? 'New meal' : 'New event',
    description: '',
    isDone: false,
    isStarred: false,
  }

  if (collection === 'meals') {
    return base
  }

  return {
    ...base,
    category: collection === 'transportation' ? 'transport' : 'activity',
    locationName: '',
    bookingReference: '',
    seatInfo: '',
  }
}

function App() {
  const [rawStore, setRawStore] = useLocalStorage<TripStore | TripData>(STORE_KEY, defaultTripStore())
  const [footprints, setFootprints] = useLocalStorage<Footprint[]>(FOOTPRINTS_KEY, [])
  const store = useMemo(() => normalizeStorePayload(rawStore), [rawStore])

  const [screen, setScreen] = useState<AppScreen>('home')
  const [activeTab, setActiveTab] = useState<AppTab>('home')
  const [selectedTripId, setSelectedTripId] = useState(store.trips[0]?.id ?? '')
  const [selectedDayId, setSelectedDayId] = useState(store.trips[0] ? getInitialDayId(store.trips[0].days) : '')
  const [eventTarget, setEventTarget] = useState<{ collection: EventCollection; itemId: string } | null>(null)
  const [toast, setToast] = useState('')
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  useEffect(() => {
    if (!('trips' in rawStore)) {
      setRawStore(store)
    }
  }, [rawStore, setRawStore, store])

  useEffect(() => {
    if (!store.trips.some((trip) => trip.id === selectedTripId)) {
      const fallbackTrip = store.trips[0]
      setSelectedTripId(fallbackTrip?.id ?? '')
      setSelectedDayId(fallbackTrip ? getInitialDayId(fallbackTrip.days) : '')
      if (!fallbackTrip) {
        setScreen('home')
        setActiveTab('home')
      }
    }
  }, [selectedTripId, store.trips])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const selectedTrip = store.trips.find((trip) => trip.id === selectedTripId) ?? store.trips[0]
  const selectedDay = selectedTrip?.days.find((day) => day.id === selectedDayId) ?? selectedTrip?.days[0]
  const activeBottomTab = screen === 'home' ? 'home' : activeTab

  const eventItem =
    eventTarget && selectedDay
      ? selectedDay[eventTarget.collection].find((item) => item.id === eventTarget.itemId) ?? null
      : null

  const updateStore = (updater: (current: TripStore) => TripStore) => {
    setRawStore((current) => updater(normalizeStorePayload(current)))
  }

  const updateSelectedTrip = (updater: (trip: TripData) => TripData) => {
    if (!selectedTrip) return
    updateStore((current) => ({
      ...current,
      trips: current.trips.map((trip) => (trip.id === selectedTrip.id ? updater(trip) : trip)),
    }))
  }

  const updateSelectedDay = (updater: (day: TripDay) => TripDay) => {
    if (!selectedTrip || !selectedDay) return
    updateSelectedTrip((trip) => ({
      ...trip,
      days: trip.days.map((day) => (day.id === selectedDay.id ? updater(day) : day)),
    }))
  }

  const handleOpenTrip = (tripId: string) => {
    const trip = store.trips.find((item) => item.id === tripId)
    if (!trip) return
    setSelectedTripId(tripId)
    setSelectedDayId(getInitialDayId(trip.days))
    setScreen('trip')
    setActiveTab('itinerary')
  }

  const handleBottomNav = (tab: AppTab) => {
    if (tab === 'home') {
      setScreen('home')
      setActiveTab('home')
      return
    }

    if (!selectedTrip && store.trips[0]) {
      handleOpenTrip(store.trips[0].id)
      return
    }

    setActiveTab(tab)
    setScreen('trip')
  }

  const handleAddTrip = () => {
    const trip = defaultNewTrip()
    updateStore((current) => ({
      ...current,
      trips: [trip, ...current.trips],
    }))
    setSelectedTripId(trip.id)
    setSelectedDayId(getInitialDayId(trip.days))
    setScreen('trip')
    setActiveTab('itinerary')
    setToast('New trip created')
  }

  const handleAddDay = () => {
    if (!selectedTrip) return
    const dayNumber = selectedTrip.days.length + 1
    const day = defaultNewDay(dayNumber)
    updateSelectedTrip((trip) => ({
      ...trip,
      days: [...trip.days, day],
    }))
    setSelectedDayId(day.id)
    setScreen('day')
    setToast('Day added')
  }

  const handleAddEvent = (collection: EventCollection = 'itinerary') => {
    const nextItem = blankTimelineItem(collection)
    updateSelectedDay((day) => ({
      ...day,
      [collection]: [...day[collection], nextItem],
    }))
    setEventTarget({ collection, itemId: nextItem.id })
    setToast('Event added')
  }

  const toggleDone = (collection: EventCollection, itemId: string) => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: day[collection].map((item) =>
        item.id === itemId ? { ...item, isDone: !item.isDone } : item,
      ),
    }))
  }

  const toggleStar = (collection: EventCollection, itemId: string) => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: day[collection].map((item) =>
        item.id === itemId ? { ...item, isStarred: !item.isStarred } : item,
      ),
    }))
  }

  const saveEvent = (collection: EventCollection, itemId: string, updates: Partial<TimelineItem & MealItem>) => {
    updateSelectedDay((day) => ({
      ...day,
      [collection]: day[collection].map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    }))
  }

  const addFootprintFromEvent = (collection: EventCollection, itemId: string) => {
    if (!selectedTrip || !selectedDay) return
    const sourceItem = selectedDay[collection].find((item) => item.id === itemId)
    if (!sourceItem) return

    const existing = footprints.find(
      (footprint) => footprint.relatedDayId === selectedDay.id && footprint.relatedItemId === sourceItem.id,
    )
    if (existing) {
      setToast('Already in memories')
      return
    }

    setFootprints((current) => [
      buildFootprintFromItem({
        trip: selectedTrip,
        day: selectedDay,
        item: sourceItem,
        collection,
      }),
      ...current,
    ])
    setToast('Added to memories')
  }

  const addExpense = () => {
    if (!selectedTrip) return
    const day = selectedDay ?? selectedTrip.days[0]
    const expense: ExpenseItem = {
      id: crypto.randomUUID(),
      tripId: selectedTrip.id,
      dayId: day?.id,
      date: day?.date ?? '',
      title: 'New expense',
      amount: 0,
      currency: 'JPY',
      category: 'other',
      note: '',
    }
    updateStore((current) => ({
      ...current,
      expenses: [expense, ...current.expenses],
    }))
    setToast('Expense placeholder added')
  }

  const addMemory = () => {
    if (!selectedTrip) return
    const day = selectedDay ?? selectedTrip.days[0]
    const memory: MemoryEntry = {
      id: crypto.randomUUID(),
      tripId: selectedTrip.id,
      dayId: day?.id,
      date: day?.date ?? '',
      title: day ? `Day ${day.dayNumber} memory` : 'New memory',
      caption: '',
      note: '',
      emoji: '📷',
      placeName: day?.city,
    }
    updateStore((current) => ({
      ...current,
      memories: [memory, ...current.memories],
    }))
    setToast('Memory card added')
  }

  const selectRelativeDay = (direction: 'prev' | 'next') => {
    if (!selectedTrip || !selectedDay) return
    const index = selectedTrip.days.findIndex((day) => day.id === selectedDay.id)
    if (index < 0) return
    const nextIndex = direction === 'prev' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= selectedTrip.days.length) return
    setSelectedDayId(selectedTrip.days[nextIndex].id)
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

  return (
    <AppShell>
      {screen === 'home' || !selectedTrip ? (
        <TripsHomePage trips={store.trips} onOpenTrip={handleOpenTrip} onAddTrip={handleAddTrip} />
      ) : null}

      {screen === 'trip' && selectedTrip ? (
        <TripDetailPage
          trip={selectedTrip}
          activeTab={activeTab === 'home' ? 'itinerary' : activeTab}
          footprints={footprints}
          expenses={store.expenses}
          memories={store.memories}
          finalChecks={selectedTrip.finalChecks}
          packingChecklist={[...selectedTrip.packingChecklist, ...selectedTrip.packingZones]}
          onBack={() => {
            setScreen('home')
            setActiveTab('home')
          }}
          onChangeTab={(tab) => {
            setActiveTab(tab)
            setScreen('trip')
          }}
          onOpenDay={(dayId) => {
            setSelectedDayId(dayId)
            setScreen('day')
            setActiveTab('itinerary')
          }}
          onAddExpense={addExpense}
          onAddMemory={addMemory}
        />
      ) : null}

      {screen === 'day' && selectedDay ? (
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <DayTimelinePage
            day={selectedDay}
            onBack={() => setScreen('trip')}
            onPrevDay={() => selectRelativeDay('prev')}
            onNextDay={() => selectRelativeDay('next')}
            onOpenEvent={(collection, itemId) => setEventTarget({ collection, itemId })}
            onToggleDone={toggleDone}
          />
        </div>
      ) : null}

      <BottomNav activeTab={activeBottomTab} onChange={handleBottomNav} />

      {screen === 'home' ? <FloatingActionButton label="New Trip" onClick={handleAddTrip} /> : null}
      {screen === 'trip' && activeTab === 'itinerary' ? <FloatingActionButton label="Add Day" onClick={handleAddDay} /> : null}
      {screen === 'trip' && activeTab === 'expenses' ? <FloatingActionButton label="Add Expense" onClick={addExpense} /> : null}
      {screen === 'trip' && activeTab === 'memories' ? <FloatingActionButton label="Add Memory" onClick={addMemory} /> : null}
      {screen === 'day' ? <FloatingActionButton label="Add Event" onClick={() => handleAddEvent('itinerary')} /> : null}

      <EventDetailSheet
        open={Boolean(eventTarget && eventItem)}
        item={eventItem}
        collection={eventTarget?.collection ?? null}
        onClose={() => setEventTarget(null)}
        onToggleStar={() => {
          if (!eventTarget) return
          toggleStar(eventTarget.collection, eventTarget.itemId)
        }}
        onAddFootprint={
          eventTarget
            ? () => addFootprintFromEvent(eventTarget.collection, eventTarget.itemId)
            : undefined
        }
        onSave={(updates) => {
          if (!eventTarget) return
          saveEvent(eventTarget.collection, eventTarget.itemId, updates)
        }}
      />

      {toast ? (
        <div className="bottom-safe fixed inset-x-0 bottom-[96px] z-50 px-4">
          <div className="mx-auto max-w-[360px] rounded-full bg-ink px-4 py-3 text-center text-[13px] font-medium text-white shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}
    </AppShell>
  )
}

export default App
