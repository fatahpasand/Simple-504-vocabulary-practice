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
        className="block w-full text-left"
        aria-hidden={!revealed}
      >
        <div
          className={cn(
            'grid transition-all duration-300 ease-in-out',
            revealed ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            <p
              className={cn(
                'text-sm leading-relaxed text-muted-foreground transition-[filter] duration-300',
                revealed ? 'blur-0' : 'blur-sm',
              )}
            >
              {word.definition}
            </p>
          </div>
        </div>
      </button>
    </div>
  )
}
