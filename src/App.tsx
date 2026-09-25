import { useState } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { Home } from './components/Home'
import { LoreIntro } from './components/LoreIntro'
import { Splash } from './components/Splash'
import { useAuth } from './lib/auth'

const INTRO_SEEN_KEY = 'bannishcard:intro-seen'

function hasSeenIntro() {
  // ?intro à la fin de l'adresse : rejoue toujours l'intro (pratique pour tester)
  if (location.search.includes('intro')) return false
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
  const { session, profile, loading } = useAuth()

  return (
    <main className="h-full overflow-y-auto bg-night pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {phase === 'splash' && (
        // le sang attend que l'on sache si le joueur est connecté
        <Splash ready={!loading} onDone={() => setPhase(hasSeenIntro() ? 'app' : 'intro')} />
      )}
      {phase === 'intro' && (
        <LoreIntro
          onDone={() => {
            markIntroSeen()
            setPhase('app')
          }}
        />
      )}
      {phase === 'app' &&
        (session ? <Home username={profile?.username ?? 'Banni'} /> : <AuthScreen />)}
    </main>
  )
}

export default App
