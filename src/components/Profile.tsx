import { forgetAccount } from '../lib/accounts'
import { supabase } from '../lib/supabase'

type Props = { userId: string; username: string; email: string; onSwitchAccount: () => void }

// Prototype du profil : pour l'instant, juste la gestion du compte
export function Profile({ userId, username, email, onSwitchAccount }: Props) {
  async function signOut() {
    // « local » : ne ferme que cette session, pas celles des autres appareils
    forgetAccount(userId)
    await supabase.auth.signOut({ scope: 'local' })
  }

  return (
    <div className="animate-fade-in mx-auto flex max-w-xl flex-col items-center px-5 pt-16">
      <img src="/logo-light.webp" alt="Bannished" className="mb-10 w-32" />
      <h1 className="font-title text-2xl tracking-[0.15em]">{username}</h1>
      <p className="mb-10 text-white/40">{email}</p>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <button onClick={onSwitchAccount} className="rounded-full border border-white/20 py-3 text-lg">
          Changer de compte
        </button>
        <button onClick={signOut} className="text-blood py-3 text-lg">
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
