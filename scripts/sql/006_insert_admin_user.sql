-- Insert the admin user into admin_users table
-- This should be run after creating the user in Supabase Auth

INSERT INTO admin_users (email, full_name, role, is_active) 
VALUES ('admin@craftmyresume.com', 'Admin User', 'super_admin', true)
ON CONFLICT (email) 
DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Verify the admin user was inserted
SELECT * FROM admin_users WHERE email = 'admin@craftmyresume.com';

-- Grant additional permissions if needed
UPDATE admin_users 
SET permissions = ARRAY['read', 'write', 'delete', 'admin'] 
WHERE email = 'admin@craftmyresume.com';

-- Update last login to current timestamp
UPDATE admin_users 
SET last_login = NOW(), updated_at = NOW() 
WHERE email = 'admin@craftmyresume.com';
