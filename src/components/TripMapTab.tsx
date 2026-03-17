import { MapPin } from 'lucide-react'
import type { Footprint, TripData } from '../types'
import { MapView } from './MapView'
import { EmptyState } from './EmptyState'

interface TripMapTabProps {
  trip: TripData
  footprints: Footprint[]
  onAddMemory: () => void
}

export function TripMapTab({ trip, footprints, onAddMemory }: TripMapTabProps) {
  const tripFootprints = footprints.filter((item) => item.tripId === trip.id)
  const mappable = tripFootprints.filter((item) => typeof item.latitude === 'number' && typeof item.longitude === 'number')

  if (tripFootprints.length === 0) {
    return (
      <EmptyState
        title="No places pinned yet"
        description="當你在行程裡將地點標記為 visited，這個地圖就會開始有旅程感。"
        actionLabel="新增回憶"
        onAction={onAddMemory}
      />
    )
  }

  return (
    <div className="space-y-4">
      {mappable.length > 0 ? (
        <MapView footprints={mappable} colorForTrip={() => '#2F5D50'} onSelect={() => undefined} />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate bg-white p-5 text-[14px] leading-6 text-mist">
          這些足跡已經記錄下來了，但暫時未有座標，所以目前先用列表方式查看。
        </section>
      )}
      <div className="space-y-3">
        {tripFootprints.map((footprint) => (
          <article key={footprint.id} className="rounded-2xl border border-slate bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-2xl bg-[#F1F1EF] p-2 text-mist">
                <MapPin size={15} />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-ink">{footprint.placeName}</div>
                <div className="mt-1 text-[13px] text-mist">
                  {footprint.city} · {footprint.category}
                </div>
                {footprint.note ? <div className="mt-2 text-[14px] leading-6 text-mist">{footprint.note}</div> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
