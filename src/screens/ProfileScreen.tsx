import { Paper, ScreenTitle, Sticky } from '../components/Desk'
import { CATALOG } from '../data/cards'
import { format, PLAYER } from '../lib/player'
import type { Game } from '../lib/useGame'

// Profil : la plaque du joueur et ses chiffres
export function ProfileScreen({ game }: { game: Game }) {
  const stats = [
    ['Schrute Bucks gagnés', format(game.earned)],
    ['Gorgées de café', format(game.clicks)],
    ['Cartes', String(CATALOG.filter((c) => game.owned.includes(c.id)).length)],
  ]

  return (
    <div className="space-y-5">
      <ScreenTitle title="Profil" bucks={game.bucks} />

      <Paper hold="pin" className="px-4 pt-4 pb-4">
        {/* la plaque de bureau */}
        <div className="bg-ink px-4 py-3 text-center text-paper">
          <p className="font-type text-xl font-bold tracking-wide">{PLAYER.name}</p>
          <p className="font-type text-xs opacity-75">{PLAYER.title}</p>
        </div>
        <dl className="mt-4 font-type text-sm">
          {stats.map(([label, value]) => (
            <div key={label} className="flex justify-between border-t border-ink/15 py-2">
              <dt className="opacity-70">{label}</dt>
              <dd className="font-bold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </Paper>

      <Sticky className="mx-auto w-64 rotate-2 text-sm">
        “Bears. Beets. Battlestar Galactica.”
        <span className="mt-1 block text-right text-xs">— Jim Halpert</span>
      </Sticky>
    </div>
  )
}
