'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { shuffleArray, type Word } from '@/lib/vocab'

interface MultipleChoiceCardProps {
  word: Word
  totalWords: number
  currentIndex: number
  distractorPool: Word[]
  onNext: (correct: boolean) => void
  onQuit: () => void
}

export default function MultipleChoiceCard({
  word,
  totalWords,
  currentIndex,
  distractorPool,
  onNext,
  onQuit,
}: MultipleChoiceCardProps) {
  const [selected, setSelected] = useState<string | null>(null)

  // Build 4 options: 1 correct + 3 random distractors
  const options = useMemo(() => {
    const distractors = shuffleArray(
      distractorPool.filter((w) => w.definition !== word.definition),
    )
      .slice(0, 3)
      .map((w) => w.definition)
    return shuffleArray([word.definition, ...distractors])
  }, [word, distractorPool])

  useEffect(() => {
    setSelected(null)
  }, [word])

  const answered = selected !== null
  const isLastWord = currentIndex + 1 === totalWords

  const handleSelect = (option: string) => {
    if (answered) return
    setSelected(option)
  }

  const handleNext = () => {
    onNext(selected === word.definition)
  }

  return (
    <Card className="p-8 space-y-6 relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onQuit}
        className="absolute right-2 top-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        title="Quit Practice"
      >
        <span className="sr-only">Quit</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </Button>

      <div className="text-sm text-muted-foreground text-center">
        Word {currentIndex + 1} of {totalWords}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">What does this word mean?</p>
        <p className="mt-2 text-3xl font-bold text-foreground">{word.word}</p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isCorrect = option === word.definition
          const isSelected = option === selected
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={cn(
                'rounded-lg border p-4 text-left text-sm leading-relaxed transition-colors',
                !answered &&
                  'border-border hover:border-[var(--accent-strong)] hover:bg-muted',
                answered &&
                  isCorrect &&
                  'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100',
                answered &&
                  isSelected &&
                  !isCorrect &&
                  'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
                answered && !isCorrect && !isSelected && 'border-border opacity-60',
              )}
            >
              <span className="flex items-start gap-2">
                {answered && isCorrect && (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                )}
                {answered && isSelected && !isCorrect && (
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
                )}
                <span>{option}</span>
              </span>
            </button>
          )
        })}
      </div>

      <Button
        onClick={handleNext}
        disabled={!answered}
        className="w-full"
        size="lg"
      >
        {isLastWord ? 'See Results' : 'Next'}
      </Button>
    </Card>
  )
}
