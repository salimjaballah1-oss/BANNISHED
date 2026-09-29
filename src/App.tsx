import { useState } from 'react'
import { NavBar, type Tab } from './components/NavBar'
import { Splash } from './components/Splash'
import { useGame } from './lib/useGame'
import { BoostersScreen } from './screens/BoostersScreen'
import { CollectionScreen } from './screens/CollectionScreen'
import { HomeScreen } from './screens/HomeScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { RankingScreen } from './screens/RankingScreen'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [tab, setTab] = useState<Tab>('home')
  // la partie vit ici : le revenu automatique continue quel que soit l'onglet
  const game = useGame()

  function open(next: Tab) {
    setTab(next)
    window.scrollTo(0, 0)
  }

  return (
    <main className="min-h-full text-ink pt-[env(safe-area-inset-top)]">
      {/* le bureau (public/desk.webp), fixe derrière les feuilles qui défilent */}
      <div className="fixed inset-0 -z-10 bg-desk bg-[url(/desk.webp)] bg-cover bg-center" aria-hidden />
      {showSplash ? (
        <Splash onDone={() => setShowSplash(false)} />
      ) : (
        <>
          {/* pb-28 : la barre du bas ne doit pas cacher la fin de l'écran */}
          <div key={tab} className="animate-fade-in mx-auto max-w-md px-4 pt-5 pb-28">
            {tab === 'home' && <HomeScreen game={game} onOpenBoosters={() => open('boosters')} />}
            {tab === 'boosters' && <BoostersScreen game={game} />}
            {tab === 'collection' && <CollectionScreen game={game} />}
            {tab === 'ranking' && <RankingScreen game={game} />}
            {tab === 'profile' && <ProfileScreen game={game} />}
          </div>
          <NavBar current={tab} onChange={open} />
        </>
      )}
    </main>
  )
}

export default App
