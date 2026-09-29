import { createClient } from '@supabase/supabase-js'
import { sessionStorageAdapter } from './accounts'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  { auth: { storage: sessionStorageAdapter, persistSession: true, autoRefreshToken: true } },
)
