// ============================================================
// Supabase Server Client
// Menggunakan @supabase/ssr untuk cookie-based auth
// Anon key — untuk normal server operations
// ============================================================
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — ignore setAll
          }
        },
      },
    }
  )
}

// ============================================================
// Admin Client (Service Role)
// BYPASS RLS — gunakan HATI-HATI hanya untuk admin/dashboard
// ============================================================
export function createAdminClient() {
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No-op untuk admin client
        },
      },
    }
  )
}