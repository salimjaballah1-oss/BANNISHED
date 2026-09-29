// Catalogue des cartes. Chaque carte est une image finie, rangée dans public/cards/.
// Une carte n'est jamais affichée tant que le joueur ne l'a pas tirée dans un pack.
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'secret'

export type CardData = {
  id: string
  number: number // numéro imprimé sur la carte (sert au tri)
  name: string
  variant?: string // la référence à la série, imprimée sous le nom
  rarity: Rarity
  image: string // recto de la carte
}

export const CATALOG: CardData[] = [
  { id: 'dwight-security-protocol', number: 14, name: 'Dwight Schrute', variant: 'Security Protocol', rarity: 'epic', image: '/cards/dwight-security-protocol.webp' },
  { id: 'prison-mike', number: 14, name: 'Prison Mike', rarity: 'epic', image: '/cards/prison-mike.webp' },
  { id: 'creed-scranton-strangler', number: 17, name: 'Creed Bratton', variant: 'The Scranton Strangler', rarity: 'epic', image: '/cards/creed-scranton-strangler.webp' },
  { id: 'kevin-accountant', number: 27, name: 'Kevin Malone', variant: 'Dunder Mifflin Accountant', rarity: 'rare', image: '/cards/kevin-accountant.webp' },
  { id: 'michael-worlds-best-boss', number: 27, name: 'Michael Scott', variant: 'World’s Best Boss', rarity: 'rare', image: '/cards/michael-worlds-best-boss.webp' },
  { id: 'michael-fanny-pack', number: 27, name: 'Michael Scott', variant: 'The Fanny Pack', rarity: 'rare', image: '/cards/michael-fanny-pack.webp' },
  { id: 'asian-jim', number: 28, name: 'Asian Jim', rarity: 'rare', image: '/cards/asian-jim.webp' },
  { id: 'michael-oscar-unexpected-moment', number: 28, name: 'Michael & Oscar', variant: 'Unexpected Moment', rarity: 'legendary', image: '/cards/michael-oscar-unexpected-moment.webp' },
  { id: 'kevin-chili-spill', number: 31, name: 'Kevin Malone', variant: 'The Chili Spill', rarity: 'epic', image: '/cards/kevin-chili-spill.webp' },
]

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  secret: 'Secret',
}

// Collector Pack, tel qu'imprimé au dos du paquet (public/pack-back.webp)
export const CARDS_PER_PACK = 6

export const DROP_RATES: Record<Rarity, number> = {
  common: 50,
  uncommon: 25,
  rare: 15,
  epic: 7,
  legendary: 2.5,
  secret: 0.5,
}
