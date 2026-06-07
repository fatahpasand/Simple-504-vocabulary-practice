'use client'

import { useState, useEffect, useMemo } from 'react'
import wordsData from '@/app/data/words.json'
import LessonRangeInputs from '@/components/LessonRangeInputs'
import WordCountSelector from '@/components/WordCountSelector'
import PracticeCard from '@/components/PracticeCard'
import MultipleChoiceCard from '@/components/MultipleChoiceCard'
import ResultsCard from '@/components/ResultsCard'
import WordList from '@/components/WordList'
import CasualGuide from '@/components/CasualGuide'
import AccentSelector from '@/components/AccentSelector'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BookOpen, PenLine, ListChecks } from 'lucide-react'
import {
  shuffleArray,
  getLastLessonRange,
  setLastLessonRange,
  getLastWordCount,
  setLastWordCount,
  type Word,
} from '@/lib/vocab'

type AppMode = 'home' | 'wordlist' | 'practice-words' | 'practice-mc' | 'results'

export default function Home() {
  const [mode, setMode] = useState<AppMode>('home')
  const [startLesson, setStartLesson] = useState('')
  const [endLesson, setEndLesson] = useState('')
  const [wordCount, setWordCount] = useState('')
  const [validationError, setValidationError] = useState('')
  const [sessionWords, setSessionWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState<Word[]>([])
  const [activePracticeMode, setActivePracticeMode] = useState<
    'practice-words' | 'practice-mc'
  >('practice-words')

  // Flatten nested lesson data into a single word array
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

  // Restore saved settings on mount
  useEffect(() => {
    const range = getLastLessonRange()
    setStartLesson(range.start)
    setEndLesson(range.end)
    setWordCount(getLastWordCount())
  }, [])

  const getAvailableWords = (): Word[] => {
    if (!startLesson || !endLesson) return []
    const start = parseInt(startLesson)
    const end = parseInt(endLesson)
    return words.filter((w) => w.lesson >= start && w.lesson <= end)
  }

  const availableCount = getAvailableWords().length

  const validateAndSelect = (): Word[] | null => {
    if (!startLesson || !endLesson) {
      setValidationError('Please enter both lesson numbers')
      return null
    }
    const start = parseInt(startLesson)
    const end = parseInt(endLesson)
    if (end < start) {
      setValidationError('End lesson must be greater than or equal to start lesson')
      return null
    }
    if (!wordCount) {
      setValidationError('Please select a word count')
      return null
    }
    const available = getAvailableWords()
    if (wordCount !== 'All' && parseInt(wordCount) > available.length) {
      setValidationError(`Only ${available.length} words available in this range`)
      return null
    }
    setValidationError('')

    // Even distribution across sessions via frequency tracking
    const storedFreq = localStorage.getItem('wordFrequency')
    const wordFreq: Record<string, number> = storedFreq ? JSON.parse(storedFreq) : {}
    const sortedByFrequency = [...available].sort(
      (a, b) => (wordFreq[a.word] || 0) - (wordFreq[b.word] || 0),
    )
    let selected = sortedByFrequency
    if (wordCount !== 'All') {
      selected = selected.slice(0, parseInt(wordCount))
    }
    return shuffleArray(selected)
  }

  const persistSettings = () => {
    setLastLessonRange(startLesson, endLesson)
    setLastWordCount(wordCount)
  }

  const startSession = (target: 'practice-words' | 'practice-mc') => {
    const selected = validateAndSelect()
    if (!selected) return
    persistSettings()
    setSessionWords(selected)
    setCurrentIndex(0)
    setCorrectCount(0)
    setWrongAnswers([])
    setActivePracticeMode(target)
    setMode(target)
  }

  const recordFrequency = (word: Word) => {
    const storedFreq = localStorage.getItem('wordFrequency')
    const wordFreq: Record<string, number> = storedFreq ? JSON.parse(storedFreq) : {}
    wordFreq[word.word] = (wordFreq[word.word] || 0) + 1
    localStorage.setItem('wordFrequency', JSON.stringify(wordFreq))
  }

  const handleAnswer = (correct: boolean) => {
    const current = sessionWords[currentIndex]
    recordFrequency(current)
    if (correct) {
      setCorrectCount((c) => c + 1)
    } else {
      setWrongAnswers((prev) => [...prev, current])
    }
    if (currentIndex + 1 < sessionWords.length) {
      setCurrentIndex((i) => i + 1)
    } else {
      setMode('results')
    }
  }

  const goHome = () => {
    setMode('home')
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Vocabulary Practice
          </h1>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <AccentSelector />
            <ThemeToggle />
          </div>
        </div>

        {mode === 'home' && (
          <div className="flex flex-col gap-6">
            <Card className="p-6 flex flex-col gap-6">
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

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => startSession('practice-words')}
                  size="lg"
                  className="w-full justify-start h-auto py-3 text-left bg-[var(--accent-strong)] text-[var(--accent-strong-foreground)] hover:opacity-90 whitespace-normal"
                >
                  <PenLine className="shrink-0 mr-2" />
                  <span>Practice: Definitions → Words</span>
                </Button>
                <Button
                  onClick={() => startSession('practice-mc')}
                  size="lg"
                  className="w-full justify-start h-auto py-3 text-left bg-[var(--accent-strong)] text-[var(--accent-strong-foreground)] hover:opacity-90 whitespace-normal"
                >
                  <ListChecks className="shrink-0 mr-2" />
                  <span>Practice: Words → Definitions</span>
                </Button>
              </div>
            </Card>

            <Button
              onClick={() => setMode('wordlist')}
              variant="outline"
              size="lg"
              className="w-full justify-start"
            >
              <BookOpen data-icon="inline-start" />
              Word List
            </Button>

            <CasualGuide />
          </div>
        )}

        {mode === 'wordlist' && (
          <WordList
            words={words}
            onBack={goHome}
          />
        )}

        {mode === 'practice-words' && sessionWords.length > 0 && (
          <PracticeCard
            word={sessionWords[currentIndex]}
            totalWords={sessionWords.length}
            currentIndex={currentIndex}
            onNext={(correct) => handleAnswer(correct)}
            onQuit={goHome}
          />
        )}

        {mode === 'practice-mc' && sessionWords.length > 0 && (
          <MultipleChoiceCard
            word={sessionWords[currentIndex]}
            totalWords={sessionWords.length}
            currentIndex={currentIndex}
            distractorPool={words}
            onNext={(correct) => handleAnswer(correct)}
            onQuit={goHome}
          />
        )}

        {mode === 'results' && (
          <ResultsCard
            correct={correctCount}
            total={sessionWords.length}
            wrongAnswers={wrongAnswers}
            onRestart={() => {
              const reshuffled = shuffleArray(sessionWords)
              setSessionWords(reshuffled)
              setCurrentIndex(0)
              setCorrectCount(0)
              setWrongAnswers([])
              setMode(activePracticeMode)
            }}
            onReturnToSettings={goHome}
          />
        )}
      </div>
    </div>
  )
}
