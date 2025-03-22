
# Content Engine Database Schema

This document outlines the current database schema and recommended improvements for better alignment with frontend models.

## Current Schema

### Content Ideas Table

```sql
CREATE TABLE content_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  notes text,
  source text,
  meeting_transcript_excerpt text,
  source_url text,
  status text NOT NULL DEFAULT 'unreviewed',
  has_been_used boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status_changed_at timestamptz DEFAULT now(),
  content_type text,
  published_at timestamptz
);
```

### Content Drafts Table

```sql
CREATE TABLE content_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_idea_id uuid NOT NULL,
  content text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  feedback text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);
```

## Recommended Improvements

### Content Ideas Table

1. **Remove `content_type` field** - This field should be on drafts only, not ideas
2. **Add foreign key constraints** for `user_id`
3. **Add `content_pillar_ids` and `target_audience_ids` columns** - These should be JSONB arrays to match frontend model
4. **Add index on `status`** for better query performance
5. **Rename columns to match frontend models** - Convert snake_case to camelCase in API responses

### Content Drafts Table

1. **Add `content_type` field** as NOT NULL
2. **Add optional `content_goal` field**
3. **Add foreign key constraint** to `content_idea_id`
4. **Add timestamptz fields** for status transitions:
   - `published_at`
   - `ready_at`
   - `archived_at`
5. **Add index on `status`** for better query performance
6. **Add trigger for status changes** to update the corresponding timestamp fields

## Frontend-Database Mapping

To ensure consistency between frontend and database models, we should:

1. Create TypeScript interfaces that match database schema
2. Use a consistent naming convention for all fields
3. Add proper type conversion in the API layer
4. Create migration scripts for database schema changes

## Data Access Patterns

For optimal performance and maintainability:

1. Use parameterized queries for all database access
2. Create view functions for complex queries
3. Implement row-level security for proper data isolation
4. Use transactions for operations that modify multiple tables
5. Use optimistic concurrency control for updates
