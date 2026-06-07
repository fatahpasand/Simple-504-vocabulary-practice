'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Word {
  word: string
  definition: string
  lesson: number
}

interface PracticeCardProps {
  word: Word
  totalWords: number
  currentIndex: number
  onNext: (correct: boolean, userInput: string) => void
}

type AnswerState = 'pending' | 'correct' | 'incorrect'

export default function PracticeCard({
  word,
  totalWords,
  currentIndex,
  onNext,
}: PracticeCardProps) {
  const [userInput, setUserInput] = useState('')
  const [answerState, setAnswerState] = useState<AnswerState>('pending')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUserInput('')
    setAnswerState('pending')
    inputRef.current?.focus()
  }, [word])

  const handleButtonClick = () => {
    if (answerState === 'pending') {
      if (!userInput.trim()) return
      const correct = userInput.toLowerCase().trim() === word.word.toLowerCase()
      setAnswerState(correct ? 'correct' : 'incorrect')
    } else {
      onNext(answerState === 'correct', userInput)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleButtonClick()
    }
  }

  const isLastWord = currentIndex + 1 === totalWords

  return (
    <Card className="p-8 space-y-6">
      <div className="text-sm text-muted-foreground text-center">
        Word {currentIndex + 1} of {totalWords}
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <p className="text-lg text-foreground text-center leading-relaxed">{word.definition}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          What is the word?
        </label>
        <Input
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type the word..."
          disabled={answerState !== 'pending'}
          className="text-center text-lg"
        />
      </div>

      <Button
        onClick={handleButtonClick}
        disabled={answerState === 'pending' && !userInput.trim()}
        className="w-full bg-[var(--accent-strong)] text-[var(--accent-strong-foreground)] hover:opacity-90"
        size="lg"
      >
        {answerState === 'pending'
          ? 'Next'
          : isLastWord
          ? 'See Results'
          : 'Next'}
      </Button>

      {answerState !== 'pending' && (
        <div
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4 text-sm',
            answerState === 'correct'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
          )}
        >
          {answerState === 'correct' ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
          )}
          <span>
            {answerState === 'correct' ? (
              <>Correct! The word is <strong>{word.word}</strong>.</>
            ) : (
              <>Incorrect. The correct word is <strong>{word.word}</strong>.</>
            )}
          </span>
        </div>
      )}
    </Card>
  )
}
