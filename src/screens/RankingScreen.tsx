import { Paper, ScreenTitle } from '../components/Desk'
import { CATALOG } from '../data/cards'
import { cardsLabel, PLAYER, RIVAL } from '../lib/player'
import type { Game } from '../lib/useGame'

// Classement : qui a le plus de cartes
export function RankingScreen({ game }: { game: Game }) {
  const myCards = CATALOG.filter((c) => game.owned.includes(c.id)).length
  const ranking = [
    { name: PLAYER.name, cards: myCards as number | null, me: true },
    { name: RIVAL, cards: null, me: false },
  ]

  return (
    <div className="space-y-5">
      <ScreenTitle title="Classement" bucks={game.bucks} />

      <Paper hold="pin" className="px-4 pt-4 pb-3">
        <ol className="font-type">
          {ranking.map((p, i) => (
            <li
              key={p.name}
              className={`flex items-center gap-3 px-2 py-2.5 ${p.me ? 'bg-note font-bold' : 'border-t border-ink/15'}`}
            >
              <span className="w-4">{i + 1}</span>
              <span className="flex-1">{p.name}</span>
              <span className="tabular-nums">{p.cards === null ? '—' : cardsLabel(p.cards)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs opacity-60">Les cartes de Tayeb s’afficheront quand il aura rejoint la partie.</p>
      </Paper>
    </div>
  )
}
