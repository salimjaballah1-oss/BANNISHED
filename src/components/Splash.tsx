import { useEffect, useRef, useState } from 'react'

// Repères dans le dessin (mêmes unités que l'image du logo, 1200 × 446)
const TIP_X = 584 // pointe de l'épée
const TIP_Y = 429
const BAR_Y = 540 // hauteur de la barre de sang
const BAR_HALF = 400 // demi-longueur de la barre une fois pleine

// Temps (en secondes)
const DROP_START = 0.9 // la goutte commence à se former
const BAR_START = 1.75 // la goutte touche le sol, la barre commence
const MIN_FILL = 1.6 // durée minimale de remplissage, même si tout est déjà chargé

// Gouttes qui pendent sous la barre : position (-1 = bord gauche, 1 = bord droit), délai
const DRIPS = [
  { at: -0.78, delay: 0.2 },
  { at: -0.45, delay: 0.9 },
  { at: -0.12, delay: 0.4 },
  { at: 0.24, delay: 1.2 },
  { at: 0.55, delay: 0.6 },
  { at: 0.86, delay: 1.5 },
]

type Props = {
  onDone: () => void
  // Plus tard : false tant que les données de l'appli chargent. La barre attend alors à 90 %.
  ready?: boolean
}

// Écran de démarrage : le logo émerge, une goutte de sang tombe de l'épée et remplit la barre
export function Splash({ onDone, ready = true }: Props) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const readyRef = useRef(ready)
  useEffect(() => {
    readyRef.current = ready
  }, [ready])

  useEffect(() => {
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = (now - start) / 1000 - BAR_START
      const timeShare = Math.min(1, Math.max(0, t / MIN_FILL))
      const p = readyRef.current ? timeShare : Math.min(timeShare, 0.9)
      setProgress(p)
      if (p < 1) frame = requestAnimationFrame(tick)
      else setTimeout(() => setLeaving(true), 400)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // la barre ralentit en arrivant au bout, comme un liquide qui s'étale
  const half = BAR_HALF * (1 - Math.pow(1 - progress, 2))

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-night ${leaving ? 'splash-leave' : ''}`}
      onAnimationEnd={(e) => e.animationName === 'splash-out' && onDone()}
    >
      <div className="splash-logo relative w-[82%] max-w-md">
        <img src="/logo-light.webp" alt="Bannished" className="block w-full" />

        <svg viewBox="0 0 1200 640" className="absolute top-0 left-0 w-full overflow-visible">
          <defs>
            {/* fait fusionner les formes entre elles comme un liquide */}
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
              <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
            </filter>
          </defs>

          <g filter="url(#goo)" fill="#8e0b0b">
            {/* la goutte qui se forme à la pointe puis tombe */}
            <g style={{ transform: `translate(${TIP_X}px, ${TIP_Y}px)` }}>
              <circle
                cy="20"
                r="24"
                className="blood-drop"
                style={{
                  animationDelay: `${DROP_START}s`,
                  ['--fall' as string]: `${BAR_Y - TIP_Y}px`,
                }}
              />
            </g>

            {/* la barre de chargement */}
            <rect x={TIP_X - half} y={BAR_Y - 12} width={half * 2} height="24" rx="12" />

            {/* les gouttes qui pendent sous la barre, dès que le sang est arrivé jusqu'à elles */}
            {DRIPS.map((d) =>
              Math.abs(d.at) * BAR_HALF < half - 20 ? (
                <ellipse
                  key={d.at}
                  cx={TIP_X + d.at * BAR_HALF}
                  cy={BAR_Y + 6}
                  rx="15"
                  ry="18"
                  className="blood-drip"
                  style={{ animationDelay: `${d.delay}s` }}
                />
              ) : null,
            )}
          </g>
        </svg>
      </div>
    </div>
  )
}
