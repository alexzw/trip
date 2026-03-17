import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  label: string
  onClick: () => void
}

export function FloatingActionButton({ label, onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-[calc(96px+env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-sage px-5 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(47,93,80,0.22)] transition hover:translate-y-[-1px] active:translate-y-0"
      aria-label={label}
    >
      <Plus size={18} />
      <span>{label}</span>
    </button>
  )
}
