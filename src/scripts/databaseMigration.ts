
/**
 * Database Migration Script
 * 
 * This script is intended to be run as a one-time upgrade to align
 * database schema with frontend models. It should be executed via
 * the Supabase CLI or dashboard SQL editor.
 * 
 * IMPORTANT: Always backup your database before running migrations.
 */

const databaseMigrationSQL = `
-- Add missing columns to content_ideas table
ALTER TABLE IF NOT EXISTS content_ideas
ADD COLUMN IF NOT EXISTS content_pillar_ids UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_audience_ids UUID[] DEFAULT '{}',
ADD INDEX IF NOT EXISTS idx_content_ideas_status (status);

-- Add missing columns to content_drafts table
ALTER TABLE IF NOT EXISTS content_drafts
ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'linkedin',
ADD COLUMN IF NOT EXISTS content_goal TEXT,
ADD COLUMN IF NOT EXISTS ready_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
ADD INDEX IF NOT EXISTS idx_content_drafts_status (status);

-- Create trigger for tracking status change timestamps on drafts
CREATE OR REPLACE FUNCTION update_draft_status_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        CASE NEW.status
            WHEN 'ready' THEN
                NEW.ready_at := NOW();
            WHEN 'published' THEN
                NEW.published_at := NOW();
            WHEN 'archived' THEN
                NEW.archived_at := NOW();
        END CASE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to content_drafts table
DROP TRIGGER IF EXISTS set_draft_status_timestamps ON content_drafts;
CREATE TRIGGER set_draft_status_timestamps
BEFORE UPDATE ON content_drafts
FOR EACH ROW
EXECUTE FUNCTION update_draft_status_timestamps();

-- Add foreign key constraints
ALTER TABLE content_drafts
ADD CONSTRAINT fk_content_drafts_idea
FOREIGN KEY (content_idea_id) REFERENCES content_ideas(id) ON DELETE CASCADE;

-- Add constraint for content_type values
ALTER TABLE content_drafts
ADD CONSTRAINT check_content_type 
CHECK (content_type IN ('linkedin', 'newsletter', 'marketing', 'social'));

-- Add constraint for status values on content_ideas
ALTER TABLE content_ideas
ADD CONSTRAINT check_content_status 
CHECK (status IN ('unreviewed', 'approved', 'rejected'));

-- Add constraint for status values on content_drafts
ALTER TABLE content_drafts
ADD CONSTRAINT check_draft_status 
CHECK (status IN ('draft', 'ready', 'published', 'archived'));
`;

/**
 * Instructions for running the migration:
 * 
 * 1. Log in to the Supabase dashboard
 * 2. Go to the SQL Editor
 * 3. Paste the SQL script above
 * 4. Click "Run" to execute the migration
 * 
 * Alternatively, use the Supabase CLI:
 * 
 * supabase db execute -f migration.sql
 */

export const runDatabaseMigration = async () => {
  // Implementation would depend on the environment
  // This is just a placeholder for documentation purposes
  console.log("Database migration script is ready to be executed");
  console.log("Please run this SQL in the Supabase dashboard SQL editor or via CLI");
};
