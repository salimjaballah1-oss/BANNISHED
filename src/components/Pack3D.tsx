import { useEffect, useRef, type PointerEvent } from 'react'

const FRONT = '/pack-front.webp'
const BACK = '/pack-back.webp'

// Le Collector Pack en 3D : on le fait tourner au doigt, il garde son élan, puis se balance doucement.
// Un appui bref le retourne. Tout est piloté hors de React (requestAnimationFrame) pour rester fluide.
export function Pack3D({ className = '' }: { className?: string }) {
  const packRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const state = useRef({
    rx: 0, // inclinaison haut/bas (degrés)
    ry: -14, // rotation gauche/droite (degrés)
    vx: 0,
    vy: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    moved: 0,
    target: 0, // face vers laquelle le pack revient (multiple de 180)
    lockedUntil: 0, // après un retournement, on garde la cible le temps de l'animation
  })

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    const tick = (now: number) => {
      const s = state.current
      const t = now / 1000
      if (!s.dragging) {
        // élan après le lâcher, freiné petit à petit
        s.ry += s.vy
        s.rx += s.vx
        s.vy *= 0.94
        s.vx *= 0.88
        if (Math.abs(s.vy) < 0.5) {
          if (t > s.lockedUntil) s.target = Math.round(s.ry / 180) * 180
          // retour vers la face la plus proche, avec un léger balancement
          const swayY = calm ? 0 : Math.sin(t * 0.8) * 9
          const swayX = calm ? 0 : Math.sin(t * 0.6) * 4
          s.ry += (s.target + swayY - s.ry) * 0.07
          s.rx += (swayX - s.rx) * 0.07
        }
      }
      s.rx = Math.max(-32, Math.min(32, s.rx))

      const pack = packRef.current
      if (pack) {
        pack.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`
        // position du reflet : suit l'angle par rapport à la face visible
        const offset = ((((s.ry + 90) % 180) + 180) % 180) - 90
        pack.style.setProperty('--shine', String(0.5 + offset / 110 + s.rx / 160))
      }
      // l'ombre sur le bureau s'affine quand le pack est de profil
      if (shadowRef.current) {
        const width = 0.35 + 0.65 * Math.abs(Math.cos((s.ry * Math.PI) / 180))
        shadowRef.current.style.transform = `scaleX(${width})`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  function flip() {
    const s = state.current
    s.target = Math.round(s.ry / 180) * 180 + 180
    s.vy = 0
    s.lockedUntil = performance.now() / 1000 + 1.2
  }

  function down(e: PointerEvent) {
    const s = state.current
    e.currentTarget.setPointerCapture(e.pointerId)
    Object.assign(s, { dragging: true, lastX: e.clientX, lastY: e.clientY, moved: 0, vx: 0, vy: 0 })
  }

  function move(e: PointerEvent) {
    const s = state.current
    if (!s.dragging) return
    const dx = e.clientX - s.lastX
    const dy = e.clientY - s.lastY
    s.lastX = e.clientX
    s.lastY = e.clientY
    s.moved += Math.abs(dx) + Math.abs(dy)
    s.vy = dx * 0.6
    s.vx = -dy * 0.35
    s.ry += s.vy
    s.rx += s.vx
  }

  function up() {
    const s = state.current
    s.dragging = false
    // un appui sans glisser : on retourne le pack
    if (s.moved < 6) flip()
  }

  return (
    <div className={className}>
      <div
        className="relative mx-auto aspect-[620/844] w-60 cursor-grab touch-none select-none [perspective:1100px] active:cursor-grabbing"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        role="img"
        aria-label="Collector Pack The Office, série 1"
      >
        <div ref={packRef} className="absolute inset-0 [transform-style:preserve-3d]">
          <Face src={FRONT} />
          <Face src={BACK} back />
        </div>
      </div>
      <div ref={shadowRef} className="mx-auto -mt-2 h-4 w-44 rounded-[50%] bg-black/45 blur-md" aria-hidden />

      <button
        type="button"
        onClick={flip}
        className="mx-auto mt-3 block cursor-pointer font-type text-xs text-paper/70 underline underline-offset-4"
      >
        Retourner le pack
      </button>
    </div>
  )
}

// Une face du pack, avec son reflet d'emballage métallisé découpé à la forme du paquet
function Face({ src, back = false }: { src: string; back?: boolean }) {
  const shape = { maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }
  return (
    <div className={`absolute inset-0 [backface-visibility:hidden] ${back ? '[transform:rotateY(180deg)]' : ''}`}>
      <img src={src} alt="" draggable={false} className="block h-full w-full" />
      <div className="pack-shine pointer-events-none absolute inset-0" style={shape} aria-hidden />
    </div>
  )
}
