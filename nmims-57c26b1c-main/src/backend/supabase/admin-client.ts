import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

// Server-only client. Uses the service_role key, which bypasses Row Level
// Security — this must never be imported into client-side code.
//
// Realtime is never used here (only Storage), but supabase-js always
// constructs a RealtimeClient internally and it throws at construction time
// on Node <22 without a WebSocket implementation — supply one explicitly so
// this works on any Node LTS, not just 22+.
export const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: WebSocket as unknown as typeof globalThis.WebSocket },
  },
);
