import { Card } from '@/components/ui/card'

export default function CasualGuide() {
  return (
    <Card className="p-6 bg-muted/40">
      <h2 className="text-base font-semibold text-foreground">How to use this app</h2>
      <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
        <p>
          Warm up in <span className="font-medium text-foreground">Learn Mode</span>, then
          test yourself with a practice round.
        </p>
        <p>
          Mark hard words with a{' '}
          <span className="font-medium text-foreground">star</span> so you can focus on them
          later from the Hard Words list.
        </p>
        <p>No pressure — you&apos;ll get a little better every round.</p>
      </div>
    </Card>
  )
}
