/*
  # Update Chapters RLS Policies

  1. Changes
    - Drop existing RLS policies for chapters table
    - Create new comprehensive RLS policies for chapters table
    
  2. Security
    - Enable RLS on chapters table
    - Add policies for:
      - SELECT: Users can view chapters for their own books
      - INSERT: Users can create chapters for their own books
      - UPDATE: Users can update chapters for their own books
      - DELETE: Users can delete chapters for their own books
    - All policies verify ownership through the books table user_id
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view chapters for their own books" ON chapters;
DROP POLICY IF EXISTS "Users can insert chapters for their own books" ON chapters;
DROP POLICY IF EXISTS "Users can update chapters for their own books" ON chapters;
DROP POLICY IF EXISTS "Users can delete chapters for their own books" ON chapters;

-- Ensure RLS is enabled
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Users can view chapters for their own books"
ON chapters FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM books
    WHERE books.id = chapters.book_id
    AND books.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert chapters for their own books"
ON chapters FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM books
    WHERE books.id = chapters.book_id
    AND books.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update chapters for their own books"
ON chapters FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM books
    WHERE books.id = chapters.book_id
    AND books.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM books
    WHERE books.id = chapters.book_id
    AND books.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete chapters for their own books"
ON chapters FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM books
    WHERE books.id = chapters.book_id
    AND books.user_id = auth.uid()
  )
);