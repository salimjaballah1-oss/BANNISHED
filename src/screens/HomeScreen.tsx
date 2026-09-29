import { UPGRADES, upgradeCost } from '../data/upgrades'
import { Clicker } from '../components/Clicker'
import { Bill, DunderMifflinLogo, Heading, Paper, Sticky } from '../components/Desk'
import { format, PLAYER } from '../lib/player'
import type { Game } from '../lib/useGame'

// Accueil : le badge du joueur, la tasse à cliquer et les améliorations
export function HomeScreen({ game, onOpenBoosters }: { game: Game; onOpenBoosters: () => void }) {
  return (
    <div className="space-y-5">
      {/* en-tête : logo, badge du joueur et solde */}
      <Paper hold="tape" torn="bottom" className="px-4 pt-5 pb-4">
        <DunderMifflinLogo className="mx-auto w-48" />
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="font-type text-lg leading-none font-bold">{PLAYER.name}</p>
            <p className="mt-1 font-type text-xs opacity-70">{PLAYER.title}</p>
          </div>
          <div className="shrink-0 text-right">
            <p
              className="flex items-center justify-end gap-2 font-type text-2xl leading-none font-bold tabular-nums"
              aria-live="polite"
            >
              <Bill className="w-16 -rotate-3" />
              {format(game.bucks)}
            </p>
            <p className="mt-1 font-type text-[0.6rem] tracking-[0.15em] uppercase opacity-70">Schrute Bucks</p>
          </div>
        </div>
      </Paper>

      {/* le clicker, posé sur le bureau */}
      <section className="relative pt-6 pb-2">
        <Sticky className="absolute top-0 -left-1 z-10 flex aspect-square w-36 -rotate-6 items-center text-center text-[0.8rem] leading-snug font-bold">
          Clique sur la tasse pour gagner des Schrute Bucks
        </Sticky>
        {/* flèche au feutre, du post-it vers la tasse */}
        <svg viewBox="0 0 60 50" className="absolute top-40 left-16 z-10 w-12 text-paper" aria-hidden>
          <path
            d="M 6 4 C 4 22 16 38 44 40 M 36 32 L 46 40 L 35 46"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="pl-12">
          <Clicker perClick={game.perClick} onClick={game.sip} />
        </div>

        <Paper className="mx-auto mt-4 w-fit rotate-1 px-4 py-1.5 font-type text-sm font-bold">
          +{format(game.perClick)} par clic
          {game.perSecond > 0 && <span className="font-normal"> · +{format(game.perSecond)}/s</span>}
        </Paper>
      </section>

      {/* améliorations */}
      <Paper hold="pin" className="px-4 pt-3 pb-2">
        <Heading>Améliorations</Heading>
        <ul className="mt-2">
          {UPGRADES.map((u) => {
            const level = game.levels[u.id]
            const cost = upgradeCost(u, level)
            const affordable = game.bucks >= cost
            return (
              <li key={u.id} className="flex items-center gap-3 border-t border-ink/15 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-type text-sm font-bold">
                    {u.name} {level > 0 && <span className="font-normal opacity-60">×{level}</span>}
                  </p>
                  <p className="font-type text-xs opacity-75">
                    {u.perClick ? `+${u.perClick} par clic` : `+${u.perSecond} par seconde`}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug opacity-60">{u.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => game.buy(u)}
                  disabled={!affordable}
                  className="flex shrink-0 items-center gap-1.5 rounded-sm bg-money px-2.5 py-1.5 font-type text-sm font-bold text-paper tabular-nums enabled:cursor-pointer enabled:active:translate-y-px disabled:opacity-40"
                >
                  <Bill className="w-9" />
                  {format(cost)}
                </button>
              </li>
            )
          })}
        </ul>
      </Paper>

      {/* raccourci vers les boosters */}
      <button
        type="button"
        onClick={onOpenBoosters}
        className="flex w-full cursor-pointer items-center justify-between bg-navy px-4 py-3 text-left text-paper shadow-[0_3px_5px_rgb(0_0_0/0.4)]"
      >
        <span>
          <span className="block font-logo text-lg leading-tight font-bold tracking-wide uppercase">Collector Pack</span>
          <span className="font-type text-xs opacity-80">Dépense tes Schrute Bucks en cartes</span>
        </span>
        <span className="font-type text-xl" aria-hidden>
          →
        </span>
      </button>

    </div>
  )
}
