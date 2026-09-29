import type { ReactNode } from 'react'

export type Screen = 'album' | 'boosters' | 'trades' | 'profile'

type Props = { current: Screen; onChange: (screen: Screen) => void }

type Item = { screen: Screen; label: string; icon: ReactNode }

// Prototype : les onglets et leurs icônes sont provisoires. Boosters est au centre, sur le crâne.
const LEFT: Item[] = [
  {
    screen: 'album',
    label: 'Album',
    icon: (
      <>
        <rect x="3" y="4" width="8" height="16" rx="1.5" />
        <rect x="13" y="4" width="8" height="16" rx="1.5" />
      </>
    ),
  },
  {
    screen: 'trades',
    label: 'Échanges',
    icon: (
      <>
        <path d="M4 8h14l-4-4" />
        <path d="M20 16H6l4 4" />
      </>
    ),
  },
]

const RIGHT: Item[] = [
  {
    screen: 'profile',
    label: 'Profil',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" />
      </>
    ),
  },
]

const LABEL = 'font-title text-[clamp(0.5rem,2.2vw,0.7rem)] leading-none tracking-[0.08em] uppercase'

// Barre de navigation fixée en bas de l'écran (sous les fiches, qui sont en z-10).
// Le cadre vient de design/navbar.png ; les positions en % suivent son dessin (zone sombre, crâne).
export function NavBar({ current, onChange }: Props) {
  function renderItem({ screen, label, icon }: Item) {
    const active = screen === current
    return (
      <li key={screen} className="flex flex-1">
        <button
          onClick={() => onChange(screen)}
          aria-current={active ? 'page' : undefined}
          className={`flex w-full flex-col items-center justify-center gap-0.5 transition-colors ${
            active ? 'nav-active text-blood' : 'text-white/45'
          }`}>
          <svg
            viewBox="0 0 24 24"
            className="h-[clamp(0.9rem,4.6vw,1.4rem)] w-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round">
            {icon}
          </svg>
          <span className={`${LABEL} ${active ? 'text-white' : ''}`}>{label}</span>
        </button>
      </li>
    )
  }

  const boostersActive = current === 'boosters'

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-night via-night/80 to-transparent px-2 pt-6 pb-[calc(env(safe-area-inset-bottom)+0.25rem)]">
      <div className="pointer-events-auto relative mx-auto aspect-[2156/603] w-full max-w-[34rem] bg-[url(/navbar.webp)] bg-contain bg-center bg-no-repeat">
        {/* les yeux du crâne rougeoient quand on est sur les boosters (calque tiré du dessin) */}
        <img
          src="/navbar-eyes.webp"
          alt=""
          className={`nav-eyes absolute top-[22.39%] left-[46.38%] h-[10.78%] w-[7.24%] ${boostersActive ? 'nav-eyes-lit' : ''}`}
        />

        <ul className="absolute top-[41.5%] bottom-[22.9%] left-[10.4%] flex w-[29.6%]">{LEFT.map(renderItem)}</ul>

        {/* le crâne et la gemme forment le bouton des boosters */}
        <button
          onClick={() => onChange('boosters')}
          aria-current={boostersActive ? 'page' : undefined}
          className="absolute top-0 bottom-0 left-[40%] w-[20%]">
          <span
            className={`${LABEL} absolute inset-x-0 top-[53%] transition-colors ${
              boostersActive ? 'text-white' : 'text-white/45'
            }`}>
            Boosters
          </span>
        </button>

        <ul className="absolute top-[41.5%] right-[10.3%] bottom-[22.9%] flex w-[29.7%]">{RIGHT.map(renderItem)}</ul>
      </div>
    </nav>
  )
}
