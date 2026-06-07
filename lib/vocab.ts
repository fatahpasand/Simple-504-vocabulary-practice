export interface Word {
  word: string
  definition: string
  lesson: number
}

const HARD_WORDS_KEY = 'hardWords'
const ACCENT_KEY = 'accentTheme'
const LESSON_RANGE_KEY = 'lastLessonRange'
const WORD_COUNT_KEY = 'lastWordCount'

export type AccentTheme = 'bw' | 'blue' | 'purple' | 'teal' | 'amber' | 'rose'

export const ACCENT_THEMES: { value: AccentTheme; label: string; swatch: string }[] = [
  { value: 'bw', label: 'Black & White', swatch: 'oklch(0.205 0 0)' },
  { value: 'blue', label: 'Blue', swatch: 'oklch(0.58 0.18 256)' },
  { value: 'purple', label: 'Purple', swatch: 'oklch(0.56 0.2 295)' },
  { value: 'teal', label: 'Teal', swatch: 'oklch(0.6 0.12 195)' },
  { value: 'amber', label: 'Amber', swatch: 'oklch(0.72 0.16 70)' },
  { value: 'rose', label: 'Rose', swatch: 'oklch(0.58 0.18 350)' },
]

function isBrowser() {
  return typeof window !== 'undefined'
}

/* Hard words */
export function getHardWords(): string[] {
  if (!isBrowser()) return []
  try {
    const stored = localStorage.getItem(HARD_WORDS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function setHardWords(words: string[]) {
  if (!isBrowser()) return
  localStorage.setItem(HARD_WORDS_KEY, JSON.stringify(words))
}

export function toggleHardWord(word: string): string[] {
  const current = getHardWords()
  const next = current.includes(word)
    ? current.filter((w) => w !== word)
    : [...current, word]
  setHardWords(next)
  return next
}

/* Accent theme */
export function getAccentTheme(): AccentTheme {
  if (!isBrowser()) return 'bw'
  const stored = localStorage.getItem(ACCENT_KEY) as AccentTheme | null
  return stored && ACCENT_THEMES.some((t) => t.value === stored) ? stored : 'bw'
}

export function setAccentTheme(theme: AccentTheme) {
  if (!isBrowser()) return
  localStorage.setItem(ACCENT_KEY, theme)
  document.documentElement.setAttribute('data-accent', theme)
}

/* Lesson range + word count */
export function getLastLessonRange(): { start: string; end: string } {
  if (!isBrowser()) return { start: '', end: '' }
  try {
    const stored = localStorage.getItem(LESSON_RANGE_KEY)
    return stored ? JSON.parse(stored) : { start: '', end: '' }
  } catch {
    return { start: '', end: '' }
  }
}

export function setLastLessonRange(start: string, end: string) {
  if (!isBrowser()) return
  localStorage.setItem(LESSON_RANGE_KEY, JSON.stringify({ start, end }))
}

export function getLastWordCount(): string {
  if (!isBrowser()) return ''
  return localStorage.getItem(WORD_COUNT_KEY) || ''
}

export function setLastWordCount(count: string) {
  if (!isBrowser()) return
  localStorage.setItem(WORD_COUNT_KEY, count)
}

/* Fisher-Yates shuffle */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
