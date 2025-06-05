/*
  # Fix Chapters RLS Policy

  1. Changes
    - Drop existing INSERT policy for chapters table
    - Create new INSERT policy that properly checks book ownership
    
  2. Security
    - Updates RLS policy to ensure users can only insert chapters for books they own
    - Maintains existing security model while fixing the permission check
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert chapters for their own books" ON chapters;

-- Create new INSERT policy with correct ownership check
CREATE POLICY "Users can insert chapters for their own books" 
ON chapters 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM books 
    WHERE books.id = book_id 
    AND books.user_id = auth.uid()
  )
);