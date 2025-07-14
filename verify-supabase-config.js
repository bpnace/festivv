/**
 * Supabase Configuration Verification Script
 * 
 * This script checks if all required Supabase environment variables are present
 * and properly formatted. Run this script before starting your app to ensure
 * your configuration is correct.
 */

require('dotenv').config({ path: '.env.local' });

const requiredVars = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
];

const optionalVars = [
  'SUPABASE_SERVICE_KEY',
];

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function checkEnvironmentVariables() {
  console.log('🔍 Checking Supabase environment variables...');
  
  let hasErrors = false;
  let hasWarnings = false;
  
  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName];
    
    if (!value) {
      console.error(`❌ Missing required environment variable: ${varName}`);
      hasErrors = true;
      continue;
    }
    
    if (varName === 'EXPO_PUBLIC_SUPABASE_URL' && !validateUrl(value)) {
      console.error(`❌ Invalid URL format for ${varName}: ${value}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName} is set`);
    }
  }
  
  // Check optional variables
  for (const varName of optionalVars) {
    const value = process.env[varName];
    
    if (!value) {
      console.warn(`⚠️ Optional environment variable not set: ${varName}`);
      hasWarnings = true;
    } else {
      console.log(`✅ ${varName} is set`);
    }
  }
  
  // Final result
  if (hasErrors) {
    console.error('\n❌ Supabase configuration has errors. Please fix them before running the app.');
    return false;
  } else if (hasWarnings) {
    console.warn('\n⚠️ Supabase configuration has warnings. Some features may not work properly.');
    return true;
  } else {
    console.log('\n✅ Supabase configuration is valid!');
    return true;
  }
}

// Run the check
const isValid = checkEnvironmentVariables();

// Export for use in other scripts
module.exports = { checkEnvironmentVariables };

// If running directly, exit with appropriate code
if (require.main === module) {
  process.exit(isValid ? 0 : 1);
} 