import { useState } from 'react'
import { Splash } from './components/Splash'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <main className="h-full bg-paper text-ink pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {showSplash ? (
        <Splash onDone={() => setShowSplash(false)} />
      ) : (
        // Prototype : accueil provisoire en attendant le jeu
        <div className="animate-fade-in flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="font-type text-sm tracking-[0.3em] uppercase opacity-60">Dunder Mifflin</p>
          <h1 className="font-type text-3xl font-bold">The Office TCG</h1>
          <p className="opacity-60">Collectionne les cartes de Dunder Mifflin</p>
        </div>
      )}
    </main>
  )
}

export default App
