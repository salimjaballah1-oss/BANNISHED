import { useState } from 'react'
import { LoreIntro } from './components/LoreIntro'
import { Splash } from './components/Splash'

const INTRO_SEEN_KEY = 'bannishcard:intro-seen'

function hasSeenIntro() {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, '1')
  } catch {
    // stockage indisponible (navigation privée) : l'intro sera simplement rejouée
  }
}

type Phase = 'splash' | 'intro' | 'app'

function App() {
  const [phase, setPhase] = useState<Phase>('splash')

  return (
    <main className="h-full bg-night pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {phase === 'splash' && (
        <Splash onDone={() => setPhase(hasSeenIntro() ? 'app' : 'intro')} />
      )}
      {phase === 'intro' && (
        <LoreIntro
          onDone={() => {
            markIntroSeen()
            setPhase('app')
          }}
        />
      )}
    </main>
  )
}

export default App
