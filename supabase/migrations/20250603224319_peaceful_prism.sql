/*
  # Update Chapters RLS Policies

  1. Changes
    - Drop existing ALL policy on chapters table
    - Add separate policies for INSERT, SELECT, UPDATE, and DELETE operations
    - Ensure proper user_id validation for each operation

  2. Security
    - Enable RLS on chapters table (if not already enabled)
    - Add granular policies for each operation type
    - Ensure users can only manage chapters for their own books
*/

-- First enable RLS if not already enabled
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with proper permissions
DROP POLICY IF EXISTS "Users can manage chapters for their own books" ON chapters;

-- Create separate policies for each operation
CREATE POLICY "Users can insert chapters for their own books"
ON chapters
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM books
    WHERE books.id = chapters.book_id
    AND books.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view chapters for their own books"
ON chapters
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM books
    WHERE books.id = chapters.book_id
    AND books.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update chapters for their own books"
ON chapters
FOR UPDATE
TO authenticated
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
ON chapters
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM books
    WHERE books.id = chapters.book_id
    AND books.user_id = auth.uid()
  )
);