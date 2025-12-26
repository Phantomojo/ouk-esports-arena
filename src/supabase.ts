import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient;

const isConfigured = !!supabaseUrl && !!supabaseAnonKey && !supabaseUrl.includes('placeholder');

if (!isConfigured) {
    console.warn('[Supabase] CRITICAL: Environment variables missing or using placeholders. Database operations WILL fail.');
    console.warn('[Supabase] Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel settings.');
}

try {
    supabase = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key'
    );
    if (isConfigured) {
        console.log('[Supabase] Client initialized successfully');
    }
} catch (error) {
    console.error('[Supabase] Failed to initialize client:', error);
    // Create a minimal mock client to prevent app crash, 
    // but ops will fail with network errors as expected
    supabase = createClient(
        'https://invalid-url.supabase.co',
        'invalid-key'
    );
}

export { supabase, isConfigured };

