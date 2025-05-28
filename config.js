// config.js - Secure Environment Configuration
// This file contains your app configuration
// Add this file to .gitignore for better security

window.ENV = {
    // Supabase Configuration
    SUPABASE_URL: 'https://ukppxddltmybscvnxsgp.supabase.co',
    
    // IMPORTANT: Rotate this key in your Supabase dashboard!
    // This is your current anon key - you should replace it with a new one
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcHB4ZGRsdG15YnNjdm54c2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzc2MDIsImV4cCI6MjA2Mzk1MzYwMn0.MlOzU1Q24t8poJvbJdC42fI3IGGwFjH5N2PPpy0IBZE',
    
    // App Configuration
    APP_NAME: 'SEOtter',
    APP_VERSION: '2.0.0',
    
    // API Configuration
    API_BASE_URL: window.location.origin, // Uses current domain
    API_TIMEOUT: 30000, // 30 seconds
    
    // Feature Flags
    FEATURES: {
        AUTH_ENABLED: true,
        ANALYTICS_ENABLED: false,
        RATE_LIMITING: true,
        CACHING: true,
        DEBUG_MODE: false // Set to true for development
    },
    
    // UI Configuration
    UI: {
        THEME: 'ocean', // ocean, light, dark
        ANIMATIONS: true,
        NOTIFICATIONS: true,
        AUTO_SAVE: true
    },
    
    // Limits and Quotas
    LIMITS: {
        FREE_ANALYSES_PER_DAY: 3,
        PRO_ANALYSES_PER_DAY: 100,
        MAX_URL_LENGTH: 2048,
        REQUEST_TIMEOUT: 30000
    },
    
    // Social/External Links
    LINKS: {
        DOCUMENTATION: 'https://seotter.com/docs',
        SUPPORT: 'https://seotter.com/support',
        GITHUB: 'https://github.com/yourusername/seotter',
        TWITTER: 'https://twitter.com/seotter'
    }
}

// Environment-specific overrides
if (window.location.hostname === 'localhost') {
    // Development environment
    window.ENV.FEATURES.DEBUG_MODE = true
    window.ENV.API_BASE_URL = 'http://localhost:3000'
    console.log('🔧 Development mode enabled')
}

// Security check - ensure all required config is present
const requiredConfig = ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
const missingConfig = requiredConfig.filter(key => !window.ENV[key])

if (missingConfig.length > 0) {
    console.error('❌ Missing required configuration:', missingConfig)
    alert('App configuration error. Please check console for details.')
}

// Success message
console.log('✅ SEOtter configuration loaded successfully')
if (window.ENV.FEATURES.DEBUG_MODE) {
    console.log('🔍 Debug info:', {
        version: window.ENV.APP_VERSION,
        environment: window.location.hostname === 'localhost' ? 'development' : 'production',
        features: window.ENV.FEATURES
    })
}
