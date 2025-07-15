// Script to verify Supabase configuration
require('dotenv').config({ path: '.env.local' });
const chalk = require('chalk');
const { createClient } = require('@supabase/supabase-js');

console.log(chalk.blue('🔍 Verifying Supabase Configuration'));

// Check for environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log('\n📋 Environment Variables:');
console.log(`EXPO_PUBLIC_SUPABASE_URL: ${SUPABASE_URL ? chalk.green('✓ Found') : chalk.red('✗ Missing')}`);
console.log(`EXPO_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? chalk.green('✓ Found') : chalk.red('✗ Missing')}`);
console.log(`SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY ? chalk.green('✓ Found') : chalk.red('✗ Missing')}`);

// Check if variables are empty
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log(chalk.red('\n❌ Error: Missing required environment variables'));
  console.log(chalk.yellow('\nPlease create a .env.local file with the following variables:'));
  console.log(chalk.gray(`
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key (optional)
  `));
  process.exit(1);
}

// Try to create a Supabase client
console.log('\n🔌 Testing Supabase Connection...');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test authentication
async function testAuth() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log(chalk.red(`\n❌ Auth Error: ${error.message}`));
      return false;
    }
    
    console.log(chalk.green('\n✓ Auth API Connection Successful'));
    return true;
  } catch (err) {
    console.log(chalk.red(`\n❌ Connection Error: ${err.message}`));
    return false;
  }
}

// Test database
async function testDatabase() {
  try {
    // Try to access a public table
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log(chalk.yellow('\n⚠️ Table "users" does not exist. You may need to run migrations.'));
      } else {
        console.log(chalk.red(`\n❌ Database Error: ${error.message}`));
      }
      return false;
    }
    
    console.log(chalk.green('\n✓ Database Connection Successful'));
    return true;
  } catch (err) {
    console.log(chalk.red(`\n❌ Database Error: ${err.message}`));
    return false;
  }
}

// Test anonymous sign-up
async function testAnonymousSignUp() {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    
    if (error) {
      console.log(chalk.red(`\n❌ Anonymous Sign-In Error: ${error.message}`));
      
      if (error.message.includes('Anonymous sign-ins are disabled')) {
        console.log(chalk.yellow('\n⚠️ Anonymous sign-ins are disabled. Enable them in Supabase Dashboard > Authentication > Providers.'));
      }
      
      return false;
    }
    
    console.log(chalk.green('\n✓ Anonymous Sign-In Successful'));
    return true;
  } catch (err) {
    console.log(chalk.red(`\n❌ Anonymous Sign-In Error: ${err.message}`));
    return false;
  }
}

// Run all tests
async function runTests() {
  const authSuccess = await testAuth();
  const dbSuccess = await testDatabase();
  const anonSuccess = await testAnonymousSignUp();
  
  console.log('\n📊 Summary:');
  console.log(`Auth API: ${authSuccess ? chalk.green('✓ Working') : chalk.red('✗ Failed')}`);
  console.log(`Database: ${dbSuccess ? chalk.green('✓ Working') : chalk.yellow('⚠️ Check Schema')}`);
  console.log(`Anonymous Auth: ${anonSuccess ? chalk.green('✓ Working') : chalk.yellow('⚠️ Disabled')}`);
  
  if (authSuccess) {
    console.log(chalk.green('\n✅ Supabase configuration is valid!'));
    
    if (!dbSuccess) {
      console.log(chalk.yellow('\nℹ️ You may need to set up your database schema.'));
    }
    
    if (!anonSuccess) {
      console.log(chalk.yellow('\nℹ️ Anonymous authentication is not working. This is optional but useful for guest access.'));
    }
  } else {
    console.log(chalk.red('\n❌ Supabase configuration has issues. Please check your credentials.'));
  }
}

runTests().catch(err => {
  console.log(chalk.red(`\n❌ Unexpected Error: ${err.message}`));
  process.exit(1);
}); 