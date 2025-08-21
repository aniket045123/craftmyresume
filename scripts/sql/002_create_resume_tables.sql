-- Create resume_updates table for existing resume modifications
CREATE TABLE IF NOT EXISTS resume_updates (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    resume_file_url TEXT,
    additional_details TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create resume_builds table for building resume from scratch
CREATE TABLE IF NOT EXISTS resume_builds (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100),
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    
    -- Professional Summary
    professional_summary TEXT,
    
    -- Work Experience (JSON array)
    work_experience JSONB,
    
    -- Education (JSON array)
    education JSONB,
    
    -- Skills (JSON array)
    skills JSONB,
    
    -- Certifications (JSON array)
    certifications JSONB,
    
    -- Projects (JSON array)
    projects JSONB,
    
    -- Additional Information
    languages JSONB,
    achievements TEXT,
    additional_notes TEXT,
    
    -- Preferences
    resume_template VARCHAR(100) DEFAULT 'professional',
    target_role VARCHAR(255),
    target_industry VARCHAR(255),
    
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resume_updates_email ON resume_updates(email);
CREATE INDEX IF NOT EXISTS idx_resume_updates_order_id ON resume_updates(order_id);
CREATE INDEX IF NOT EXISTS idx_resume_builds_email ON resume_builds(email);
CREATE INDEX IF NOT EXISTS idx_resume_builds_order_id ON resume_builds(order_id);
