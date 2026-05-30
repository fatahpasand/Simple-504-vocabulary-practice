import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

interface WordCountSelectorProps {
  wordCount: string
  onWordCountChange: (value: string) => void
  maxAvailable: number
}

export default function WordCountSelector({
  wordCount,
  onWordCountChange,
  maxAvailable,
}: WordCountSelectorProps) {
  const options = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '25', label: '25' },
    { value: '30', label: '30' },
    { value: 'All', label: 'All' },
  ]

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="count">Number of Words</FieldLabel>
        <Select value={wordCount} onValueChange={onWordCountChange}>
          <SelectTrigger id="count">
            <SelectValue placeholder="Select word count" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={
                  option.value !== 'All' &&
                  parseInt(option.value) > maxAvailable
                }
              >
                {option.label}
                {option.value !== 'All' &&
                  parseInt(option.value) > maxAvailable &&
                  ' (unavailable)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  )
}
