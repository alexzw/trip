import { Camera, ReceiptText } from 'lucide-react'
import type { ShoppingSuggestion, TripData } from '../types'
import { SectionCard } from './SectionCard'

interface ShoppingPanelProps {
  suggestions: ShoppingSuggestion[]
  futureFeatures: TripData['futureFeatures']
}

export function ShoppingPanel({ suggestions, futureFeatures }: ShoppingPanelProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <SectionCard title="購物 / 手信建議" subtitle="哪一天買最順、買什麼最合適">
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <article
              key={suggestion.id}
              className="rounded-3xl border border-ink/10 bg-white p-4 transition hover:border-sage/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-ink/45">
                    Day {suggestion.dayNumber} · {suggestion.city}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink">{suggestion.location}</div>
                </div>
                <span className="chip bg-sage/10 text-sage">{suggestion.recommendation}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/65">{suggestion.note}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="space-y-5">
        <SectionCard title="Print / PDF Friendly View" subtitle="已預留，可直接用瀏覽器列印">
          <p className="text-sm leading-7 text-ink/65">
            目前已經支援基本列印樣式，後續可以把它擴充成專門的精簡 PDF 版，例如只列出每天重點、票券資訊和 checklists。
          </p>
        </SectionCard>

        <SectionCard title="之後擴充位置" subtitle="預留 Budget / 照片牆 功能">
          <div className="space-y-3">
            <div className="rounded-3xl border border-ink/10 bg-sand/60 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <ReceiptText size={16} className="text-sage" />
                Budget / 花費記錄
              </div>
              <p className="mt-2 text-sm text-ink/65">
                {futureFeatures.find((feature) => feature.includes('Budget'))}，之後可直接接欄位、分類和每日總額。
              </p>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-sand/60 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Camera size={16} className="text-sage" />
                照片牆 / 每日相片
              </div>
              <p className="mt-2 text-sm text-ink/65">
                {futureFeatures.find((feature) => feature.includes('照片牆'))}，可日後接本地上傳或雲端相簿。
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
