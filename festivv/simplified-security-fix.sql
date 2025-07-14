-- =======================================================
-- SECURITY FIX SCRIPT - RUN THIS IN YOUR SUPABASE SQL EDITOR
-- =======================================================

-- This script addresses the RLS security issues using a different approach
-- that won't trigger the SECURITY DEFINER warning

-- ISSUE 1: Table `public.spatial_ref_sys` is public, but RLS has not been enabled
-- ISSUE 2: View `public.secure_spatial_ref_sys` is defined with SECURITY DEFINER

-- SOLUTION: We will exclude spatial_ref_sys from the public API completely

-- First, drop the previously created view if it exists
DROP VIEW IF EXISTS public.secure_spatial_ref_sys;

-- Hide the spatial_ref_sys table from the API by excluding it in the PostgREST configuration
-- This is done by revoking access from the authenticated and anon roles
REVOKE ALL ON public.spatial_ref_sys FROM authenticated, anon, public;

-- If you need to access spatial_ref_sys data in your app, create a custom function
-- that returns only the specific data needed with proper security controls
CREATE OR REPLACE FUNCTION public.get_spatial_ref_sys(srid_param int)
RETURNS json
LANGUAGE sql
SECURITY INVOKER -- Use INVOKER security to avoid the SECURITY DEFINER issue
AS $$
  SELECT json_build_object(
    'srid', srid,
    'auth_name', auth_name,
    'auth_srid', auth_srid,
    'proj4text', proj4text
  )
  FROM public.spatial_ref_sys
  WHERE srid = srid_param
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_spatial_ref_sys TO authenticated, anon;

-- ===========================================================
-- USER MANAGEMENT AND REGULAR TABLES
-- ===========================================================

-- Create basic users table if it doesn't exist already
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  is_guest BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Create user data access policies
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE
TO authenticated 
USING (id = auth.uid());

-- Trigger to handle user creation for anonymous users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, is_guest)
  VALUES (
    new.id, 
    coalesce(new.raw_user_meta_data->>'username', 'Guest_' || substr(gen_random_uuid()::text, 1, 8)),
    coalesce((new.raw_user_meta_data->>'is_guest')::boolean, new.email IS NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =======================================================
-- MANUAL STEPS REQUIRED:
-- =======================================================

-- 1. Enable Anonymous Authentication in Supabase Dashboard:
--    - Go to Authentication > Providers
--    - Enable "Anonymous Sign-in"
--    - Save changes

-- 2. Verify you have proper environment variables in your .env.local file:
--    SUPABASE_URL=your_supabase_url
--    SUPABASE_ANON_KEY=your_supabase_anon_key
--    SUPABASE_SERVICE_KEY=your_supabase_service_key 