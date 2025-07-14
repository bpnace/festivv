# Festival Foto-App

A React Native mobile application for festival attendees to capture, share, and manage photos.

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- Expo CLI (`npm install -g expo-cli`)

### Environment Variables

The app requires Supabase credentials to function properly. These should be stored in a `.env.local` file in the project root:

```
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# App Configuration
APP_ENV=development
DEBUG_MODE=true
```

Where to find these keys:
- **SUPABASE_URL**: Your Supabase project URL (e.g., `https://abcdefghijklm.supabase.co`)
- **SUPABASE_ANON_KEY**: Found in Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public` key
- **SUPABASE_SERVICE_KEY**: Found in Supabase Dashboard → Project Settings → API → Project API keys → `service_role` key (keep this secure!)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` file with your Supabase credentials (see above)

## Running the App

To start the app:

```bash
npm start
```

This will:
1. Load environment variables from `.env.local` automatically
2. Start the Expo development server

To test your Supabase connection:

```bash
node test-connection.js
```

## Supabase Configuration

For the app to work properly, you need to:

1. **Run the security setup SQL script**:
   - Go to your Supabase Dashboard → SQL Editor
   - Open and run the `simplified-security-fix.sql` script included in this repo
   - This script:
     - Secures access to sensitive system tables
     - Creates necessary application tables with proper Row Level Security
     - Sets up triggers for automatic user profile creation

2. **Enable Anonymous Authentication**:
   - Go to Authentication > Providers > Anonymous Sign-in
   - Toggle it to enabled
   - Save changes

## Authentication

The app supports three authentication methods:

1. **Email/Password Login**: Standard authentication for registered users
2. **Registration**: New users can register with email, password, and username
3. **Guest Access**: Users can access the app without registration (some features may be limited)

### Guest Access

Guest access uses Supabase's anonymous authentication. No email verification is required. The application automatically creates user profile records for guest users.

## Troubleshooting

If you encounter authentication issues:

1. Verify your Supabase URL and keys are correct in `.env.local`
2. Make sure anonymous authentication is enabled in Supabase
3. Check that the SQL in `simplified-security-fix.sql` has been executed successfully
4. Run `node test-connection.js` to verify your connection is working
5. Check the Supabase logs for any specific database errors

### SQL Troubleshooting

When running the SQL script, you might encounter these issues:

- **Error with `IF NOT EXISTS` in policy creation**: Some PostgreSQL versions don't support the `IF NOT EXISTS` clause for policies. If you see this error, simply remove these words from each CREATE POLICY statement.
- **Permission errors with spatial_ref_sys**: This system table requires special handling. The script handles this by revoking direct access and creating a secure function instead. 