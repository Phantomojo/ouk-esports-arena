import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient;

const isConfigured = !!supabaseUrl && !!supabaseAnonKey && !supabaseUrl?.includes('placeholder');

if (!isConfigured) {
    console.warn('[Supabase] Environment variables missing. Database operations will fail.');
}

try {
    supabase = createClient(
        supabaseUrl || 'https://invalid-url.supabase.co',
        supabaseAnonKey || 'invalid-key'
    );

    if (isConfigured) {
        console.log('[Supabase] Client initialized successfully');
    }
} catch (error) {
    console.error('[Supabase] Failed to initialize client:', error);
    supabase = createClient('https://invalid.supabase.co', 'invalid');
}

export { supabase, isConfigured };
