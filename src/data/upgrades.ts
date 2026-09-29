// Améliorations du bureau. Le prix augmente de 15 % à chaque niveau acheté.
export type Upgrade = {
  id: 'spencer' | 'jim' | 'infinity'
  name: string
  description: string
  baseCost: number
  perClick?: number // Schrute Bucks gagnés en plus à chaque gorgée
  perSecond?: number // Schrute Bucks gagnés tout seuls, chaque seconde
}

export const UPGRADES: Upgrade[] = [
  {
    id: 'spencer',
    name: 'Acheté chez Spencer Gifts',
    description: 'Michael a offert la tasse à lui-même. Elle n’en est pas moins sincère.',
    baseCost: 15,
    perClick: 1,
  },
  {
    id: 'jim',
    name: 'Jim au téléphone',
    description: 'Il vend du papier pendant que tu bois ton café.',
    baseCost: 60,
    perSecond: 1,
  },
  {
    id: 'infinity',
    name: 'Dunder Mifflin Infinity',
    description: 'Ryan promet que le site va tout changer.',
    baseCost: 500,
    perSecond: 8,
  },
]

export function upgradeCost(upgrade: Upgrade, level: number) {
  return Math.ceil(upgrade.baseCost * 1.15 ** level)
}
