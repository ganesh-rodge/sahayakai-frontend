import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Reads Supabase credentials from Vite env. Returns a client or null if not configured.
const supabaseUrl = import.meta?.env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

if (typeof supabaseUrl === 'string' && supabaseUrl && typeof supabaseAnonKey === 'string' && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    // If createClient throws (e.g., bad params), keep supabase null
    supabase = null;
  }
}

export default supabase;
