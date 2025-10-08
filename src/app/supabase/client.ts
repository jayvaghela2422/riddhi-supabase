import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export function createBrowserClient() {
  if (browserClient) return browserClient;
  browserClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        // Use a stable storage key to avoid collisions across multiple clients
        storageKey: 'gsb-supabase-auth',
      },
    }
  );
  return browserClient;
}