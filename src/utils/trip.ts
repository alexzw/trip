import type { FilterCategory, MealItem, TimelineItem, TripData, TripDay } from '../types'

const includesQuery = (source: string | undefined, query: string) =>
  (source ?? '').toLowerCase().includes(query)

export function formatTimeRange(time: string, endTime?: string) {
  return endTime ? `${time}–${endTime}` : time
}

export function formatDisplayDate(date: string, weekday?: string) {
  if (!date) return weekday ?? '未設定日期'

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return [date, weekday].filter(Boolean).join(' · ')
  }

  const formatted = new Intl.DateTimeFormat('zh-HK', {
    month: 'short',
    day: 'numeric',
  }).format(parsed)

  return [formatted, weekday].filter(Boolean).join(' · ')
}

export function parseTimeToMinutes(time?: string) {
  if (!time) return null
  const normalized = time.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!normalized) return null

  const hours = Number(normalized[1])
  const minutes = Number(normalized[2])
  return hours * 60 + minutes
}

export function currentMinutes() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

export function sortByTime<T extends { time: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const left = parseTimeToMinutes(a.time) ?? Number.MAX_SAFE_INTEGER
    const right = parseTimeToMinutes(b.time) ?? Number.MAX_SAFE_INTEGER
    return left - right
  })
}

export type TrackableCollection = 'transportation' | 'itinerary' | 'meals'

export interface TrackableEntry {
  id: string
  collection: TrackableCollection
  item: TimelineItem | MealItem
}

export function getTrackableEntries(day: TripDay): TrackableEntry[] {
  return [
    ...day.transportation.map((item) => ({ id: item.id, collection: 'transportation' as const, item })),
    ...day.itinerary.map((item) => ({ id: item.id, collection: 'itinerary' as const, item })),
    ...day.meals.map((item) => ({ id: item.id, collection: 'meals' as const, item })),
  ].sort((a, b) => {
    const left = parseTimeToMinutes(a.item.time) ?? Number.MAX_SAFE_INTEGER
    const right = parseTimeToMinutes(b.item.time) ?? Number.MAX_SAFE_INTEGER
    return left - right
  })
}

function isCurrentDay(day: TripDay) {
  if (!day.date) return false
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  return day.date === today
}

export function getCurrentEntryIndex(day: TripDay) {
  const entries = getTrackableEntries(day)
  if (entries.length === 0) return -1

  if (!isCurrentDay(day)) {
    const firstUndoneIndex = entries.findIndex((entry) => !entry.item.isDone)
    return firstUndoneIndex >= 0 ? firstUndoneIndex : 0
  }

  const nowMinutes = currentMinutes()
  const activeIndex = entries.findIndex((entry) => {
    const start = parseTimeToMinutes(entry.item.time)
    const end = parseTimeToMinutes(entry.item.endTime)
    if (start === null) return false
    if (end === null) return nowMinutes <= start + 45
    return nowMinutes >= start && nowMinutes <= end
  })

  if (activeIndex >= 0) return activeIndex

  const nextIndex = entries.findIndex((entry) => {
    const start = parseTimeToMinutes(entry.item.time)
    return start !== null && start >= nowMinutes
  })

  if (nextIndex >= 0) return nextIndex

  return entries.length - 1
}

export function getTimelineWindow(day: TripDay, size = 5) {
  const entries = getTrackableEntries(day)
  const currentIndex = getCurrentEntryIndex(day)

  if (entries.length <= size) {
    return {
      entries,
      currentIndex,
      startIndex: 0,
    }
  }

  const safeCurrentIndex = Math.max(currentIndex, 0)
  const startIndex = Math.max(
    0,
    Math.min(entries.length - size, safeCurrentIndex - Math.floor(size / 2)),
  )

  return {
    entries: entries.slice(startIndex, startIndex + size),
    currentIndex,
    startIndex,
  }
}

export function getNextAction(day: TripDay) {
  const entries = getTrackableEntries(day)
  if (entries.length === 0) return null

  const currentIndex = getCurrentEntryIndex(day)
  const startIndex = currentIndex >= 0 ? currentIndex : 0
  return entries
    .slice(startIndex)
    .find((entry) => !entry.item.isDone) ?? entries[startIndex] ?? entries[0]
}

export function getNextMeal(day: TripDay) {
  const meals = sortByTime(day.meals)
  if (meals.length === 0) return null

  if (!isCurrentDay(day)) {
    return meals.find((meal) => !meal.isDone) ?? meals[0]
  }

  const nowMinutes = currentMinutes()
  return (
    meals.find((meal) => {
      const start = parseTimeToMinutes(meal.time)
      return start !== null && start >= nowMinutes && !meal.isDone
    }) ??
    meals.find((meal) => !meal.isDone) ??
    meals[0]
  )
}

export function getDayProgress(day: TripDay) {
  const trackable = [...day.transportation, ...day.itinerary, ...day.meals]
  if (trackable.length === 0) {
    return 0
  }

  const completed = trackable.filter((item) => item.isDone).length
  return Math.round((completed / trackable.length) * 100)
}

export function getOverallProgress(trip: TripData) {
  const values = trip.days.map(getDayProgress)
  if (values.length === 0) {
    return 0
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function getChecklistProgress(sections: TripData['finalChecks']) {
  const items = sections.flatMap((section) => section.items)
  const total = items.length
  const completed = items.filter((item) => item.checked).length

  return {
    total,
    completed,
    remaining: Math.max(total - completed, 0),
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}

export function matchesDay(day: TripDay, query: string, category: FilterCategory) {
  const normalized = query.trim().toLowerCase()

  const matchesCategory =
    category === 'all' ||
    day.transportation.some((item) => item.category === category) ||
    day.itinerary.some((item) => item.category === category) ||
    day.meals.some(() => category === 'meal') ||
    day.notes.some(() => category === 'note') ||
    (category === 'stay' && Boolean(day.hotel))

  if (!matchesCategory) {
    return false
  }

  if (!normalized) {
    return true
  }

  const flatText = [
    day.title,
    day.city,
    day.summary,
    day.weather,
    day.hotel,
    ...day.tags,
    ...day.transportation.flatMap((item) => [
      item.title,
      item.description,
      item.bookingReference,
      item.seatInfo,
    ]),
    ...day.itinerary.flatMap((item) => [item.title, item.description]),
    ...day.meals.flatMap((item) => [item.title, item.description]),
    ...day.notes.flatMap((item) => [item.title, item.content]),
    ...day.links.flatMap((item) => [item.label]),
    ...day.planB.flatMap((item) => [item.title, item.content]),
  ]

  return flatText.some((entry) => includesQuery(entry, normalized))
}

export function dayHasLinks(day: TripDay) {
  return (
    day.links.length > 0 ||
    day.transportation.some((item) => (item.links?.length ?? 0) > 0) ||
    day.itinerary.some((item) => (item.links?.length ?? 0) > 0) ||
    day.meals.some((item) => (item.links?.length ?? 0) > 0) ||
    day.notes.some((item) => (item.links?.length ?? 0) > 0) ||
    day.planB.some((item) => (item.links?.length ?? 0) > 0)
  )
}

export function reorderList<T>(items: T[], index: number, direction: 'up' | 'down') {
  const nextIndex = direction === 'up' ? index - 1 : index + 1

  if (nextIndex < 0 || nextIndex >= items.length) {
    return items
  }

  const copy = [...items]
  const [moved] = copy.splice(index, 1)
  copy.splice(nextIndex, 0, moved)
  return copy
}
