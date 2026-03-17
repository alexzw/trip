import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet'
import type { Footprint } from '../types'

interface MapViewProps {
  footprints: Footprint[]
  colorForTrip: (tripId: string) => string
  onSelect: (footprintId: string) => void
}

export function MapView({ footprints, colorForTrip, onSelect }: MapViewProps) {
  if (!footprints.length) {
    return <div className="memory-card p-4 text-[14px] text-mist">暫時沒有座標資料可顯示在地圖上。</div>
  }

  return (
    <div className="memory-card overflow-hidden p-0">
      <MapContainer center={[35.6812, 139.7671]} zoom={5} style={{ height: 360, width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {footprints.map((footprint) => (
          <CircleMarker
            key={footprint.id}
            center={[footprint.latitude as number, footprint.longitude as number]}
            eventHandlers={{ click: () => onSelect(footprint.id) }}
            pathOptions={{
              color: colorForTrip(footprint.tripId),
              fillColor: colorForTrip(footprint.tripId),
              fillOpacity: 0.76,
            }}
            radius={7}
          />
        ))}
      </MapContainer>
    </div>
  )
}
