import { introLore } from '../content/lore'

// Délai entre deux lignes, en secondes
const LINE_DELAY = 1.6

type Props = { onDone: () => void }

export function LoreIntro({ onDone }: Props) {
  const enterDelay = introLore.length * LINE_DELAY + 0.4

  return (
    <div className="fixed inset-0 flex flex-col bg-night px-8 pt-[calc(env(safe-area-inset-top)+2rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <div className="flex flex-1 flex-col justify-center gap-5">
        {introLore.map((line, i) => (
          <p
            key={i}
            className="animate-line text-lg leading-relaxed text-center text-[#cfcbe0]"
            style={{ animationDelay: `${i * LINE_DELAY}s` }}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onDone}
          className="animate-line rounded-full border border-white/20 px-8 py-3 text-sm tracking-[0.2em] uppercase"
          style={{ animationDelay: `${enterDelay}s` }}
        >
          Entrer
        </button>
        <button onClick={onDone} className="text-xs text-white/40 underline-offset-4">
          Passer
        </button>
      </div>
    </div>
  )
}
