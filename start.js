/**
 * Custom start script for Festivv app
 * 
 * This script:
 * 1. Verifies that all required environment variables are set
 * 2. Starts the Expo development server with the correct configuration
 */

const { spawn } = require('child_process');
const { checkEnvironmentVariables } = require('./verify-supabase-config');
const chalk = require('chalk') || { green: (text) => text, red: (text) => text, yellow: (text) => text };

// Check if dotenv-cli is installed
try {
  require.resolve('dotenv-cli');
} catch (e) {
  console.error(chalk.red('❌ dotenv-cli is not installed. Please run: npm install -D dotenv-cli'));
  process.exit(1);
}

console.log(chalk.green('🚀 Starting Festivv app...'));

// Verify environment variables
console.log(chalk.yellow('\n📋 Verifying environment variables...'));
const isConfigValid = checkEnvironmentVariables();

if (!isConfigValid) {
  console.error(chalk.red('\n❌ Environment variable verification failed. Please fix the issues above.'));
  console.log(chalk.yellow('💡 Tip: Make sure you have a .env.local file with all required variables.'));
  console.log(chalk.yellow('    You can copy .env.example to .env.local and fill in your values.'));
  process.exit(1);
}

// Start Expo with dotenv
console.log(chalk.green('\n✅ Environment variables verified. Starting Expo...'));

const startCommand = 'npx';
const args = ['dotenv', '-e', '.env.local', '--', 'expo', 'start'];

console.log(chalk.yellow(`\n$ ${startCommand} ${args.join(' ')}`));

// Spawn the process
const expoProcess = spawn(startCommand, args, { 
  stdio: 'inherit',
  shell: true
});

// Handle process exit
expoProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(chalk.red(`\n❌ Expo exited with code ${code}`));
    process.exit(code);
  }
});

// Handle process errors
expoProcess.on('error', (err) => {
  console.error(chalk.red(`\n❌ Failed to start Expo: ${err.message}`));
  process.exit(1);
}); 