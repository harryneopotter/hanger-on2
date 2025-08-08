-- Create a test user for authentication testing
INSERT INTO profiles (id, name, email, password, created_at, updated_at)
VALUES (
  'test-user-123',
  'Test User',
  'test@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'password'
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Enable RLS on profiles table for security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = id);

-- Allow public access for authentication
CREATE POLICY "Allow authentication access" ON profiles
  FOR SELECT USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;