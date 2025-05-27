// auth.js - SEOtter User Authentication
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2'

const supabaseUrl = 'https://ukppxddltmybscvnxsgp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcHB4ZGRsdG15YnNjdm54c2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzc2MDIsImV4cCI6MjA2Mzk1MzYwMn0.MlOzU1Q24t8poJvbJdC42fI3IGGwFjH5N2PPpy0IBZE'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Current user state
let currentUser = null
let userProfile = null

// Initialize auth
export async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
        currentUser = session.user
        userProfile = await getUserProfile(session.user.id)
        updateUIForLoggedInUser()
    } else {
        updateUIForLoggedOutUser()
    }
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            currentUser = session.user
            userProfile = await getUserProfile(session.user.id)
            updateUIForLoggedInUser()
        } else {
            currentUser = null
            userProfile = null
            updateUIForLoggedOutUser()
        }
    })
}

// Get user profile
async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('seotter_users')
        .select('*')
        .eq('id', userId)
        .single()
    
    if (error) {
        console.error('Error fetching user profile:', error)
        return null
    }
    return data
}

// Sign up new user
export async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    })
    
    if (error) {
        throw new Error(error.message)
    }
    
    return data
}

// Sign in user
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    
    if (error) {
        throw new Error(error.message)
    }
    
    return data
}

// Sign out user
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        throw new Error(error.message)
    }
}

// Check if user can analyze (usage limits)
export async function canUserAnalyze() {
    if (!currentUser || !userProfile) return false
    
    // Pro and Agency users have unlimited analyses
    if (userProfile.subscription_level === 'pro' || userProfile.subscription_level === 'agency') {
        return true
    }
    
    // Free users get 3 per day
    const today = new Date().toISOString().split('T')[0]
    if (userProfile.last_analysis_date !== today) {
        // Reset daily count
        await supabase
            .from('seotter_users')
            .update({ 
                analyses_today: 0, 
                last_analysis_date: today 
            })
            .eq('id', currentUser.id)
        
        userProfile.analyses_today = 0
        userProfile.last_analysis_date = today
    }
    
    return userProfile.analyses_today < 3
}

// Record an analysis
export async function recordAnalysis(url, score, analysisData) {
    if (!currentUser) return
    
    // Insert analysis record
    await supabase
        .from('seotter_analyses')
        .insert({
            user_id: currentUser.id,
            url,
            score,
            analysis_data: analysisData
        })
    
    // Update user stats
    await supabase
        .from('seotter_users')
        .update({
            analyses_today: userProfile.analyses_today + 1,
            total_analyses: userProfile.total_analyses + 1
        })
        .eq('id', currentUser.id)
    
    // Update local profile
    userProfile.analyses_today += 1
    userProfile.total_analyses += 1
    
    updateUsageDisplay()
}

// Get user's analysis history
export async function getUserAnalyses(limit = 10) {
    if (!currentUser) return []
    
    const { data, error } = await supabase
        .from('seotter_analyses')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(limit)
    
    if (error) {
        console.error('Error fetching analyses:', error)
        return []
    }
    
    return data
}

// UI Updates
function updateUIForLoggedInUser() {
    document.getElementById('authSection')?.classList.add('hidden')
    document.getElementById('userSection')?.classList.remove('hidden')
    document.getElementById('userEmail')?.textContent = currentUser?.email
    updateUsageDisplay()
}

function updateUIForLoggedOutUser() {
    document.getElementById('authSection')?.classList.remove('hidden')
    document.getElementById('userSection')?.classList.add('hidden')
}

function updateUsageDisplay() {
    if (!userProfile) return
    
    const usageEl = document.getElementById('usageDisplay')
    if (!usageEl) return
    
    if (userProfile.subscription_level === 'free') {
        const remaining = 3 - userProfile.analyses_today
        usageEl.innerHTML = `
            <div class="usage-info">
                🦦 <strong>${remaining}/3</strong> free analyses today
                ${remaining === 0 ? '<br><span style="color: var(--danger);">Upgrade for unlimited!</span>' : ''}
            </div>
        `
    } else {
        usageEl.innerHTML = `
            <div class="usage-info">
                ✨ <strong>Unlimited</strong> analyses (${userProfile.subscription_level})
            </div>
        `
    }
}

// Export current user state
export function getCurrentUser() {
    return currentUser
}

export function getUserProfile() {
    return userProfile
}
