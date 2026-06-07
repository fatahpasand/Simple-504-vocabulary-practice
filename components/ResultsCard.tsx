'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import StarButton from '@/components/StarButton'
import { getHardWords, toggleHardWord, type Word } from '@/lib/vocab'

interface ResultsCardProps {
  correct: number
  total: number
  wrongAnswers: Word[]
  onRestart: () => void
  onReturnToSettings: () => void
}

export default function ResultsCard({
  correct,
  total,
  wrongAnswers,
  onRestart,
  onReturnToSettings,
}: ResultsCardProps) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
  const [hardWords, setHardWordsState] = useState<string[]>([])

  useEffect(() => {
    setHardWordsState(getHardWords())
  }, [])

  const handleToggleHard = (word: string) => {
    setHardWordsState(toggleHardWord(word))
  }

  return (
    <Card className="space-y-6">
      <CardHeader className="text-center">
        <CardTitle>Practice Complete!</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score */}
        <div className="text-center space-y-2">
          <div className="text-6xl font-bold text-[var(--accent-strong)]">
            {percentage}%
          </div>
          <div className="text-lg text-muted-foreground">Correct</div>
        </div>

        <Separator />

        {/* Counts */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-emerald-600">
              {correct}
            </div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-red-600">
              {total - correct}
            </div>
            <div className="text-sm text-muted-foreground">Wrong</div>
          </div>
        </div>

        {wrongAnswers.length > 0 && (
          <>
            <Separator />

            {/* Wrong Answers */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Words to Review</h3>
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                {wrongAnswers.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 bg-muted p-3 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{word.word}</div>
                      <div className="text-sm text-muted-foreground">
                        {word.definition}
                      </div>
                    </div>
                    <StarButton
                      active={hardWords.includes(word.word)}
                      onToggle={() => handleToggleHard(word.word)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Buttons */}
        <div className="space-y-3">
          <Button onClick={onRestart} className="w-full" size="lg">
            Restart Practice
          </Button>
          <Button
            onClick={onReturnToSettings}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Return to Homepage
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
