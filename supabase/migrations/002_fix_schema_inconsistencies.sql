-- Fix foreign key references to use public.profiles instead of auth.users
-- and ensure ID types are consistent

-- Drop existing foreign key constraints that reference auth.users
ALTER TABLE garments DROP CONSTRAINT IF EXISTS garments_user_id_fkey;
ALTER TABLE tags DROP CONSTRAINT IF EXISTS tags_user_id_fkey;
ALTER TABLE collections DROP CONSTRAINT IF EXISTS collections_user_id_fkey;

-- Update user_id columns to TEXT type to match profiles table
ALTER TABLE garments ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE tags ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE collections ALTER COLUMN user_id TYPE TEXT;

-- Update ID columns to TEXT type to match NextAuth schema
ALTER TABLE garments ALTER COLUMN id TYPE TEXT;
ALTER TABLE garment_images ALTER COLUMN id TYPE TEXT;
ALTER TABLE garment_images ALTER COLUMN garment_id TYPE TEXT;
ALTER TABLE tags ALTER COLUMN id TYPE TEXT;
ALTER TABLE garment_tags ALTER COLUMN garment_id TYPE TEXT;
ALTER TABLE garment_tags ALTER COLUMN tag_id TYPE TEXT;
ALTER TABLE collections ALTER COLUMN id TYPE TEXT;
ALTER TABLE collection_garments ALTER COLUMN collection_id TYPE TEXT;
ALTER TABLE collection_garments ALTER COLUMN garment_id TYPE TEXT;
ALTER TABLE collection_rules ALTER COLUMN id TYPE TEXT;
ALTER TABLE collection_rules ALTER COLUMN collection_id TYPE TEXT;

-- Set default values for ID columns to use cuid() instead of uuid_generate_v4()
-- Note: We'll handle this in the application layer since cuid() is not available in PostgreSQL
ALTER TABLE garments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE garment_images ALTER COLUMN id DROP DEFAULT;
ALTER TABLE tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE collections ALTER COLUMN id DROP DEFAULT;
ALTER TABLE collection_rules ALTER COLUMN id DROP DEFAULT;

-- Re-add foreign key constraints to reference public.profiles
ALTER TABLE garments ADD CONSTRAINT garments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE tags ADD CONSTRAINT tags_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE collections ADD CONSTRAINT collections_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Grant permissions to authenticated users
GRANT ALL PRIVILEGES ON garments TO authenticated;
GRANT ALL PRIVILEGES ON garment_images TO authenticated;
GRANT ALL PRIVILEGES ON tags TO authenticated;
GRANT ALL PRIVILEGES ON garment_tags TO authenticated;
GRANT ALL PRIVILEGES ON collections TO authenticated;
GRANT ALL PRIVILEGES ON collection_garments TO authenticated;
GRANT ALL PRIVILEGES ON collection_rules TO authenticated;
GRANT ALL PRIVILEGES ON profiles TO authenticated;
GRANT ALL PRIVILEGES ON accounts TO authenticated;
GRANT ALL PRIVILEGES ON sessions TO authenticated;
GRANT ALL PRIVILEGES ON verification_tokens TO authenticated;

-- Grant read access to anon users for public data
GRANT SELECT ON profiles TO anon;