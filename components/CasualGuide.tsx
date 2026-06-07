import { Card } from '@/components/ui/card'

export default function CasualGuide() {
  return (
    <Card className="p-6 bg-muted/40">
      <h2 className="text-base font-semibold text-foreground">
        How does this work? 🤔
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">1. Pick your lessons.</span>{' '}
          Type which lessons you want to study — like lesson 1 to 5. You&apos;ll see
          how many words are in that range.
        </p>
        <p>
          <span className="font-medium text-foreground">2. Choose how many words.</span>{' '}
          Want to do just 10? Or all of them? Pick whatever feels right. The app
          remembers your choice for next time.
        </p>
        <p>
          <span className="font-medium text-foreground">3. Practice!</span>{' '}
          Hit one of the practice buttons to start. In{' '}
          <span className="font-medium text-foreground">Definitions → Words</span>, you
          read a meaning and type the word. In{' '}
          <span className="font-medium text-foreground">Words → Definitions</span>, you
          see the word and pick the right meaning from four choices. If you need to stop
          early, just tap the <span className="font-medium text-foreground">X</span> in
          the top corner to quit.
        </p>
        <p>
          <span className="font-medium text-foreground">4. Browse the Word List.</span>{' '}
          Tap the <span className="font-medium text-foreground">Word List</span> button
          to flip through every lesson page by page. Tap any word to show or hide
          its meaning, or use the <span className="font-medium text-foreground">Reveal All / Hide All</span> button
          at the top to check them all at once!
        </p>
        <p>
          <span className="font-medium text-foreground">5. Star your tricky words.</span>{' '}
          See a word you keep forgetting? Tap the ⭐ next to it. Then use the{' '}
          <span className="font-medium text-foreground">Starred Words</span>{' '} button
          inside the Word List to see only those words. Tap the star again to un-star it
          whenever you&apos;re ready.
        </p>
        <p>
          <span className="font-medium text-foreground">6. Pick a color!</span>{' '}
          Use the dropdown at the top to change the whole app&apos;s color. There&apos;s
          also a sun/moon button to switch between light and dark mode.
        </p>
        <p>
          <span className="font-medium text-foreground">7. Install & Play Offline.</span>{' '}
          This app works completely offline! You can install it on your phone or computer by tapping
          &quot;Add to Home Screen&quot; in your browser menu. Practice anywhere, anytime.
        </p>
        <p className="pt-1 text-xs opacity-75">
          That&apos;s it — no sign-ups, no accounts. Everything is saved right
          here in your browser. You&apos;ll get a little better every round. 💪
        </p>
      </div>
    </Card>
  )
}
