import { Compass, Plus } from 'lucide-react'
import type { TripData } from '../types'
import { getTripDateMeta, getTripStatus } from '../utils/trip'
import { AppHeader } from './AppHeader'
import { EmptyState } from './EmptyState'
import { SectionHeader } from './SectionHeader'
import { TripCard } from './TripCard'

interface TripsHomePageProps {
  trips: TripData[]
  onOpenTrip: (tripId: string) => void
  onAddTrip: () => void
}

export function TripsHomePage({ trips, onOpenTrip, onAddTrip }: TripsHomePageProps) {
  return (
    <div className="space-y-5">
      <AppHeader
        eyebrow="Trips"
        title="Trips"
        subtitle="Planning → experiencing → remembering"
        meta="你的旅行清單、旅程中操作入口、以及回來之後的記憶整理，都從這裡開始。"
        action={
          <button onClick={onAddTrip} className="rounded-full border border-slate bg-white p-3 text-mist">
            <Plus size={18} />
          </button>
        }
      />
      {trips.length === 0 ? (
        <EmptyState
          title="No trips yet"
          description="建立第一個旅程之後，之後每次出發都可以直接沿用這個操作系統。"
          actionLabel="新增旅程"
          onAction={onAddTrip}
        />
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => {
            const meta = getTripDateMeta(trip)
            return (
              <TripCard
                key={trip.id}
                trip={trip}
                totalDays={meta.totalDays}
                status={getTripStatus(trip)}
                onOpen={() => onOpenTrip(trip.id)}
              />
            )
          })}
        </div>
      )}
      <section className="rounded-2xl border border-slate bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-2xl bg-[#F1F1EF] p-2 text-mist">
            <Compass size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <SectionHeader title="Travel OS" subtitle="先在這裡選旅程，之後就可以順著 Itinerary、Map、Expenses、Memories 一路用到底。" />
          </div>
        </div>
      </section>
    </div>
  )
}
