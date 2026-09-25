import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export type Rarity = { id: number; name: string; rank: number; color: string }
export type Season = { id: number; number: number; name: string }

export type Entity = {
  id: string
  slug: string
  name: string
  bio: string | null
  power: string | null
  season_id: number | null
  background_path: string | null
  cutout_path: string | null
  sort_order: number
}

export type Character = Entity
export type Weapon = Entity & { owner_id: string | null }

export type Card = {
  id: string
  character_id: string | null
  weapon_id: string | null
  rarity_id: number
  variant_name: string | null
  sort_order: number
  // présents seulement si le joueur possède la carte
  quantity: number
  image_path: string | null
}

export type Catalog = {
  rarities: Rarity[]
  seasons: Season[]
  characters: Character[]
  weapons: Weapon[]
  cards: Card[]
}

const ENTITY_COLUMNS = 'id, slug, name, bio, power, season_id, background_path, cutout_path, sort_order'

// Charge tout le catalogue et la collection du joueur connecté
export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [rarities, seasons, characters, weapons, cards, collection, images] = await Promise.all([
        supabase.from('rarities').select('id, name, rank, color').order('rank'),
        supabase.from('seasons').select('id, number, name').order('number'),
        supabase.from('characters').select(ENTITY_COLUMNS).order('sort_order'),
        supabase.from('weapons').select(`${ENTITY_COLUMNS}, owner_id`).order('sort_order'),
        // l'illustration n'est pas demandée ici : la base la refuse pour les cartes non possédées
        supabase
          .from('cards')
          .select('id, character_id, weapon_id, rarity_id, variant_name, sort_order')
          .order('sort_order'),
        supabase.from('collection').select('card_id, quantity'),
        supabase.rpc('my_card_images'),
      ])
      if (cancelled) return
      const failed = [rarities, seasons, characters, weapons, cards, collection, images].some((r) => r.error)
      if (failed) {
        setError(true)
        return
      }
      const quantities = new Map(collection.data!.map((c) => [c.card_id, c.quantity]))
      const imagePaths = new Map(
        (images.data as { card_id: string; image_path: string | null }[]).map((i) => [i.card_id, i.image_path]),
      )
      setCatalog({
        rarities: rarities.data!,
        seasons: seasons.data!,
        characters: characters.data!,
        weapons: weapons.data!,
        cards: cards.data!.map((c) => ({
          ...c,
          quantity: quantities.get(c.id) ?? 0,
          image_path: imagePaths.get(c.id) ?? null,
        })),
      })
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { catalog, error }
}

// Cartes d'un Banni ou d'une arme
export function cardsOf(catalog: Catalog, entity: Entity, kind: 'character' | 'weapon') {
  return catalog.cards.filter((c) =>
    kind === 'character' ? c.character_id === entity.id : c.weapon_id === entity.id,
  )
}
