'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Eye, EyeOff, ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import WordListItem from '@/components/WordListItem'
import { getHardWords, toggleHardWord, type Word } from '@/lib/vocab'

interface WordListProps {
  words: Word[]
  onBack: () => void
}

export default function WordList({ words, onBack }: WordListProps) {
  const [revealedAll, setRevealedAll] = useState(true)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [hardWords, setHardWordsState] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [showStarredOnly, setShowStarredOnly] = useState(false)

  useEffect(() => {
    setHardWordsState(getHardWords())
  }, [])

  // Group words by lesson
  const lessonGroups = useMemo(() => {
    const groups: { lesson: number; words: Word[] }[] = []
    const lessonMap = new Map<number, Word[]>()
    words.forEach((w) => {
      if (!lessonMap.has(w.lesson)) {
        lessonMap.set(w.lesson, [])
      }
      lessonMap.get(w.lesson)!.push(w)
    })
    // Sort by lesson number
    const sortedLessons = Array.from(lessonMap.keys()).sort((a, b) => a - b)
    sortedLessons.forEach((lesson) => {
      groups.push({ lesson, words: lessonMap.get(lesson)! })
    })
    return groups
  }, [words])

  // When in starred mode, filter to only starred words grouped by lesson
  const starredGroups = useMemo(() => {
    return lessonGroups
      .map((g) => ({
        lesson: g.lesson,
        words: g.words.filter((w) => hardWords.includes(w.word)),
      }))
      .filter((g) => g.words.length > 0)
  }, [lessonGroups, hardWords])

  const activeGroups = showStarredOnly ? starredGroups : lessonGroups
  const totalPages = activeGroups.length

  // Reset page when switching modes or when starred list changes
  useEffect(() => {
    setCurrentPage(0)
  }, [showStarredOnly])

  // Clamp current page
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1)
    }
  }, [totalPages, currentPage])

  const currentGroup = activeGroups[currentPage] || null
  const currentWords = currentGroup?.words || []

  // Initialize all revealed by default when page changes
  useEffect(() => {
    const initial: Record<string, boolean> = {}
    currentWords.forEach((w) => {
      initial[w.word] = true
    })
    setRevealed(initial)
    setRevealedAll(true)
  }, [currentPage, showStarredOnly, currentWords.length])

  const handleToggleAll = () => {
    const next = !revealedAll
    setRevealedAll(next)
    const updated: Record<string, boolean> = {}
    currentWords.forEach((w) => {
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

  const goToPrev = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1)
  }

  const goToNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1)
  }

  const starredCount = hardWords.length

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <h2 className="text-lg font-semibold text-foreground">Word List</h2>
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

      {/* Starred Words Toggle */}
      <Button
        variant={showStarredOnly ? 'default' : 'outline'}
        size="sm"
        className={
          showStarredOnly
            ? 'w-full justify-center bg-[var(--accent-strong)] text-[var(--accent-strong-foreground)] hover:opacity-90'
            : 'w-full justify-center'
        }
        onClick={() => setShowStarredOnly((prev) => !prev)}
      >
        <Star
          className={showStarredOnly ? 'fill-current' : ''}
          data-icon="inline-start"
        />
        Starred Words ({starredCount})
      </Button>

      {/* Page navigation */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrev}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium text-foreground">
            Lesson {currentGroup?.lesson}{' '}
            <span className="text-muted-foreground">
              ({currentPage + 1} / {totalPages})
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {/* Word items */}
      {totalPages === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {showStarredOnly
            ? 'No starred words yet. Star words to see them here.'
            : 'No words to show.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {currentWords.map((word) => (
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
