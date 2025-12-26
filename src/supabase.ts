import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient;

// Detailed checks for diagnostics
const hasUrl = !!supabaseUrl;
const hasKey = !!supabaseAnonKey;
const isPlaceholder = supabaseUrl?.includes('placeholder') || supabaseUrl?.includes('your_supabase');
const isConfigured = hasUrl && hasKey && !isPlaceholder;

console.group('[Supabase] Technical Diagnostics');
console.log('URL Present:', hasUrl);
console.log('Key Present:', hasKey);
console.log('Is Placeholder:', isPlaceholder);
console.log('Final Configured Status:', isConfigured);
if (hasUrl) console.log('URL Prefix:', supabaseUrl?.substring(0, 15) + '...');
console.groupEnd();

if (!isConfigured) {
    console.error('[Supabase] CRITICAL FAILURE: Connection variables are missing or invalid.');
    console.error('[Supabase] REQUIRED ACTION: In Vercel, go to Settings > Environment Variables and add:');
    console.error('1. VITE_SUPABASE_URL (e.g., https://xyz.supabase.co)');
    console.error('2. VITE_SUPABASE_ANON_KEY (your public anon key)');
}

try {
    // If we're missing them, we'll still try to initialize but specify why it might fail
    const targetUrl = supabaseUrl || 'https://missing-url-in-vercel.supabase.co';
    const targetKey = supabaseAnonKey || 'missing-key-in-vercel';

    supabase = createClient(targetUrl, targetKey);

    if (isConfigured) {
        console.log('[Supabase] Client initialized successfully.');
    }
} catch (error) {
    console.error('[Supabase] Client creation failed hard:', error);
    supabase = createClient('https://invalid.supabase.co', 'invalid');
}

export { supabase, isConfigured };

