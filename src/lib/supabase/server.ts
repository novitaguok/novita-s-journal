import { createClient } from "@supabase/supabase-js";

// Server-side client. Uses the service role key so the API routes can bypass
// Row Level Security and read/write all rows. Never import this from client
// components — it would leak the service key.
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key);
}
