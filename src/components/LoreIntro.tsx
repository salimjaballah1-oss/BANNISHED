import { useState } from 'react'
import { introLore } from '../content/lore'

// Durée d'affichage d'une ligne : une base + un peu plus pour les phrases longues (en secondes)
function lineDuration(line: string) {
  return 2.4 + line.length * 0.035
}

// Met le mot « Banni » (ou « Bannis ») en rouge barré
function renderLine(line: string) {
  return line.split(/(Bannis?)/).map((part, i) =>
    /^Bannis?$/.test(part) ? (
      <span key={i} className="banni">
        {part}
      </span>
    ) : (
      part
    ),
  )
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
          // on ignore la fin de l'animation de la barre rouge, seule celle de la phrase compte
          onAnimationEnd={(e) => e.animationName === 'line' && next()}
        >
          {renderLine(line)}
        </p>
      </div>

      <button onClick={onDone} className="self-center text-sm text-white/40">
        Passer
      </button>
    </div>
  )
}
