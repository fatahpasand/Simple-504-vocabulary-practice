import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

interface LessonRangeInputsProps {
  startLesson: string
  endLesson: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
}

export default function LessonRangeInputs({
  startLesson,
  endLesson,
  onStartChange,
  onEndChange,
}: LessonRangeInputsProps) {
  return (
    <FieldGroup>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="start">Start Lesson</FieldLabel>
          <Input
            id="start"
            type="number"
            placeholder="1"
            value={startLesson}
            onChange={(e) => onStartChange(e.target.value)}
            min="1"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="end">End Lesson</FieldLabel>
          <Input
            id="end"
            type="number"
            placeholder="10"
            value={endLesson}
            onChange={(e) => onEndChange(e.target.value)}
            min="1"
          />
        </Field>
      </div>
    </FieldGroup>
  )
}
