import { useEffect, useState } from 'react'
import { UPGRADES, upgradeCost, type Upgrade } from '../data/upgrades'

// Partie du joueur, gardée sur cet appareil en attendant le serveur
type GameState = {
  bucks: number
  earned: number // total gagné depuis le début, pour le profil
  clicks: number // gorgées de café
  levels: Record<Upgrade['id'], number>
  owned: string[] // cartes tirées dans les packs (id du catalogue)
}

const SAVE_KEY = 'the-office-tcg:game'

const NEW_GAME: GameState = { bucks: 0, earned: 0, clicks: 0, levels: { spencer: 0, jim: 0, infinity: 0 }, owned: [] }

function load(): GameState {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null')
    return saved ? { ...NEW_GAME, ...saved, levels: { ...NEW_GAME.levels, ...saved.levels } } : NEW_GAME
  } catch {
    return NEW_GAME
  }
}

export function useGame() {
  const [game, setGame] = useState(load)

  const perClick = 1 + UPGRADES.reduce((sum, u) => sum + (u.perClick ?? 0) * game.levels[u.id], 0)
  const perSecond = UPGRADES.reduce((sum, u) => sum + (u.perSecond ?? 0) * game.levels[u.id], 0)

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game))
    } catch {
      // stockage indisponible : la partie ne durera que le temps de la page
    }
  }, [game])

  // revenu automatique, versé chaque seconde
  useEffect(() => {
    if (perSecond === 0) return
    const timer = setInterval(() => {
      setGame((g) => ({ ...g, bucks: g.bucks + perSecond, earned: g.earned + perSecond }))
    }, 1000)
    return () => clearInterval(timer)
  }, [perSecond])

  function sip() {
    setGame((g) => ({ ...g, bucks: g.bucks + perClick, earned: g.earned + perClick, clicks: g.clicks + 1 }))
  }

  function buy(upgrade: Upgrade) {
    setGame((g) => {
      const cost = upgradeCost(upgrade, g.levels[upgrade.id])
      if (g.bucks < cost) return g
      return { ...g, bucks: g.bucks - cost, levels: { ...g.levels, [upgrade.id]: g.levels[upgrade.id] + 1 } }
    })
  }

  return { ...game, perClick, perSecond, sip, buy }
}

export type Game = ReturnType<typeof useGame>
