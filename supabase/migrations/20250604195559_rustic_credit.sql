/*
  # Add narrator, tone and literature style fields to books table

  1. Changes
    - Add narrator_id column (references narrators table)
    - Add tone_id column (references tones table)
    - Add literature_style_id column (references literature_styles table)
    - Add foreign key constraints
    - Update status enum to include 'error' status

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns with foreign key constraints
ALTER TABLE books
ADD COLUMN narrator_id uuid REFERENCES narrators(id),
ADD COLUMN tone_id uuid REFERENCES tones(id),
ADD COLUMN literature_style_id uuid REFERENCES literature_styles(id);

-- Add indexes for the new foreign key columns
CREATE INDEX IF NOT EXISTS idx_books_narrator_id ON books(narrator_id);
CREATE INDEX IF NOT EXISTS idx_books_tone_id ON books(tone_id);
CREATE INDEX IF NOT EXISTS idx_books_literature_style_id ON books(literature_style_id);

-- Update the status enum to include 'error'
ALTER TABLE books 
DROP CONSTRAINT books_status_check;

ALTER TABLE books 
ADD CONSTRAINT books_status_check 
CHECK (status IN ('draft', 'writing', 'reviewing', 'published', 'archived', 'error'));