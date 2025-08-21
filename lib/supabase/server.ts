import { createClient } from "@supabase/supabase-js"

export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them in your Vercel Project Settings > Environment Variables.",
    )
  }

  // Service-role client (server only). Bypasses RLS for secure inserts.
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
