// Load environment variables from .env.local
require('dotenv/config');

// Import Supabase client libraries
const { createClient } = require('@supabase/supabase-js');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

// Get Supabase URL and keys from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Validate credentials
if (!supabaseUrl) {
  console.error('❌ Missing SUPABASE_URL in .env.local');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ Missing SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.warn('⚠️ Missing SUPABASE_SERVICE_KEY in .env.local');
}

console.log('🔑 Credentials found:');
console.log(`- URL: ${supabaseUrl}`);
console.log(`- Anon Key: ${supabaseAnonKey.substring(0, 5)}...`);
if (supabaseServiceKey) {
  console.log(`- Service Key: ${supabaseServiceKey.substring(0, 5)}...`);
}

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  }
});

const supabaseAdmin = supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    }
  }) : null;

// Test connection
async function testConnection() {
  try {
    console.log('\n🔄 Testing Supabase connection...');
    
    // Test auth session
    console.log('📝 Testing auth API...');
    const { error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth API error:', authError.message);
    } else {
      console.log('✅ Auth API connection successful');
    }
    
    // Test database access - try users table
    console.log('\n📝 Testing database access...');
    console.log('Trying users table...');
    
    const { error: usersError } = await supabase.from('users').select('id').limit(1);
    
    if (usersError && usersError.message.includes('does not exist')) {
      console.warn('⚠️ users table not found. You need to run the SQL setup script.');
    } else if (usersError) {
      console.error('❌ Database error with users table:', usersError.message);
    } else {
      console.log('✅ users table access successful');
    }
    
    // Test anonymous authentication
    console.log('\n📝 Testing anonymous authentication...');
    const { error: anonError } = await supabase.auth.signInAnonymously();
    
    if (anonError) {
      if (anonError.message === 'Anonymous sign-ins are disabled') {
        console.error('❌ Anonymous authentication is disabled.');
        console.log('To enable:');
        console.log('1. Go to Supabase Dashboard > Authentication > Providers');
        console.log('2. Enable "Anonymous Sign-in"');
        console.log('3. Save changes');
      } else {
        console.error('❌ Anonymous authentication error:', anonError.message);
      }
    } else {
      console.log('✅ Anonymous authentication successful');
    }
    
    // Test service role if available
    if (supabaseAdmin) {
      console.log('\n📝 Testing service role access...');
      const { error: serviceError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (serviceError) {
        console.error('❌ Service role access error:', serviceError.message);
      } else {
        console.log('✅ Service role access successful');
      }
    }
    
    console.log('\n🔍 Summary:');
    console.log('Connection to Supabase URL:', supabaseUrl);
    console.log('Next steps:');
    console.log('1. Run the SQL script in simplified-security-fix.sql if you haven\'t already');
    console.log('2. Ensure anonymous authentication is enabled if you need guest access');
    
  } catch (err) {
    console.error('\n❌ Unexpected error testing connection:', err);
    process.exit(1);
  }
}

testConnection(); 