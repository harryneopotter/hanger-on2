const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('Setting up Supabase Storage...');
    
    // Create the garment-images bucket
    const { data: bucket, error: bucketError } = await supabase.storage
      .createBucket('garment-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      });
    
    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error('Error creating bucket:', bucketError);
      return;
    }
    
    if (bucket) {
      console.log('✅ Created garment-images bucket');
    } else {
      console.log('✅ garment-images bucket already exists');
    }
    
    // Set up RLS policy for the bucket
    console.log('Storage setup complete!');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupStorage();