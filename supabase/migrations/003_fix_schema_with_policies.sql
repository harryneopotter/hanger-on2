-- Drop existing RLS policies that depend on user_id columns
DROP POLICY IF EXISTS "Users can manage tags for their own garments" ON garment_tags;
DROP POLICY IF EXISTS "Users can view their own garments" ON garments;
DROP POLICY IF EXISTS "Users can manage their own garments" ON garments;
DROP POLICY IF EXISTS "Users can view their own tags" ON tags;
DROP POLICY IF EXISTS "Users can manage their own tags" ON tags;
DROP POLICY IF EXISTS "Users can view their own collections" ON collections;
DROP POLICY IF EXISTS "Users can manage their own collections" ON collections;
DROP POLICY IF EXISTS "Users can view their own garment images" ON garment_images;
DROP POLICY IF EXISTS "Users can manage their own garment images" ON garment_images;
DROP POLICY IF EXISTS "Users can view their own collection garments" ON collection_garments;
DROP POLICY IF EXISTS "Users can manage their own collection garments" ON collection_garments;
DROP POLICY IF EXISTS "Users can view their own collection rules" ON collection_rules;
DROP POLICY IF EXISTS "Users can manage their own collection rules" ON collection_rules;

-- Drop existing foreign key constraints
ALTER TABLE garments DROP CONSTRAINT IF EXISTS garments_user_id_fkey;
ALTER TABLE tags DROP CONSTRAINT IF EXISTS tags_user_id_fkey;
ALTER TABLE collections DROP CONSTRAINT IF EXISTS collections_user_id_fkey;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_user_id_fkey;
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;

-- Update column types to TEXT and remove defaults
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE profiles ALTER COLUMN id DROP DEFAULT;

ALTER TABLE garments ALTER COLUMN id TYPE TEXT;
ALTER TABLE garments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE garments ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE garment_images ALTER COLUMN id TYPE TEXT;
ALTER TABLE garment_images ALTER COLUMN id DROP DEFAULT;
ALTER TABLE garment_images ALTER COLUMN garment_id TYPE TEXT;

ALTER TABLE tags ALTER COLUMN id TYPE TEXT;
ALTER TABLE tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE tags ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE garment_tags ALTER COLUMN garment_id TYPE TEXT;
ALTER TABLE garment_tags ALTER COLUMN tag_id TYPE TEXT;

ALTER TABLE collections ALTER COLUMN id TYPE TEXT;
ALTER TABLE collections ALTER COLUMN id DROP DEFAULT;
ALTER TABLE collections ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE collection_garments ALTER COLUMN collection_id TYPE TEXT;
ALTER TABLE collection_garments ALTER COLUMN garment_id TYPE TEXT;

ALTER TABLE collection_rules ALTER COLUMN id TYPE TEXT;
ALTER TABLE collection_rules ALTER COLUMN id DROP DEFAULT;
ALTER TABLE collection_rules ALTER COLUMN collection_id TYPE TEXT;

ALTER TABLE accounts ALTER COLUMN id TYPE TEXT;
ALTER TABLE accounts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE accounts ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE sessions ALTER COLUMN id TYPE TEXT;
ALTER TABLE sessions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE sessions ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE verification_tokens ALTER COLUMN token TYPE TEXT;

-- Re-add foreign key constraints
ALTER TABLE garments ADD CONSTRAINT garments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE tags ADD CONSTRAINT tags_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE collections ADD CONSTRAINT collections_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE accounts ADD CONSTRAINT accounts_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE garment_images ADD CONSTRAINT garment_images_garment_id_fkey 
  FOREIGN KEY (garment_id) REFERENCES garments(id) ON DELETE CASCADE;

ALTER TABLE garment_tags ADD CONSTRAINT garment_tags_garment_id_fkey 
  FOREIGN KEY (garment_id) REFERENCES garments(id) ON DELETE CASCADE;

ALTER TABLE garment_tags ADD CONSTRAINT garment_tags_tag_id_fkey 
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;

ALTER TABLE collection_garments ADD CONSTRAINT collection_garments_collection_id_fkey 
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE;

ALTER TABLE collection_garments ADD CONSTRAINT collection_garments_garment_id_fkey 
  FOREIGN KEY (garment_id) REFERENCES garments(id) ON DELETE CASCADE;

ALTER TABLE collection_rules ADD CONSTRAINT collection_rules_collection_id_fkey 
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE;

-- Recreate RLS policies
CREATE POLICY "Users can view their own garments" ON garments
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own garments" ON garments
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own tags" ON tags
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own tags" ON tags
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own collections" ON collections
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own collections" ON collections
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own garment images" ON garment_images
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM garments WHERE garments.id = garment_images.garment_id AND garments.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can manage their own garment images" ON garment_images
  FOR ALL USING (EXISTS (
    SELECT 1 FROM garments WHERE garments.id = garment_images.garment_id AND garments.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view their own collection garments" ON collection_garments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM collections WHERE collections.id = collection_garments.collection_id AND collections.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can manage their own collection garments" ON collection_garments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM collections WHERE collections.id = collection_garments.collection_id AND collections.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view their own collection rules" ON collection_rules
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM collections WHERE collections.id = collection_rules.collection_id AND collections.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can manage their own collection rules" ON collection_rules
  FOR ALL USING (EXISTS (
    SELECT 1 FROM collections WHERE collections.id = collection_rules.collection_id AND collections.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can manage tags for their own garments" ON garment_tags
  FOR ALL USING (EXISTS (
    SELECT 1 FROM garments WHERE garments.id = garment_tags.garment_id AND garments.user_id = auth.uid()::text
  ));

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;