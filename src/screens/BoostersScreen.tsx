import { Pack3D } from '../components/Pack3D'
import { Heading, Paper, ScreenTitle } from '../components/Desk'
import { CARDS_PER_PACK, DROP_RATES, RARITY_LABEL, type Rarity } from '../data/cards'
import type { Game } from '../lib/useGame'

// Pastille de couleur de chaque rareté (couleurs dans index.css)
const DOT: Record<Rarity, string> = {
  common: 'bg-common',
  uncommon: 'bg-uncommon',
  rare: 'bg-rare',
  epic: 'bg-epic',
  legendary: 'bg-legendary',
  secret: 'bg-secret',
}

// Boosters : le Collector Pack en 3D et ses taux. L'achat arrive à la prochaine étape.
export function BoostersScreen({ game }: { game: Game }) {
  return (
    <div className="space-y-5">
      <ScreenTitle title="Boosters" bucks={game.bucks} />

      <Pack3D className="py-2" />

      <Paper hold="pin" className="px-4 pt-4 pb-4">
        <div className="flex items-baseline justify-between">
          <Heading>Collector Pack</Heading>
          <p className="font-type text-xs opacity-70">{CARDS_PER_PACK} cartes par pack</p>
        </div>
        <ul className="mt-3 font-type text-sm">
          {(Object.keys(DROP_RATES) as Rarity[]).map((r) => (
            <li key={r} className="flex items-center gap-2 border-t border-ink/15 py-1.5">
              <span className={`size-2.5 rounded-full ${DOT[r]}`} aria-hidden />
              <span className="flex-1">{RARITY_LABEL[r]}</span>
              <span className="tabular-nums">{DROP_RATES[r].toLocaleString('fr-FR')} %</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 border border-dashed border-ink/30 px-4 py-2.5 text-center font-type text-sm opacity-70">
          Les packs ne sont pas encore en vente.
        </p>
      </Paper>
    </div>
  )
}
