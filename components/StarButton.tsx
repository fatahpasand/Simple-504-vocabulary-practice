'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarButtonProps {
  active: boolean
  onToggle: () => void
  className?: string
}

export default function StarButton({ active, onToggle, className }: StarButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      aria-label={active ? 'Unmark as hard word' : 'Mark as hard word'}
      aria-pressed={active}
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted',
        className,
      )}
    >
      <Star
        className={cn(
          'size-5 transition-colors',
          active
            ? 'fill-[var(--accent-strong)] text-[var(--accent-strong)]'
            : 'text-muted-foreground',
        )}
      />
    </button>
  )
}
