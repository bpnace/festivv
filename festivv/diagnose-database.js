const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function diagnoseProblem() {
  console.log('🔍 Diagnosing Database Issues...\n');

  try {
    // Check what actually exists
    console.log('1️⃣ Checking enum types...');
    const { data: types, error: typesError } = await supabase.rpc('sql', {
      query: `
        SELECT typname as name, typtype as type 
        FROM pg_type 
        WHERE typname IN ('visibility_type', 'packing_category', 'subscription_tier', 'user_role')
        ORDER BY typname;
      `
    });
    
    if (typesError) {
      console.log('❌ Cannot check types:', typesError.message);
    } else {
      console.log('Available enum types:', types?.map(t => t.name).join(', ') || 'none');
    }

    // Check specific table errors
    console.log('\n2️⃣ Checking specific table creation issues...');
    
    // Try to create groups table manually to see the error
    const { error: groupsError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS test_groups (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          admin_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
          invite_code TEXT UNIQUE NOT NULL
        );
      `
    });
    
    if (groupsError) {
      console.log('❌ Groups table creation failed:', groupsError.message);
    } else {
      console.log('✅ Test groups table created successfully');
      // Clean up
      await supabase.rpc('sql', { query: 'DROP TABLE IF EXISTS test_groups;' });
    }

    // Check what tables actually exist
    console.log('\n3️⃣ Listing all existing tables...');
    const { data: tables, error: tablesError } = await supabase.rpc('sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `
    });
    
    if (tablesError) {
      console.log('❌ Cannot list tables:', tablesError.message);
    } else {
      console.log('Existing tables:', tables?.map(t => t.table_name).join(', ') || 'none');
    }

  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
    console.log('\n💡 Let me try a simpler approach...');
    
    // Simple test - try to query each missing table directly
    const missingTables = ['groups', 'group_members', 'photos', 'packing_lists', 'packing_items', 'user_locations'];
    
    for (const table of missingTables) {
      try {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: exists`);
        }
      } catch (e) {
        console.log(`❌ ${table}: ${e.message}`);
      }
    }
  }
}

diagnoseProblem().then(() => process.exit(0));
