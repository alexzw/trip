interface FilterBarProps {
  children: React.ReactNode
}

export function FilterBar({ children }: FilterBarProps) {
  return <div className="grid gap-2">{children}</div>
}
