import type { ReactNode } from 'react'
import { format } from '../lib/player'

// Une feuille posée sur le bureau, tenue par du scotch ou une punaise, éventuellement déchirée
export function Paper({
  children,
  className = '',
  hold = 'none',
  torn,
}: {
  children: ReactNode
  className?: string
  hold?: 'tape' | 'pin' | 'none'
  torn?: 'top' | 'bottom'
}) {
  // mb-10 : laisse la place au bord déchiré qui dépasse sous la feuille
  return (
    <div className={`paper relative ${hold === 'tape' ? 'tape' : ''} ${torn === 'bottom' ? 'mb-10' : ''} ${className}`}>
      {hold === 'pin' && <Pin />}
      {torn && <TornEdge side={torn} />}
      {children}
    </div>
  )
}

// Bord déchiré qui prolonge la feuille (public/torn-top.webp, public/torn-bottom.webp)
export function TornEdge({ side }: { side: 'top' | 'bottom' }) {
  return (
    <img
      src={side === 'top' ? '/torn-top.webp' : '/torn-bottom.webp'}
      alt=""
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 h-5 w-full ${side === 'top' ? 'bottom-full -mb-px' : 'top-full -mt-px'}`}
    />
  )
}

function Pin() {
  return (
    <svg viewBox="0 0 16 16" className="absolute -top-1.5 left-1/2 w-3.5 -translate-x-1/2" aria-hidden>
      <circle cx="8" cy="8" r="6.5" fill="#6d6a64" stroke="#2d2a26" strokeWidth="1" />
      <circle cx="6" cy="6" r="2" fill="#b9b5ad" />
    </svg>
  )
}

// Post-it (public/post-it.webp), légèrement de travers
export function Sticky({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-size-[100%_100%] bg-no-repeat px-5 pt-4 pb-6 font-type text-ink ${className}`}
      style={{ backgroundImage: 'url(/post-it.webp)' }}
    >
      {children}
    </div>
  )
}

// Le Schrute Buck (public/schrute-buck.webp) : la monnaie du jeu, affichée partout où l'on paie
export function Bill({ className = '' }: { className?: string }) {
  return <img src="/schrute-buck.webp" alt="" draggable={false} className={`inline-block drop-shadow-sm ${className}`} />
}

// Le logo Dunder Mifflin en autocollant usé (public/dunder-mifflin.webp)
export function DunderMifflinLogo({ className = '' }: { className?: string }) {
  return <img src="/dunder-mifflin.webp" alt="Dunder Mifflin Paper Company" draggable={false} className={`block ${className}`} />
}

// Titre de section tapé à la machine
export function Heading({ children }: { children: ReactNode }) {
  return <h2 className="font-type text-sm font-bold tracking-[0.15em] uppercase">{children}</h2>
}

// En-tête des écrans secondaires : le titre et le solde du joueur
export function ScreenTitle({ title, bucks }: { title: string; bucks: number }) {
  return (
    <Paper hold="tape" torn="bottom" className="flex items-center justify-between px-4 pt-4 pb-3">
      <h1 className="font-type text-2xl font-bold">{title}</h1>
      <p className="flex items-center gap-1.5 font-type text-lg font-bold tabular-nums">
        <Bill className="w-11 -rotate-3" />
        {format(bucks)}
      </p>
    </Paper>
  )
}
