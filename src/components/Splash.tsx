import { useState } from 'react'

// Logo affiché au démarrage (public/the office logo.png)
const LOGO_SRC = '/the office logo.png'

type Props = {
  onDone: () => void
}

// Écran de démarrage : la tasse fume, le logo apparaît, puis tout s'efface
export function Splash({ onDone }: Props) {
  // tant que le logo n'est pas dans public/, on affiche le titre en texte
  const [logoMissing, setLogoMissing] = useState(false)

  return (
    <div
      className="splash fixed inset-0 flex flex-col items-center justify-center gap-10 bg-paper px-8"
      onAnimationEnd={(e) => e.animationName === 'splash-out' && onDone()}
    >
      <div className="splash-logo w-full max-w-xs">
        {logoMissing ? (
          <h1 className="mx-auto w-fit bg-ink px-4 py-2 font-type text-4xl font-bold tracking-tight text-paper">
            the office
          </h1>
        ) : (
          <img src={LOGO_SRC} alt="The Office" className="block w-full" onError={() => setLogoMissing(true)} />
        )}
      </div>

      <Mug />
    </div>
  )
}

// La tasse « World's Best Boss » de Michael (public/wbb.webp, recadrée au ras de la tasse pour qu'elle soit bien centrée), avec sa vapeur
function Mug() {
  return (
    // -translate-x-[16%] : le corps de la tasse (et pas l'anse) se retrouve pile au centre
    <div className="splash-mug relative w-44 -translate-x-[16%] pt-12">
      {/* vapeur, au-dessus de l'ouverture (l'anse est à gauche, l'ouverture est donc décalée à droite) */}
      <svg
        viewBox="0 0 100 32"
        className="absolute top-0 left-0 w-full overflow-visible text-ink/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden
      >
        <path className="steam" d="M 55 32 q -5 -8 0 -16 t 0 -16" />
        <path className="steam steam-2" d="M 66 32 q -5 -8 0 -16 t 0 -16" />
        <path className="steam steam-3" d="M 77 32 q -5 -8 0 -16 t 0 -16" />
      </svg>
      <img src="/wbb.webp" alt="Tasse World's Best Boss" className="relative block w-full" />
    </div>
  )
}
