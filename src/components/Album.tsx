import { useState } from 'react'
import { cardsOf, useCatalog, type Catalog, type Entity } from '../lib/catalog'
import { supabase } from '../lib/supabase'

type Tab = 'character' | 'weapon'

type Props = { username: string }

// L'album : la grille des Bannis et des armes, avec la progression
export function Album({ username }: Props) {
  const { catalog, error } = useCatalog()
  const [tab, setTab] = useState<Tab>('character')

  if (error) {
    return <p className="p-10 text-center text-white/60">Impossible de charger l’album. Réessaie plus tard.</p>
  }
  if (!catalog) return null

  const owned = catalog.cards.filter((c) => c.quantity > 0).length
  const entities = tab === 'character' ? catalog.characters : catalog.weapons

  return (
    <div className="animate-fade-in mx-auto max-w-xl px-5 pt-6 pb-10">
      <header className="mb-6 flex items-center justify-between">
        <img src="/logo-light.webp" alt="Bannished" className="w-32" />
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-white/40">
          {username} · Déconnexion
        </button>
      </header>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-white/60">
          <span>Ta collection</span>
          <span>
            {owned} / {catalog.cards.length} cartes
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="bg-blood h-full rounded-full" style={{ width: `${(owned / catalog.cards.length) * 100}%` }} />
        </div>
      </div>

      <nav className="mb-6 flex gap-2">
        {(['character', 'weapon'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-title flex-1 rounded-full py-2 text-sm tracking-[0.15em] uppercase transition-colors ${
              tab === t ? 'bg-white/10 text-white' : 'text-white/40'
            }`}
          >
            {t === 'character' ? 'Bannis' : 'Armes'}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-2 gap-4">
        {entities.map((e) => (
          <EntityTile key={e.id} entity={e} catalog={catalog} kind={tab} />
        ))}
      </div>
    </div>
  )
}

type TileProps = { entity: Entity; catalog: Catalog; kind: Tab }

// Une case de l'album. Sans aucune carte du Banni, on ne voit que sa silhouette.
function EntityTile({ entity, catalog, kind }: TileProps) {
  const cards = cardsOf(catalog, entity, kind)
  const ownedCount = cards.filter((c) => c.quantity > 0).length
  const discovered = ownedCount > 0

  return (
    <button className="group text-left">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-[#15151c]">
        {discovered && entity.background_path && (
          <img src={entity.background_path} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {entity.cutout_path && (
          <img
            src={entity.cutout_path}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover ${discovered ? '' : 'silhouette'}`}
          />
        )}
        {!discovered && (
          <span className="font-title absolute inset-x-0 top-1/3 text-center text-4xl text-white/30">?</span>
        )}
      </div>
      <p className={`mt-2 text-lg leading-tight ${discovered ? '' : 'text-white/50'}`}>{entity.name}</p>
      <p className="text-sm text-white/40">
        {ownedCount} / {cards.length} cartes
      </p>
    </button>
  )
}
