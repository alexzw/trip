export type LinkType = 'map' | 'status' | 'ticket' | 'station' | 'info'

export type TravelFlag = 'important' | 'must-do' | 'must-buy' | 'attention'
export type MainTab = 'today' | 'days' | 'footprints' | 'checklist' | 'more'
export type AppTab = 'home' | 'itinerary' | 'map' | 'expenses' | 'memories'
export type FootprintView = 'map' | 'list' | 'timeline' | 'summary'
export type FootprintSource = 'itinerary' | 'manual' | 'photo-import'
export type FootprintCategory =
  | 'attraction'
  | 'restaurant'
  | 'hotel'
  | 'station'
  | 'walk'
  | 'shopping'
  | 'transport'
  | 'other'

export type FilterCategory =
  | 'all'
  | 'transport'
  | 'activity'
  | 'meal'
  | 'shopping'
  | 'stay'
  | 'ticket'
  | 'note'

export interface ExternalLink {
  id: string
  label: string
  url: string
  type: LinkType
}

export interface SakuraForecast {
  id: string
  dayNumber: number
  label: string
  score: number
  prediction: string
  note: string
}

export interface ShoppingSuggestion {
  id: string
  dayNumber: number
  city: string
  location: string
  recommendation: string
  note: string
}

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

export interface ChecklistSection {
  id: string
  title: string
  description?: string
  items: ChecklistItem[]
}

export interface TimelineItem {
  id: string
  time: string
  endTime?: string
  title: string
  description?: string
  category: Exclude<FilterCategory, 'all'>
  locationName?: string
  links?: ExternalLink[]
  bookingReference?: string
  seatInfo?: string
  isDone: boolean
  isStarred: boolean
  flag?: TravelFlag
}

export interface MealItem {
  id: string
  time: string
  endTime?: string
  title: string
  description?: string
  category?: 'meal'
  links?: ExternalLink[]
  reservationNote?: string
  isDone: boolean
  isStarred: boolean
  flag?: TravelFlag
}

export interface NoteItem {
  id: string
  title: string
  content: string
  links?: ExternalLink[]
  flag?: TravelFlag
}

export interface PlanBItem {
  id: string
  title: string
  content: string
  links?: ExternalLink[]
}

export interface TripDay {
  id: string
  dayNumber: number
  date: string
  weekday: string
  title: string
  city: string
  weather: string
  hotel: string
  summary: string
  tags: string[]
  transportation: TimelineItem[]
  itinerary: TimelineItem[]
  meals: MealItem[]
  notes: NoteItem[]
  links: ExternalLink[]
  planB: PlanBItem[]
}

export interface Traveler {
  id: string
  name: string
  note?: string
}

export interface TripData {
  id: string
  title: string
  dateRange: string
  travelers: Traveler[]
  route: string[]
  cityTags: string[]
  sakuraForecast: SakuraForecast[]
  shoppingSuggestions: ShoppingSuggestion[]
  finalChecks: ChecklistSection[]
  packingChecklist: ChecklistSection[]
  packingZones: ChecklistSection[]
  days: TripDay[]
  futureFeatures: string[]
}

export interface ExpenseItem {
  id: string
  tripId: string
  dayId?: string
  date: string
  title: string
  amount: number
  currency: string
  category: 'transport' | 'meal' | 'stay' | 'shopping' | 'ticket' | 'other'
  note?: string
}

export interface MemoryEntry {
  id: string
  tripId: string
  dayId?: string
  date: string
  title: string
  caption?: string
  note?: string
  imageUrl?: string
  emoji?: string
  placeName?: string
}

export interface TripStore {
  trips: TripData[]
  expenses: ExpenseItem[]
  memories: MemoryEntry[]
}

export interface FootprintPhoto {
  id: string
  takenAt?: string
  latitude?: number
  longitude?: number
  url?: string
  note?: string
}

export interface Footprint {
  id: string
  tripId: string
  tripTitle: string
  date: string
  placeName: string
  city: string
  country: string
  category: FootprintCategory
  latitude?: number
  longitude?: number
  mapLink?: string
  note: string
  source: FootprintSource
  relatedDayId?: string
  relatedItemId?: string
  isFavorite: boolean
  photos: FootprintPhoto[]
}
