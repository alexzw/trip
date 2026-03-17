export const mobilePageStructure = {
  home: {
    title: 'Trips',
    sections: ['header', 'trip-list', 'travel-os-note'],
  },
  tripDetail: {
    title: 'Trip Detail',
    sections: ['app-header', 'trip-tabs', 'next-action', 'day-list', 'supporting-blocks'],
  },
  dayTimeline: {
    title: 'Day Timeline',
    sections: ['app-header', 'overview', 'timeline', 'supporting-blocks', 'event-detail-sheet'],
  },
  eventDetail: {
    title: 'Event Detail',
    sections: ['title', 'time', 'location', 'notes', 'links', 'actions'],
  },
} as const

export const reusableComponentSystem = [
  'AppHeader',
  'BottomNav',
  'TripCard',
  'DayCard',
  'EventCard',
  'ExpenseItemRow',
  'MemoryCard',
  'FloatingActionButton',
  'EmptyState',
  'SectionHeader',
] as const
