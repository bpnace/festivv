/**
 * Supabase Connection Test Script
 * 
 * This script tests the connection to your Supabase instance using the
 * credentials from your .env.local file. It verifies:
 * 1. That the URL and keys are properly set
 * 2. That the connection can be established
 * 3. That authentication is working
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Check if credentials are set
console.log('🔍 Checking Supabase credentials...');

if (!supabaseUrl) {
  console.error('❌ Supabase URL not found in environment variables');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ Supabase anon key not found in environment variables');
  process.exit(1);
}

// Log credentials (masked for security)
console.log('📋 Supabase credentials:');
console.log(`- URL: ${supabaseUrl}`);
console.log(`- Anon Key: ${supabaseAnonKey.substring(0, 5)}...`);
if (supabaseServiceKey) {
  console.log(`- Service Key: ${supabaseServiceKey.substring(0, 5)}...`);
} else {
  console.warn('⚠️ Service key not found - admin operations will not be available');
}

// Create Supabase clients
console.log('\n🔌 Creating Supabase clients...');
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

// Create admin client if service key is available
const supabaseAdmin = supabaseServiceKey ?
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  }) : null;

// Test public client connection
console.log('\n🧪 Testing public client connection...');
async function testPublicConnection() {
  try {
    // Try to get session (should work even if not authenticated)
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error(`❌ Connection error: ${error.message}`);
      return false;
    }
    
    console.log('✅ Public client connection successful');
    
    // Try anonymous sign-in if available
    console.log('\n🔑 Testing anonymous authentication...');
    const { error: signInError } = await supabase.auth.signInAnonymously();
    
    if (signInError) {
      if (signInError.message === 'Anonymous sign-ins are disabled') {
        console.warn('⚠️ Anonymous authentication is disabled in your Supabase project');
        console.warn('   Enable it in Supabase Dashboard > Authentication > Providers > Anonymous Sign-in');
      } else {
        console.error(`❌ Anonymous authentication error: ${signInError.message}`);
      }
      return true; // Still return true as the connection itself works
    }
    
    console.log('✅ Anonymous authentication successful');
    return true;
  } catch (err) {
    console.error(`❌ Unexpected error: ${err.message}`);
    return false;
  }
}

// Test admin client connection if available
async function testAdminConnection() {
  if (!supabaseAdmin) {
    console.warn('\n⚠️ Skipping admin connection test (no service key provided)');
    return false;
  }
  
  console.log('\n🧪 Testing admin client connection...');
  try {
    // Try to access a protected table or function that requires admin privileges
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error(`❌ Admin connection error: ${error.message}`);
      return false;
    }
    
    console.log('✅ Admin client connection successful');
    return true;
  } catch (err) {
    console.error(`❌ Unexpected admin error: ${err.message}`);
    return false;
  }
}

// Run the tests
async function runTests() {
  const publicConnectionSuccess = await testPublicConnection();
  const adminConnectionSuccess = await testAdminConnection();
  
  console.log('\n📊 Test Results:');
  console.log(`- Public Client: ${publicConnectionSuccess ? '✅ Connected' : '❌ Failed'}`);
  console.log(`- Admin Client: ${adminConnectionSuccess ? '✅ Connected' : supabaseAdmin ? '❌ Failed' : '⚠️ Not Tested'}`);
  
  if (publicConnectionSuccess) {
    console.log('\n🎉 Your Supabase configuration is working!');
    if (!adminConnectionSuccess && supabaseAdmin) {
      console.warn('⚠️ Note: Admin operations may not work correctly');
    }
  } else {
    console.error('\n❌ Your Supabase configuration has issues that need to be fixed');
    process.exit(1);
  }
}

runTests(); 