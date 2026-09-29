import { useEffect, useState, type FormEvent } from 'react'
import { forgetAccount, loadAccounts, setRemember, shouldRemember, type SavedAccount } from '../lib/accounts'
import { authErrorMessage, isUsernameAvailable, PASSWORD_MIN, USERNAME_PATTERN } from '../lib/auth'
import { supabase } from '../lib/supabase'

// pick : choix parmi les comptes déjà utilisés sur cet appareil
type Mode = 'pick' | 'signup' | 'login'

type Props = {
  // joueur déjà connecté qui veut changer de compte
  currentUserId?: string
  onCancel?: () => void
  onSignedIn?: () => void
}

// Écran d'inscription et de connexion
export function AuthScreen({ currentUserId, onCancel, onSignedIn }: Props) {
  const [accounts, setAccounts] = useState(loadAccounts)
  const [mode, setMode] = useState<Mode>(accounts.length > 0 ? 'pick' : 'signup')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRememberChecked] = useState(shouldRemember)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  // null = pas encore vérifié
  const [available, setAvailable] = useState<boolean | null>(null)

  const name = username.trim()
  const nameValid = USERNAME_PATTERN.test(name)

  // vérifie si le pseudo est libre, un court instant après la frappe
  useEffect(() => {
    if (mode !== 'signup' || !nameValid) return
    let cancelled = false
    const timer = setTimeout(async () => {
      const ok = await isUsernameAvailable(name)
      if (!cancelled) setAvailable(ok)
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [mode, name, nameValid])

  let nameHint: string | null = null
  if (mode === 'signup' && name.length > 0) {
    if (!nameValid) nameHint = '2 à 16 caractères : lettres, chiffres, espaces, - et _'
    else if (available === false) nameHint = 'Ce pseudo est déjà pris.'
  }

  const canSubmit =
    !busy &&
    email.trim() !== '' &&
    password.length >= PASSWORD_MIN &&
    (mode === 'login' || (nameValid && available !== false))

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setBusy(true)
    setError(null)
    setRemember(remember)
    const { error } =
      mode === 'signup'
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { username: name } },
          })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    // en cas de succès, l'appli passe toute seule à l'écran suivant
    if (error) setError(authErrorMessage(error.message))
    else onSignedIn?.()
  }

  async function pick(account: SavedAccount) {
    if (account.id === currentUserId) return onSignedIn?.()
    setBusy(true)
    setError(null)
    setRemember(true)
    const { error } = await supabase.auth.setSession({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    })
    setBusy(false)
    if (!error) return onSignedIn?.()
    // jeton refusé (déconnecté ailleurs, mot de passe changé…) : on redemande le mot de passe
    forget(account.id)
    setEmail(account.email)
    setMode('login')
    setError('Ta session a expiré, reconnecte-toi.')
  }

  function forget(id: string) {
    forgetAccount(id)
    setAccounts(loadAccounts())
  }

  function goTo(next: Mode) {
    setMode(next)
    setError(null)
  }

  return (
    <div className="animate-fade-in flex min-h-full flex-col justify-center px-8 py-10">
      <img src="/logo-light.webp" alt="Bannished" className="mx-auto mb-10 w-56" />

      <h1 className="font-title mb-8 text-center text-xl tracking-[0.2em] uppercase">
        {mode === 'pick' ? 'Choisis ton compte' : mode === 'signup' ? 'Crée ton compte' : 'Connexion'}
      </h1>

      {mode === 'pick' ? (
        <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center rounded-2xl border border-white/10 bg-white/5">
              <button onClick={() => pick(account)} disabled={busy} className="flex-1 px-5 py-3 text-left">
                <p className="text-xl leading-tight">{account.username}</p>
                <p className="text-sm text-white/40">
                  {account.email}
                  {account.id === currentUserId && ' · connecté'}
                </p>
              </button>
              <button
                onClick={() => forget(account.id)}
                aria-label={`Oublier ${account.username}`}
                className="px-4 py-3 text-2xl text-white/30">
                ×
              </button>
            </div>
          ))}
          {error && <p className="text-blood text-center">{error}</p>}
        </div>
      ) : (
        <form onSubmit={submit} className="mx-auto flex w-full max-w-sm flex-col gap-6">
          {mode === 'signup' && (
            <label className="field">
              <span>Pseudo</span>
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setAvailable(null)
                }}
                maxLength={16}
                autoComplete="username"
                autoCapitalize="words"
                required
              />
              {nameHint && <small className="text-blood">{nameHint}</small>}
            </label>
          )}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoCapitalize="none"
              required
            />
          </label>

          <label className="field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={PASSWORD_MIN}
              required
            />
            {mode === 'signup' && (
              <small className="text-white/40">Au moins {PASSWORD_MIN} caractères</small>
            )}
          </label>

          <label className="flex items-center gap-3 text-white/60">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRememberChecked(e.target.checked)}
              className="h-5 w-5 accent-[var(--color-blood)]"
            />
            Rester connecté
          </label>

          {error && <p className="text-blood text-center">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-blood mt-2 rounded-full py-3 text-lg tracking-wide text-white transition-opacity disabled:opacity-30"
          >
            {busy ? '…' : mode === 'signup' ? 'Commencer' : 'Se connecter'}
          </button>
        </form>
      )}

      <div className="mx-auto mt-8 flex flex-col items-center gap-4 text-white/50">
        {mode === 'pick' ? (
          <button onClick={() => goTo('login')} className="underline underline-offset-4">
            Utiliser un autre compte
          </button>
        ) : (
          <button onClick={() => goTo(mode === 'signup' ? 'login' : 'signup')} className="underline underline-offset-4">
            {mode === 'signup' ? 'J’ai déjà un compte' : 'Créer un compte'}
          </button>
        )}
        {mode !== 'pick' && accounts.length > 0 && (
          <button onClick={() => goTo('pick')} className="underline underline-offset-4">
            Mes comptes
          </button>
        )}
        {onCancel && <button onClick={onCancel}>Annuler</button>}
      </div>
    </div>
  )
}
