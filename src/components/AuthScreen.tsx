import { useEffect, useState, type FormEvent } from 'react'
import { authErrorMessage, isUsernameAvailable, PASSWORD_MIN, USERNAME_PATTERN } from '../lib/auth'
import { supabase } from '../lib/supabase'

type Mode = 'signup' | 'login'

// Écran d'inscription et de connexion
export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signup')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    const { error } =
      mode === 'signup'
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { username: name } },
          })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password })
    // en cas de succès, l'appli passe toute seule à l'écran suivant
    if (error) setError(authErrorMessage(error.message))
    setBusy(false)
  }

  function switchMode() {
    setMode(mode === 'signup' ? 'login' : 'signup')
    setError(null)
  }

  return (
    <div className="animate-fade-in flex min-h-full flex-col justify-center px-8 py-10">
      <img src="/logo-light.webp" alt="Bannished" className="mx-auto mb-10 w-56" />

      <h1 className="font-title mb-8 text-center text-xl tracking-[0.2em] uppercase">
        {mode === 'signup' ? 'Crée ton compte' : 'Connexion'}
      </h1>

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

        {error && <p className="text-blood text-center">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="bg-blood mt-2 rounded-full py-3 text-lg tracking-wide text-white transition-opacity disabled:opacity-30"
        >
          {busy ? '…' : mode === 'signup' ? 'Commencer' : 'Se connecter'}
        </button>
      </form>

      <button onClick={switchMode} className="mx-auto mt-8 text-white/50 underline underline-offset-4">
        {mode === 'signup' ? 'J’ai déjà un compte' : 'Créer un compte'}
      </button>
    </div>
  )
}
