import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function clearTesters() {
    console.log('Initiating database purge...');
    const { data, error } = await supabase
        .from('registrations')
        .delete()
        .neq('full_name', 'RESERVED_SYSTEM_USER'); // Delete all

    if (error) {
        console.error('Purge failed:', error);
    } else {
        console.log('Database cleared of all tester data.');
    }
}

clearTesters();
