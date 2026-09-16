import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

// Used only for verifying login credentials against Supabase Auth.
// The anon key is safe to use here — it cannot bypass Row Level Security.
//
// Realtime is never used here, but supabase-js always constructs a
// RealtimeClient internally and it throws at construction time on Node <22
// without a WebSocket implementation — supply one explicitly so this works
// on any Node LTS, not just 22+.
export const supabaseAuthClient = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
  { realtime: { transport: WebSocket as unknown as typeof globalThis.WebSocket } },
);
