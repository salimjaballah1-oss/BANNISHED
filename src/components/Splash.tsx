import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

// Repères dans le dessin (mêmes unités que l'image du logo, 1200 × 446)
const TIP_X = 584 // pointe de l'épée
const TIP_Y = 429

// Temps (en secondes)
const FLOW_START = 1.4 // la goutte s'est formée, le sang commence à couler
const MIN_FLOW = 2.2 // durée minimale de la coulée, même si tout est déjà chargé

type Props = {
  onDone: () => void
  // Plus tard : false tant que les données de l'appli chargent. Le sang attend alors à 90 %.
  ready?: boolean
}

// Tracé du filet de sang : il descend en ondulant légèrement, jusqu'en bas de l'écran
function streamPath(length: number) {
  let d = `M ${TIP_X} ${TIP_Y}`
  for (let y = 10; y <= length; y += 10) {
    const x = TIP_X + 7 * Math.sin(y / 70) + 3 * Math.sin(y / 23)
    d += ` L ${x.toFixed(1)} ${TIP_Y + y}`
  }
  return d
}

// Écran de démarrage : le logo émerge, puis le sang coule de l'épée jusqu'en bas de l'écran
export function Splash({ onDone, ready = true }: Props) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  // longueur de la coulée, de la pointe de l'épée jusqu'au bas de l'écran (unités du dessin)
  const [length, setLength] = useState(1000)
  const logoRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const readyRef = useRef(ready)
  useEffect(() => {
    readyRef.current = ready
  }, [ready])

  useLayoutEffect(() => {
    const box = logoRef.current!.getBoundingClientRect()
    const unit = 1200 / box.width
    const tipOnScreen = box.top + (TIP_Y / 1200) * box.width
    setLength((window.innerHeight - tipOnScreen) * unit + 60)
  }, [])

  useEffect(() => {
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = (now - start) / 1000 - FLOW_START
      const timeShare = Math.min(1, Math.max(0, t / MIN_FLOW))
      const p = readyRef.current ? timeShare : Math.min(timeShare, 0.9)
      setProgress(p)
      if (p < 1) frame = requestAnimationFrame(tick)
      else setTimeout(() => setLeaving(true), 300)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const d = useMemo(() => streamPath(length), [length])
  // le sang démarre doucement, accélère, puis ralentit en arrivant en bas
  const flowed = progress * progress * (3 - 2 * progress)

  // position de la tête de la coulée, pour y dessiner une goutte plus épaisse
  const [head, setHead] = useState<DOMPoint | null>(null)
  useLayoutEffect(() => {
    const path = pathRef.current
    if (path && progress > 0) setHead(path.getPointAtLength(flowed * path.getTotalLength()))
  }, [flowed, progress])

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-hidden bg-night ${leaving ? 'splash-leave' : ''}`}
      onAnimationEnd={(e) => e.animationName === 'splash-out' && onDone()}
    >
      <div ref={logoRef} className="splash-logo relative w-[82%] max-w-md">
        <img src="/logo-light.webp" alt="Bannished" className="block w-full" />

        <svg viewBox="0 0 1200 446" className="absolute top-0 left-0 w-full overflow-visible">
          <defs>
            {/* fait fusionner les formes entre elles comme un liquide */}
            <filter
              id="goo"
              filterUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1200"
              height={TIP_Y + length + 100}
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
              <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
            </filter>
          </defs>

          <g filter="url(#goo)" fill="#8e0b0b">
            {/* la goutte qui se forme à la pointe avant de couler */}
            <circle cx={TIP_X} cy={TIP_Y + 14} r="20" className="blood-drop" />

            {/* le filet de sang, révélé petit à petit */}
            <path
              ref={pathRef}
              d={d}
              fill="none"
              stroke="#8e0b0b"
              strokeWidth="16"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - flowed}
            />

            {/* la tête de la coulée, un peu plus épaisse */}
            {head && progress > 0 && <circle cx={head.x} cy={head.y} r="17" />}
          </g>
        </svg>
      </div>
    </div>
  )
}
