import { useState } from 'react'
import { introLore } from '../content/lore'

// Durée d'affichage d'une ligne : une base + un peu plus pour les phrases longues (en secondes)
function lineDuration(line: string) {
  return 2.4 + line.length * 0.035
}

const BANNI = /(Bannis?)/

// Ligne où « Banni » apparaît pour la première fois : seule celle-ci a l'animation de la barre
const firstBanniLine = introLore.findIndex((line) => BANNI.test(line))

// Met le mot « Banni » (ou « Bannis ») en rouge barré
function renderLine(line: string, lineIndex: number) {
  let animate = lineIndex === firstBanniLine
  return line.split(BANNI).map((part, i) => {
    if (!BANNI.test(part)) return part
    const className = animate ? 'banni banni-animate' : 'banni'
    animate = false
    return (
      <span key={i} className={className}>
        {part}
      </span>
    )
  })
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
          {renderLine(line, index)}
        </p>
      </div>

      <button onClick={onDone} className="self-center text-sm text-white/40">
        Passer
      </button>
    </div>
  )
}
