
// Initialize Supabase - Updated: 2026-02-13 20:40
const SUPABASE_URL = 'https://kfzujigpgmyywdfafagi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-bvXQioPjNBauiIQuikGNA_diyKQlyJ';

console.log('=== SUPABASE CONFIG ===');
console.log('URL:', SUPABASE_URL);
console.log('Key prefix:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
console.log('=====================');

// Ensure we don't re-initialize if not needed, but we do need to override the library object with the client instance
// The CDN loads the library into 'window.supabase'
// We want 'window.supabase' to be the initialized client for ease of use

if (window.supabase && window.supabase.createClient) {
    // It's the library, initialize the client
    try {
        window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client initialized successfully');
        console.log('✅ Connected to:', SUPABASE_URL);
    } catch (error) {
        console.error('❌ Failed to initialize Supabase client:', error);
    }
} else if (!window.supabase) {
    console.error('❌ Supabase library not loaded. Check CDN script.');
}
