'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

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

  const handleConfirm = () => {
    if (!userInput.trim()) return

    const correct = userInput.toLowerCase().trim() === word.word.toLowerCase()
    setAnswerState(correct ? 'correct' : 'incorrect')
  }

  const handleNext = () => {
    const correct = answerState === 'correct'
    onNext(correct, userInput)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (answerState === 'pending' && e.key === 'Enter') {
      handleConfirm()
    } else if (answerState !== 'pending' && e.key === 'Enter') {
      handleNext()
    }
  }

  return (
    <Card className="p-8 space-y-6">
      <div className="text-sm text-muted-foreground text-center">
        Word {currentIndex + 1} of {totalWords}
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <p className="text-lg text-foreground text-center">{word.definition}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          What is the word?
        </label>
        <Input
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type the word..."
          disabled={answerState !== 'pending'}
          className="text-center text-lg"
        />
      </div>

      {answerState === 'pending' && (
        <Button
          onClick={handleConfirm}
          disabled={!userInput.trim()}
          className="w-full"
        >
          Confirm
        </Button>
      )}

      {answerState === 'correct' && (
        <>
          <Alert className="bg-emerald-50 border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              Correct! The word is <strong>{word.word}</strong>.
            </AlertDescription>
          </Alert>
          <Button onClick={handleNext} className="w-full">
            Next Word
          </Button>
        </>
      )}

      {answerState === 'incorrect' && (
        <>
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Incorrect. The correct word is <strong>{word.word}</strong>.
            </AlertDescription>
          </Alert>
          <Button onClick={handleNext} className="w-full">
            Next Word
          </Button>
        </>
      )}
    </Card>
  )
}
