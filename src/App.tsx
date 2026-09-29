import { useState } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { Album } from './components/Album'
import { LoreIntro } from './components/LoreIntro'
import { NavBar, type Screen } from './components/NavBar'
import { Profile } from './components/Profile'
import { Splash } from './components/Splash'
import { useAuth } from './lib/auth'
import { supabase } from './lib/supabase'

type Phase = 'splash' | 'app'

function App() {
  const [phase, setPhase] = useState<Phase>('splash')
  const [screen, setScreen] = useState<Screen>('album')
  // vrai quand un joueur connecté est en train de choisir un autre compte
  const [switching, setSwitching] = useState(false)
  // ?intro à la fin de l'adresse : rejoue l'intro une fois connecté (pratique pour tester)
  const [replayIntro, setReplayIntro] = useState(() => location.search.includes('intro'))
  // compte qui vient de finir l'intro, sans attendre la réponse de Supabase
  const [introDoneBy, setIntroDoneBy] = useState<string | null>(null)
  const { session, profile, loading } = useAuth()
  const username = profile?.username ?? 'Banni'

  // L'intro est liée au compte (et non à l'appareil) : obligatoire à la première connexion, puis plus jamais
  const introSeen = session?.user.user_metadata.intro_seen === true || introDoneBy === session?.user.id
  const showIntro = session && !switching && (!introSeen || replayIntro)

  function finishIntro() {
    setReplayIntro(false)
    if (introSeen || !session) return
    setIntroDoneBy(session.user.id)
    // si l'enregistrement échoue (hors ligne…), l'intro repassera simplement la prochaine fois
    supabase.auth.updateUser({ data: { intro_seen: true } })
  }

  return (
    <main className="h-full overflow-y-auto bg-night pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {phase === 'splash' && (
        // le sang attend que l'on sache si le joueur est connecté
        <Splash ready={!loading} onDone={() => setPhase('app')} />
      )}
      {phase === 'app' && showIntro && (
        // « Passer » seulement pour une intro déjà vue et rejouée avec ?intro
        <LoreIntro key={session.user.id} skippable={introSeen} onDone={finishIntro} />
      )}
      {phase === 'app' &&
        !showIntro &&
        (session && !switching ? (
          // pb-36 : la barre de navigation ne doit pas cacher le bas de l'écran.
          // key : on repart de zéro (collection, fiches ouvertes) quand on change de compte
          <div key={session.user.id} className="pb-36">
            {screen === 'album' && <Album username={username} />}
            {screen === 'profile' && (
              <Profile
                userId={session.user.id}
                username={username}
                email={session.user.email ?? ''}
                onSwitchAccount={() => setSwitching(true)}
              />
            )}
            {(screen === 'boosters' || screen === 'trades') && <ComingSoon screen={screen} />}
            <NavBar current={screen} onChange={setScreen} />
          </div>
        ) : (
          <AuthScreen
            currentUserId={session?.user.id}
            onCancel={session ? () => setSwitching(false) : undefined}
            onSignedIn={() => {
              setSwitching(false)
              setScreen('album')
            }}
          />
        ))}
    </main>
  )
}

const TITLES: Record<Screen, string> = {
  album: 'Album',
  boosters: 'Boosters',
  trades: 'Échanges',
  profile: 'Profil',
}

// Prototype : écran vide en attendant le vrai contenu
function ComingSoon({ screen }: { screen: Screen }) {
  return (
    <div className="animate-fade-in flex min-h-[70vh] flex-col items-center justify-center gap-2 px-5">
      <h1 className="font-title text-2xl tracking-[0.2em] uppercase">{TITLES[screen]}</h1>
      <p className="text-white/40">Bientôt disponible</p>
    </div>
  )
}

export default App
