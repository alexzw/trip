import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mobile-shell mx-auto max-w-[420px] px-4 py-4 sm:max-w-[460px]">
        {children}
        <div aria-hidden="true" className="h-[108px] shrink-0" />
      </div>
    </div>
  )
}
