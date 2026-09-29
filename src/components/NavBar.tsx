import type { ReactNode } from 'react'
import { TornEdge } from './Desk'

export type Tab = 'home' | 'boosters' | 'collection' | 'ranking' | 'profile'

// Icônes au trait, dans le même style que le reste (encre, bouts arrondis)
const ICONS: Record<Tab, ReactNode> = {
  home: <path d="M 4 11 L 12 4 L 20 11 M 6 9.5 L 6 20 L 18 20 L 18 9.5 M 10 20 L 10 14 L 14 14 L 14 20" />,
  // un paquet scellé, bords crantés en haut et en bas
  boosters: (
    <path d="M 6 3 L 8 4.5 L 10 3 L 12 4.5 L 14 3 L 16 4.5 L 18 3 L 18 21 L 16 19.5 L 14 21 L 12 19.5 L 10 21 L 8 19.5 L 6 21 Z M 9 9 L 15 9 M 9 12 L 15 12" />
  ),
  // deux cartes l'une sur l'autre
  collection: <path d="M 8 6 L 8 4 L 19 4 L 19 18 L 17 18 M 5 7 L 16 7 L 16 21 L 5 21 Z" />,
  // podium
  ranking: <path d="M 3 20 L 21 20 M 9 20 L 9 8 L 15 8 L 15 20 M 3 20 L 3 13 L 9 13 M 15 12 L 21 12 L 21 20" />,
  profile: <path d="M 12 12 A 4 4 0 1 0 12 4 A 4 4 0 1 0 12 12 Z M 4 21 C 4 16 8 14 12 14 C 16 14 20 16 20 21" />,
}

const LABELS: Record<Tab, string> = {
  home: 'Accueil',
  boosters: 'Boosters',
  collection: 'Collection',
  ranking: 'Classement',
  profile: 'Profil',
}

// Barre du bas, toujours visible
export function NavBar({ current, onChange }: { current: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="paper fixed inset-x-0 bottom-0 z-20 pb-[env(safe-area-inset-bottom)]">
      <TornEdge side="top" />
      <ul className="mx-auto flex max-w-md">
        {(Object.keys(LABELS) as Tab[]).map((tab) => {
          const active = tab === current
          return (
            <li key={tab} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(tab)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full cursor-pointer flex-col items-center gap-0.5 pt-2 pb-1.5 font-type text-[0.62rem] ${active ? 'font-bold text-navy' : 'text-ink/60'}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={active ? 2.2 : 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {ICONS[tab]}
                </svg>
                {LABELS[tab]}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
