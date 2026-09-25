type Props = { onDone: () => void }

// Écran de démarrage : le logo émerge, l'épée s'embrase avec un choc, puis tout s'efface
export function Splash({ onDone }: Props) {
  return (
    <div
      className="splash fixed inset-0 flex items-center justify-center overflow-hidden bg-night"
      // seule la fin du fondu de sortie compte, pas celle des animations du logo
      onAnimationEnd={(e) => e.animationName === 'splash-out' && onDone()}
    >
      <div className="splash-flash absolute inset-0" />
      <div className="splash-logo relative w-[82%] max-w-md">
        <img src="/logo-light.webp" alt="Bannished" className="block w-full" />
        <img src="/logo-glow.webp" alt="" className="splash-glow absolute inset-0 w-full" />
      </div>
    </div>
  )
}
