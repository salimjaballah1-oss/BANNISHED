import { supabase } from '../lib/supabase'

type Props = { username: string }

// Écran provisoire une fois connecté, en attendant l'album
export function Home({ username }: Props) {
  return (
    <div className="animate-fade-in flex min-h-full flex-col items-center justify-center gap-10 px-8">
      <p className="text-center text-3xl">
        Salut, <span className="text-blood">{username}</span>
      </p>
      <button onClick={() => supabase.auth.signOut()} className="text-white/50 underline underline-offset-4">
        Se déconnecter
      </button>
    </div>
  )
}
