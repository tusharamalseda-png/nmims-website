import { createClient } from "@supabase/supabase-js";

// Used only for verifying login credentials against Supabase Auth.
// The anon key is safe to use here — it cannot bypass Row Level Security.
export const supabaseAuthClient = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
);
