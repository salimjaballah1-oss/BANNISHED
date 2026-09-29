import { Card } from '../components/Card'
import { Paper, ScreenTitle } from '../components/Desk'
import { CATALOG } from '../data/cards'
import { cardsLabel } from '../lib/player'
import type { Game } from '../lib/useGame'

// Collection : uniquement les cartes tirées, pour ne rien spoiler du catalogue
export function CollectionScreen({ game }: { game: Game }) {
  const owned = CATALOG.filter((c) => game.owned.includes(c.id))

  return (
    <div className="space-y-5">
      <ScreenTitle title="Collection" bucks={game.bucks} />

      <Paper className="px-4 pt-3 pb-4">
        <p className="font-type text-sm font-bold">{cardsLabel(owned.length)}</p>
        {owned.length === 0 ? (
          <p className="mt-3 border border-dashed border-ink/30 px-4 py-8 text-center font-type text-sm opacity-70">
            Aucune carte pour l’instant.
            <br />
            Ouvre ton premier Collector Pack.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {owned.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        )}
      </Paper>
    </div>
  )
}
