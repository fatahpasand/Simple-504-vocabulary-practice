'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import WordListItem from '@/components/WordListItem'
import { getHardWords, toggleHardWord, type Word } from '@/lib/vocab'

interface WordListProps {
  title: string
  words: Word[]
  onBack: () => void
  emptyMessage?: string
}

export default function WordList({ title, words, onBack, emptyMessage }: WordListProps) {
  const [revealedAll, setRevealedAll] = useState(true)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [hardWords, setHardWordsState] = useState<string[]>([])

  useEffect(() => {
    setHardWordsState(getHardWords())
  }, [])

  // Initialize all revealed by default
  useEffect(() => {
    const initial: Record<string, boolean> = {}
    words.forEach((w) => {
      initial[w.word] = true
    })
    setRevealed(initial)
    setRevealedAll(true)
  }, [words])

  const handleToggleAll = () => {
    const next = !revealedAll
    setRevealedAll(next)
    const updated: Record<string, boolean> = {}
    words.forEach((w) => {
      updated[w.word] = next
    })
    setRevealed(updated)
  }

  const handleToggleReveal = (word: string) => {
    setRevealed((prev) => ({ ...prev, [word]: !prev[word] }))
  }

  const handleToggleHard = (word: string) => {
    setHardWordsState(toggleHardWord(word))
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <Button variant="outline" size="sm" onClick={handleToggleAll}>
          {revealedAll ? (
            <>
              <EyeOff data-icon="inline-start" />
              Hide All
            </>
          ) : (
            <>
              <Eye data-icon="inline-start" />
              Reveal All
            </>
          )}
        </Button>
      </div>

      {words.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {emptyMessage || 'No words to show.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {words.map((word) => (
            <WordListItem
              key={word.word}
              word={word}
              revealed={!!revealed[word.word]}
              isHard={hardWords.includes(word.word)}
              onToggleReveal={() => handleToggleReveal(word.word)}
              onToggleHard={() => handleToggleHard(word.word)}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
