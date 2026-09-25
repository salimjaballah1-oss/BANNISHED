import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export type Profile = { id: string; username: string }

// Session du joueur connecté et son profil. `loading` reste vrai tant qu'on ne sait pas encore s'il est connecté.
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (!newSession) {
        setProfile(null)
        setLoading(false)
        return
      }
      // on sort du rappel avant d'interroger la base, comme le recommande Supabase
      setTimeout(async () => {
        const { data: row } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', newSession.user.id)
          .single()
        setProfile(row)
        setLoading(false)
      })
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return { session, profile, loading }
}

// Règles du pseudo, les mêmes que dans la base
export const USERNAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 _-]{2,16}$/
export const PASSWORD_MIN = 6

export async function isUsernameAvailable(name: string) {
  const { data, error } = await supabase.rpc('username_available', { name })
  return error ? null : data === true
}

// Traduit les erreurs de Supabase en messages clairs
export function authErrorMessage(message: string) {
  if (/already registered/i.test(message)) return 'Un compte existe déjà avec cet email.'
  if (/invalid login credentials/i.test(message)) return 'Email ou mot de passe incorrect.'
  if (/database error saving new user/i.test(message)) return 'Ce pseudo est déjà pris.'
  if (/password/i.test(message)) return `Le mot de passe doit faire au moins ${PASSWORD_MIN} caractères.`
  if (/email/i.test(message) && /invalid/i.test(message)) return 'Cet email n’est pas valide.'
  if (/rate limit|too many/i.test(message)) return 'Trop de tentatives, réessaie dans quelques minutes.'
  return 'Une erreur est survenue, réessaie.'
}
