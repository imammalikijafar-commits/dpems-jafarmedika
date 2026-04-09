// ============================================================
// Supabase Browser Client
// Menggunakan @supabase/ssr untuk SSR compatibility
// Anon key — aman untuk client-side (RLS aktif di database)
// ============================================================
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}