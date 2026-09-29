import type { Session } from '@supabase/supabase-js'

// Comptes mémorisés sur cet appareil, pour s'y reconnecter en un geste
export type SavedAccount = {
  id: string
  email: string
  username: string
  access_token: string
  refresh_token: string
}

const ACCOUNTS_KEY = 'bannishcard:accounts'
const REMEMBER_KEY = 'bannishcard:remember'

export function loadAccounts(): SavedAccount[] {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function storeAccounts(accounts: SavedAccount[]) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch {
    // stockage indisponible : les comptes ne seront simplement pas mémorisés
  }
}

export function saveAccount(session: Session, username: string) {
  const account: SavedAccount = {
    id: session.user.id,
    email: session.user.email ?? '',
    username,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  }
  storeAccounts([account, ...loadAccounts().filter((a) => a.id !== account.id)])
}

// Supabase change de jeton à chaque rafraîchissement et refuse les anciens :
// il faut toujours garder le dernier pour pouvoir revenir sur ce compte plus tard
export function updateAccountTokens(session: Session) {
  const accounts = loadAccounts()
  const account = accounts.find((a) => a.id === session.user.id)
  if (!account) return
  account.access_token = session.access_token
  account.refresh_token = session.refresh_token
  storeAccounts(accounts)
}

export function forgetAccount(id: string) {
  storeAccounts(loadAccounts().filter((a) => a.id !== id))
}

// « Rester connecté » : coché par défaut
export function shouldRemember() {
  try {
    return localStorage.getItem(REMEMBER_KEY) !== '0'
  } catch {
    return true
  }
}

export function setRemember(remember: boolean) {
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0')
  } catch {
    // stockage indisponible
  }
}

// Où Supabase range la session : localStorage si « Rester connecté »,
// sinon sessionStorage, qui s'efface à la fermeture de l'onglet
export const sessionStorageAdapter = {
  getItem(key: string) {
    try {
      return localStorage.getItem(key) ?? sessionStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem(key: string, value: string) {
    try {
      const [keep, drop] = shouldRemember() ? [localStorage, sessionStorage] : [sessionStorage, localStorage]
      keep.setItem(key, value)
      drop.removeItem(key)
    } catch {
      // stockage indisponible : la session ne durera que le temps de la page
    }
  },
  removeItem(key: string) {
    try {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    } catch {
      // stockage indisponible
    }
  },
}
