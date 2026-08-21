import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the service_role key, which bypasses Row Level
// Security — this must never be imported into client-side code.
export const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
