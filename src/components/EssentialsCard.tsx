import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ExternalLink } from '../types'

interface EssentialBlock {
  id: string
  label: string
  value: string
}

interface EssentialsCardProps {
  open: boolean
  onToggle: () => void
  hotel: string
  blocks: EssentialBlock[]
  quickLinks: ExternalLink[]
}

export function EssentialsCard({ open, onToggle, hotel, blocks, quickLinks }: EssentialsCardProps) {
  return (
    <section className="touch-card">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-left">
        <div>
          <div className="text-[16px] font-medium text-ink">Today Essentials</div>
          <div className="mt-1 text-[14px] text-mist">航班、QR、酒店、預約</div>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-[#F9FAF8] p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-mist">Hotel</div>
            <div className="mt-2 text-[14px] text-ink">{hotel}</div>
          </div>
          {blocks.map((block) => (
            <div key={block.id} className="rounded-2xl bg-[#F9FAF8] p-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-mist">{block.label}</div>
              <div className="mt-2 text-[14px] text-ink">{block.value}</div>
            </div>
          ))}
          {quickLinks.length ? (
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#D9E6E0] bg-[#F1F7F4] px-4 py-2 text-[14px] font-medium text-sage"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
