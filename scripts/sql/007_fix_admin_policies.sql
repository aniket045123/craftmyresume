-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin users can read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update admin_users" ON admin_users;

-- Create new policies that don't cause recursion
-- Allow service role to access admin_users table
CREATE POLICY "Service role can access admin_users" ON admin_users
FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read their own admin record
CREATE POLICY "Users can read own admin record" ON admin_users
FOR SELECT USING (auth.uid()::text = id OR email = auth.jwt() ->> 'email');

-- Update RLS policies for other tables to use service role
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table
DROP POLICY IF EXISTS "Admin can access leads" ON leads;
CREATE POLICY "Service role can access leads" ON leads
FOR ALL USING (auth.role() = 'service_role');

-- Create policies for resume_requests table  
DROP POLICY IF EXISTS "Admin can access resume_requests" ON resume_requests;
CREATE POLICY "Service role can access resume_requests" ON resume_requests
FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON admin_users TO service_role;
GRANT ALL ON leads TO service_role;
GRANT ALL ON resume_requests TO service_role;
