// auth.js - Secure version
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Supabase configuration is incomplete')
}

// Only use public anon key, never expose service role key
export const supabase = createClient(supabaseUrl, supabaseKey)

// Optional: Auth helper functions
export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },
  
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}
