'use client'

import { cn } from '@/lib/utils'
import StarButton from '@/components/StarButton'
import type { Word } from '@/lib/vocab'

interface WordListItemProps {
  word: Word
  revealed: boolean
  isHard: boolean
  onToggleReveal: () => void
  onToggleHard: () => void
}

export default function WordListItem({
  word,
  revealed,
  isHard,
  onToggleReveal,
  onToggleHard,
}: WordListItemProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onToggleReveal}
          className="flex-1 text-left"
          aria-expanded={revealed}
        >
          <span className="font-medium text-foreground">{word.word}</span>
          <span className="ml-2 text-xs text-muted-foreground">
            Lesson {word.lesson}
          </span>
        </button>
        <StarButton active={isHard} onToggle={onToggleHard} />
      </div>

      <button
        type="button"
        onClick={onToggleReveal}
        className="block w-full text-left mt-2"
        aria-hidden={!revealed}
      >
        <div className="relative">
          <p
            className={cn(
              'text-sm leading-relaxed text-muted-foreground transition-all duration-300',
              revealed ? 'blur-0 opacity-100' : 'blur-[6px] opacity-40 select-none',
            )}
          >
            {word.definition}
          </p>
        </div>
      </button>
    </div>
  )
}
