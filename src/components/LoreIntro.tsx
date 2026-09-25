import { useState } from 'react'
import { introLore } from '../content/lore'

// Durée d'affichage d'une ligne : une base + un peu plus pour les phrases longues (en secondes)
function lineDuration(line: string) {
  return 2.4 + line.length * 0.035
}

type Props = { onDone: () => void }

export function LoreIntro({ onDone }: Props) {
  const [index, setIndex] = useState(0)
  const line = introLore[index]

  function next() {
    if (index + 1 < introLore.length) setIndex(index + 1)
    else onDone()
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-night px-8 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <div className="flex flex-1 items-center justify-center">
        <p
          key={index}
          className="animate-line max-w-md text-center text-2xl leading-relaxed text-[#cfcbe0]"
          style={{ animationDuration: `${lineDuration(line)}s` }}
          onAnimationEnd={next}
        >
          {line}
        </p>
      </div>

      <button onClick={onDone} className="self-center text-sm text-white/40">
        Passer
      </button>
    </div>
  )
}
