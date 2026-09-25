import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cardsOf, type Card, type Catalog, type Entity, type Weapon } from '../lib/catalog'

export type Kind = 'character' | 'weapon'

type Props = {
  catalog: Catalog
  entity: Entity
  kind: Kind
  // position de la case de l'album d'où part la carte (null : ouverture depuis une autre fiche)
  getOrigin: () => DOMRect | null
  onClose: () => void
  onOpen: (entity: Entity, kind: Kind) => void
}

type Phase = 'flying' | 'open' | 'closing'

const FLY = 550 // durée du vol de la carte (ms)
const UNPOP = 350 // durée pour que la carte se remette à plat avant de repartir (ms)

// Place la carte à l'endroit de `origin` (ou la réduit si on n'a pas d'origine)
function placeAt(el: HTMLElement, origin: DOMRect | null) {
  const target = el.getBoundingClientRect()
  if (origin) {
    const s = origin.width / target.width
    el.style.transform = `translate(${origin.left - target.left}px, ${origin.top - target.top}px) scale(${s})`
  } else {
    el.style.transform = 'scale(0.85)'
    el.style.opacity = '0'
  }
}

// Fiche d'un Banni ou d'une arme : la carte vole depuis l'album, bascule, et le personnage en jaillit
export function EntitySheet({ catalog, entity, kind, getOrigin, onClose, onOpen }: Props) {
  const heroRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('flying')

  const cards = cardsOf(catalog, entity, kind)
  const discovered = cards.some((c) => c.quantity > 0)
  const season = catalog.seasons.find((s) => s.id === entity.season_id)

  // ouverture : la carte part de sa case dans l'album et vient se placer en haut de la fiche
  useLayoutEffect(() => {
    const el = heroRef.current!
    el.style.transformOrigin = 'top left'
    placeAt(el, getOrigin())
    el.getBoundingClientRect() // le navigateur doit prendre en compte la position de départ
    el.style.transition = `transform ${FLY}ms cubic-bezier(.2,.8,.2,1), opacity 400ms`
    el.style.transform = ''
    el.style.opacity = ''
    const timer = setTimeout(() => setPhase('open'), FLY)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function close() {
    if (phase === 'closing') return
    setPhase('closing')
    // la carte se remet à plat, puis repart vers sa case
    setTimeout(() => {
      const el = heroRef.current
      if (!el) return
      placeAt(el, getOrigin())
      setTimeout(onClose, FLY)
    }, UNPOP)
  }

  // Échap pour fermer sur ordinateur
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Banni ↔ arme liés
  const linked: { entity: Entity; kind: Kind }[] =
    kind === 'character'
      ? catalog.weapons.filter((w) => w.owner_id === entity.id).map((w) => ({ entity: w, kind: 'weapon' }))
      : catalog.characters
          .filter((c) => c.id === (entity as Weapon).owner_id)
          .map((c) => ({ entity: c, kind: 'character' }))

  return (
    <div
      className={`sheet fixed inset-0 z-10 overflow-y-auto bg-night ${phase === 'closing' ? 'sheet-closing' : ''}`}
    >
      <button
        onClick={close}
        aria-label="Retour"
        className="fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-2xl text-white/80 backdrop-blur"
      >
        ←
      </button>

      <div className="mx-auto max-w-xl px-6 pt-[calc(env(safe-area-inset-top)+6.5rem)] pb-16">
        {/* la carte, avec l'effet 3D */}
        <div
          ref={heroRef}
          className={`hero mx-auto w-[62%] max-w-[280px] ${phase === 'open' ? 'hero-popped' : ''}`}
        >
          <div className="hero-bg rounded-2xl border border-white/10 bg-[#15151c]">
            {discovered && entity.background_path && (
              <img src={entity.background_path} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          {entity.cutout_path && (
            <img
              src={entity.cutout_path}
              alt=""
              className={`hero-cutout ${discovered ? '' : 'silhouette'}`}
            />
          )}
        </div>

        {/* le contenu apparaît une fois la carte en place */}
        <div className={`sheet-content mt-10 ${phase === 'open' ? 'sheet-content-in' : ''}`}>
          <p className="text-center text-sm tracking-[0.2em] text-white/40 uppercase">
            {kind === 'character' ? 'Banni' : 'Arme'}
            {season && ` · ${season.name}`}
          </p>
          <h1 className="font-title mt-1 text-center text-3xl tracking-[0.12em] uppercase">{entity.name}</h1>
          {!discovered && (
            <p className="mt-3 text-center text-white/50 italic">
              Obtiens une de ses cartes pour le découvrir.
            </p>
          )}

          {entity.bio && (
            <section className="mt-8">
              <h2 className="sheet-heading">Histoire</h2>
              <p className="text-lg leading-relaxed text-[#cfcbe0]">{entity.bio}</p>
            </section>
          )}

          {entity.power && (
            <section className="mt-6">
              <h2 className="sheet-heading">Pouvoir</h2>
              <p className="text-lg leading-relaxed text-[#cfcbe0]">{entity.power}</p>
            </section>
          )}

          {linked.length > 0 && (
            <section className="mt-6">
              <h2 className="sheet-heading">{kind === 'character' ? 'Son arme' : 'Son porteur'}</h2>
              <div className="flex flex-col gap-3">
                {linked.map((l) => (
                  <LinkedRow
                    key={l.entity.id}
                    catalog={catalog}
                    entity={l.entity}
                    kind={l.kind}
                    onClick={() => onOpen(l.entity, l.kind)}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="sheet-heading">
              Ses cartes · {cards.filter((c) => c.quantity > 0).length} / {cards.length}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {cards.map((c) => (
                <CardThumb key={c.id} card={c} catalog={catalog} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// Une carte en bas de la fiche : visible si on l'a, sinon verrouillée
function CardThumb({ card, catalog }: { card: Card; catalog: Catalog }) {
  const rarity = catalog.rarities.find((r) => r.id === card.rarity_id)
  const owned = card.quantity > 0 && card.image_path

  return (
    <div>
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-xl border-2"
        style={{ borderColor: owned ? rarity?.color : 'rgb(255 255 255 / 0.08)' }}
      >
        {owned ? (
          <img src={card.image_path!} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#15151c]">
            <LockIcon />
          </div>
        )}
        {card.quantity > 1 && (
          <span className="absolute top-1.5 right-1.5 rounded-full bg-black/70 px-2 text-sm">×{card.quantity}</span>
        )}
      </div>
      <p className="mt-1 text-center text-sm leading-tight" style={{ color: rarity?.color }}>
        {rarity?.name}
      </p>
      {owned && card.variant_name && (
        <p className="text-center text-xs leading-tight text-white/50">{card.variant_name}</p>
      )}
    </div>
  )
}

// Lien vers la fiche du Banni ou de l'arme associé
function LinkedRow({
  catalog,
  entity,
  kind,
  onClick,
}: {
  catalog: Catalog
  entity: Entity
  kind: Kind
  onClick: () => void
}) {
  const discovered = cardsOf(catalog, entity, kind).some((c) => c.quantity > 0)
  return (
    <button onClick={onClick} className="flex items-center gap-4 rounded-2xl bg-white/5 p-3 text-left">
      <div className="relative aspect-[2/3] w-12 overflow-hidden rounded-lg bg-[#15151c]">
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
      </div>
      <span className={`flex-1 text-lg ${discovered ? '' : 'text-white/50'}`}>{entity.name}</span>
      <span className="text-white/40">→</span>
    </button>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-white/25" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
