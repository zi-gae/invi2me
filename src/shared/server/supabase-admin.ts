import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client for server-only operations (e.g. Storage upload).
 * Never expose this on the client side.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE env vars for admin client');
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
