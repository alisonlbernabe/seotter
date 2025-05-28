// auth.js - Secure version
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only use public anon key, never expose service role key
export const supabase = createClient(supabaseUrl, supabaseKey)
