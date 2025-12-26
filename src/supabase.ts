import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Log environment status for debugging (remove in production if sensitive)
console.log('[Supabase] URL configured:', !!supabaseUrl);
console.log('[Supabase] Key configured:', !!supabaseAnonKey);

let supabase: SupabaseClient;

try {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('[Supabase] Credentials missing. Using placeholder values - some features may not work.');
    }

    supabase = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key-that-will-not-work'
    );

    console.log('[Supabase] Client initialized successfully');
} catch (error) {
    console.error('[Supabase] Failed to initialize client:', error);
    // Create a minimal mock client to prevent crashes
    supabase = createClient(
        'https://placeholder.supabase.co',
        'placeholder-key'
    );
}

export { supabase };

