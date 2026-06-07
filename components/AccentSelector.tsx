'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ACCENT_THEMES,
  getAccentTheme,
  setAccentTheme,
  type AccentTheme,
} from '@/lib/vocab'

export default function AccentSelector() {
  const [accent, setAccent] = useState<AccentTheme>('bw')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setAccent(getAccentTheme())
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-[150px]" />
  }

  const handleChange = (value: string) => {
    const theme = value as AccentTheme
    setAccent(theme)
    setAccentTheme(theme)
  }

  return (
    <Select value={accent} onValueChange={handleChange}>
      <SelectTrigger className="w-[150px]" aria-label="Accent color">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {ACCENT_THEMES.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              <span className="flex items-center gap-2">
                <span
                  className="inline-block size-3 rounded-full border border-border"
                  style={{ backgroundColor: theme.swatch }}
                />
                {theme.label}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
