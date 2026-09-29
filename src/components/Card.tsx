import { RARITY_LABEL, type CardData } from '../data/cards'

// Une carte de la collection : le recto fourni en image
export function Card({ card }: { card: CardData }) {
  return (
    <img
      src={card.image}
      alt={[card.name, card.variant, RARITY_LABEL[card.rarity]].filter(Boolean).join(', ')}
      draggable={false}
      className="block aspect-[5/7] w-full rounded-[3%] object-cover"
    />
  )
}
