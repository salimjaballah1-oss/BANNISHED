import { useState } from 'react'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <main className="h-full bg-night pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {showSplash && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-night animate-splash"
          onAnimationEnd={() => setShowSplash(false)}
        >
          <span className="text-3xl font-semibold tracking-[0.3em] uppercase">
            Bannishcard
          </span>
        </div>
      )}
    </main>
  )
}

export default App
