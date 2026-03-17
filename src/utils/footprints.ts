import type {
  ExternalLink,
  Footprint,
  FootprintCategory,
  FootprintSource,
  MealItem,
  TimelineItem,
  TripData,
  TripDay,
} from '../types'

const cityCountryMap: Record<string, string> = {
  香港: 'Hong Kong',
  台北: 'Taiwan',
  名古屋: 'Japan',
  高山: 'Japan',
  京都: 'Japan',
  關西機場: 'Japan',
  鈴鹿: 'Japan',
  KIX: 'Japan',
}

function firstMapLink(links?: ExternalLink[]) {
  return links?.find((link) => link.type === 'map')?.url ?? links?.[0]?.url
}

export function inferCountry(city: string) {
  const match = Object.entries(cityCountryMap).find(([key]) => city.includes(key))
  return match?.[1] ?? 'Unknown'
}

export function inferFootprintCategory(
  item: TimelineItem | MealItem,
  collection: 'transportation' | 'itinerary' | 'meals',
): FootprintCategory {
  const text = `${item.title} ${item.description ?? ''}`.toLowerCase()

  if (collection === 'meals') return 'restaurant'
  if (text.includes('hotel') || text.includes('酒店')) return 'hotel'
  if (text.includes('站') || text.includes('station')) return 'station'
  if (text.includes('散步') || text.includes('步道') || text.includes('竹林') || text.includes('river'))
    return 'walk'
  if (text.includes('商圈') || text.includes('手信') || text.includes('shopping')) return 'shopping'
  if (collection === 'transportation') return 'transport'
  return 'attraction'
}

export function extractLatLng(mapLink?: string): { latitude?: number; longitude?: number } {
  if (!mapLink) return {}

  const directMatch = mapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (directMatch) {
    return {
      latitude: Number(directMatch[1]),
      longitude: Number(directMatch[2]),
    }
  }

  const llMatch = mapLink.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (llMatch) {
    return {
      latitude: Number(llMatch[1]),
      longitude: Number(llMatch[2]),
    }
  }

  return {}
}

export function buildFootprintFromItem({
  trip,
  day,
  item,
  collection,
  source = 'itinerary',
}: {
  trip: TripData
  day: TripDay
  item: TimelineItem | MealItem
  collection: 'transportation' | 'itinerary' | 'meals'
  source?: FootprintSource
}): Footprint {
  const mapLink = firstMapLink(item.links)
  const coords = extractLatLng(mapLink)

  return {
    id: crypto.randomUUID(),
    tripId: trip.id,
    tripTitle: trip.title,
    date: day.date,
    placeName: ('locationName' in item && item.locationName) ? item.locationName : item.title,
    city: day.city,
    country: inferCountry(day.city),
    category: inferFootprintCategory(item, collection),
    mapLink,
    note: item.description ?? '',
    source,
    relatedDayId: day.id,
    relatedItemId: item.id,
    isFavorite: item.isStarred,
    photos: [],
    ...coords,
  }
}

export function createEmptyFootprint(trip: TripData): Footprint {
  return {
    id: crypto.randomUUID(),
    tripId: trip.id,
    tripTitle: trip.title,
    date: '',
    placeName: '',
    city: '',
    country: '',
    category: 'other',
    mapLink: '',
    note: '',
    source: 'manual',
    relatedDayId: undefined,
    relatedItemId: undefined,
    isFavorite: false,
    photos: [],
  }
}

export function footprintMatchesQuery(footprint: Footprint, query: string) {
  if (!query.trim()) return true
  const normalized = query.trim().toLowerCase()
  return [footprint.placeName, footprint.city, footprint.note, footprint.tripTitle]
    .join(' ')
    .toLowerCase()
    .includes(normalized)
}

export function footprintYear(date: string) {
  return date ? new Date(date).getFullYear().toString() : 'Unknown'
}
