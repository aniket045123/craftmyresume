-- Create admin_users table for managing admin access
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    permissions TEXT[] DEFAULT ARRAY['read', 'write'],
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Create index on role for role-based queries
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to read their own data
CREATE POLICY "Admin users can read own data" ON admin_users
    FOR SELECT USING (auth.email() = email);

-- Create policy for super admins to read all admin data
CREATE POLICY "Super admins can read all admin data" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND role = 'super_admin' 
            AND is_active = true
        )
    );

-- Create policy for super admins to update admin data
CREATE POLICY "Super admins can update admin data" ON admin_users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND role = 'super_admin' 
            AND is_active = true
        )
    );

-- Create policy for super admins to insert new admin users
CREATE POLICY "Super admins can insert admin users" ON admin_users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND role = 'super_admin' 
            AND is_active = true
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_admin_users_updated_at_trigger
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_users_updated_at();

-- Insert default admin user (this will be overridden by the insert script)
INSERT INTO admin_users (email, full_name, role, is_active) 
VALUES ('admin@craftmyresume.com', 'System Administrator', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;
