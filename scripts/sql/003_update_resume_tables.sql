-- Add file_upload_error column to resume_updates table
ALTER TABLE resume_updates 
ADD COLUMN file_upload_error TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resume_updates_status ON resume_updates(status);
CREATE INDEX IF NOT EXISTS idx_resume_updates_created_at ON resume_updates(created_at);
CREATE INDEX IF NOT EXISTS idx_resume_builds_status ON resume_builds(status);
CREATE INDEX IF NOT EXISTS idx_resume_builds_created_at ON resume_builds(created_at);

-- Add comments for documentation
COMMENT ON TABLE resume_updates IS 'Stores requests for updating existing resumes';
COMMENT ON TABLE resume_builds IS 'Stores requests for building resumes from scratch';
COMMENT ON COLUMN resume_updates.file_upload_error IS 'Stores any error message if file upload fails';
