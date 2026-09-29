import { useRef, useState } from 'react'

type Gain = { id: number; amount: number; x: number }

// Le clicker : la tasse World's Best Boss. On appuie, elle s'enfonce et le gain s'envole.
export function Clicker({ perClick, onClick }: { perClick: number; onClick: () => void }) {
  const [gains, setGains] = useState<Gain[]>([])
  const [pressKey, setPressKey] = useState(0)
  const nextId = useRef(0)

  function press() {
    onClick()
    setPressKey((k) => k + 1)
    // léger décalage aléatoire pour que les gains ne s'empilent pas exactement
    const gain = { id: nextId.current++, amount: perClick, x: Math.random() * 60 - 30 }
    setGains((g) => [...g.slice(-8), gain])
  }

  return (
    <button
      type="button"
      onPointerDown={press}
      onKeyDown={(e) => !e.repeat && (e.key === 'Enter' || e.key === ' ') && press()}
      className="relative mx-auto block w-44 cursor-pointer touch-manipulation select-none"
      aria-label={`Boire une gorgée de café, +${perClick} Schrute Bucks`}
    >
      {/* key : relance l'animation à chaque appui */}
      <span key={pressKey} className={`block ${pressKey ? 'clicker-press' : ''}`}>
        {/* -translate-x-[16%] : le corps de la tasse (et pas l'anse) est au centre, comme sur le splash */}
        <img src="/wbb.webp" alt="" draggable={false} className="block w-full -translate-x-[16%]" />
      </span>
      {gains.map((g) => (
        <span
          key={g.id}
          className="clicker-gain pointer-events-none absolute top-1/4 left-1/2 font-type text-2xl font-bold text-note"
          style={{ marginLeft: g.x }}
          onAnimationEnd={() => setGains((all) => all.filter((a) => a.id !== g.id))}
        >
          +{g.amount}
        </span>
      ))}
    </button>
  )
}
