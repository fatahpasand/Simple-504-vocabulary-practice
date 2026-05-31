'use client'

import { useState, useEffect, useMemo } from 'react'
import wordsData from '@/app/data/words.json'
import LessonRangeInputs from '@/components/LessonRangeInputs'
import WordCountSelector from '@/components/WordCountSelector'
import PracticeCard from '@/components/PracticeCard'
import ResultsCard from '@/components/ResultsCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'

interface Word {
  word: string
  definition: string
  lesson: number
}

type AppMode = 'config' | 'practice' | 'results'

export default function Home() {
  const [mode, setMode] = useState<AppMode>('config')
  const [startLesson, setStartLesson] = useState<string>('')
  const [endLesson, setEndLesson] = useState<string>('')
  const [wordCount, setWordCount] = useState<string>('')
  const [validationError, setValidationError] = useState<string>('')
  const [filteredWords, setFilteredWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ correct: boolean; word: string }[]>([])
  const [wrongAnswers, setWrongAnswers] = useState<Word[]>([])

  // Transform the nested words data into flat array
  const words = useMemo(() => {
    const flattened: Word[] = []
    wordsData.forEach((lesson: any) => {
      lesson.words.forEach((w: any) => {
        flattened.push({
          word: w.word,
          definition: w.meaning,
          lesson: lesson.lesson,
        })
      })
    })
    return flattened
  }, [])

  // Fisher-Yates shuffle algorithm - unbiased and reliable
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const getAvailableWords = (): Word[] => {
    if (!startLesson || !endLesson) return []
    const start = parseInt(startLesson)
    const end = parseInt(endLesson)
    return words.filter(
      (w: Word) => w.lesson >= start && w.lesson <= end
    )
  }

  const handleStartPractice = () => {
    if (!startLesson || !endLesson) {
      setValidationError('Please enter both lesson numbers')
      return
    }

    const start = parseInt(startLesson)
    const end = parseInt(endLesson)

    if (end < start) {
      setValidationError('End lesson must be greater than or equal to start lesson')
      return
    }

    if (!wordCount) {
      setValidationError('Please select a word count')
      return
    }

    const available = getAvailableWords()

    if (wordCount !== 'All' && parseInt(wordCount) > available.length) {
      setValidationError(
        `Only ${available.length} words available in this range`
      )
      return
    }

    setValidationError('')

    // Track word frequency in localStorage to deprioritize recently seen words
    const storedFreq = localStorage.getItem('wordFrequency')
    const wordFreq: Record<string, number> = storedFreq ? JSON.parse(storedFreq) : {}

    // Sort available words by frequency (ascending), so less-used words come first
    const sortedByFrequency = [...available].sort((a, b) => {
      const freqA = wordFreq[a.word] || 0
      const freqB = wordFreq[b.word] || 0
      return freqA - freqB
    })

    // Select words from the frequency-sorted list
    let selectedWords = sortedByFrequency
    if (wordCount !== 'All') {
      selectedWords = selectedWords.slice(0, parseInt(wordCount))
    }

    // Shuffle using Fisher-Yates for unbiased randomization
    selectedWords = shuffleArray(selectedWords)

    setFilteredWords(selectedWords)
    setCurrentIndex(0)
    setUserAnswers([])
    setWrongAnswers([])
    setMode('practice')
  }

  const handleReturnToSettings = () => {
    setMode('config')
    setStartLesson('')
    setEndLesson('')
    setWordCount('')
    setValidationError('')
  }

  const availableCount = getAvailableWords().length

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Vocabulary Practice
          </h1>
          <ThemeToggle />
        </div>

        {mode === 'config' && (
          <Card className="p-8 space-y-6">
            <LessonRangeInputs
              startLesson={startLesson}
              endLesson={endLesson}
              onStartChange={setStartLesson}
              onEndChange={setEndLesson}
            />

            {(startLesson || endLesson) && (
              <div className="text-sm text-muted-foreground">
                Available words: {availableCount}
              </div>
            )}

            <WordCountSelector
              wordCount={wordCount}
              onWordCountChange={setWordCount}
              maxAvailable={availableCount}
            />

            {validationError && (
              <div className="text-sm text-destructive">{validationError}</div>
            )}

            <Button
              onClick={handleStartPractice}
              size="lg"
              className="w-full"
            >
              Start Practice
            </Button>
          </Card>
        )}

        {mode === 'practice' && (
          <PracticeCard
            word={filteredWords[currentIndex]}
            totalWords={filteredWords.length}
            currentIndex={currentIndex}
            onNext={(correct: boolean, userInput: string) => {
              const newAnswers = [
                ...userAnswers,
                { correct, word: userInput }
              ]
              setUserAnswers(newAnswers)

              // Track word usage
              const storedFreq = localStorage.getItem('wordFrequency')
              const wordFreq: Record<string, number> = storedFreq ? JSON.parse(storedFreq) : {}
              const currentWord = filteredWords[currentIndex]
              wordFreq[currentWord.word] = (wordFreq[currentWord.word] || 0) + 1
              localStorage.setItem('wordFrequency', JSON.stringify(wordFreq))

              if (!correct) {
                setWrongAnswers([
                  ...wrongAnswers,
                  filteredWords[currentIndex]
                ])
              }

              if (currentIndex + 1 < filteredWords.length) {
                setCurrentIndex(currentIndex + 1)
              } else {
                setMode('results')
              }
            }}
          />
        )}

        {mode === 'results' && (
          <ResultsCard
            correct={userAnswers.filter(a => a.correct).length}
            total={userAnswers.length}
            wrongAnswers={wrongAnswers}
            onRestart={() => handleStartPractice()}
            onReturnToSettings={handleReturnToSettings}
          />
        )}
      </div>
    </div>
  )
}
