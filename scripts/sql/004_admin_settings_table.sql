-- Create admin_settings table for storing admin dashboard configuration
CREATE TABLE IF NOT EXISTS admin_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Create index on updated_at for performance
CREATE INDEX IF NOT EXISTS idx_admin_settings_updated_at ON admin_settings(updated_at);

-- Insert default settings if table is empty
INSERT INTO admin_settings (id, settings) 
VALUES (1, '{
    "businessName": "CraftMyResume",
    "businessEmail": "admin@craftmyresume.com", 
    "businessPhone": "+1 (555) 123-4567",
    "autoResponseEnabled": true,
    "autoResponseMessage": "Thank you for your resume request! We will get back to you within 24 hours.",
    "notificationEmail": "notifications@craftmyresume.com",
    "emailNotificationsEnabled": true,
    "slackWebhookUrl": "",
    "slackNotificationsEnabled": false,
    "defaultTurnaroundHours": 24,
    "maxFileSize": 10,
    "allowedFileTypes": "pdf,doc,docx"
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
