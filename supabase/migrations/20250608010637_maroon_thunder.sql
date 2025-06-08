/*
  # Fix team permissions and RLS policies

  1. Security Updates
    - Add RLS policy to allow authenticated users to read all profiles (needed for team member info)
    - This enables team functionality where users need to see other team members' basic info
  
  2. Changes
    - Add policy for authenticated users to read profiles table
    - This resolves the "permission denied for table users" error when fetching team members
*/

-- Allow authenticated users to read all profiles (needed for team functionality)
CREATE POLICY "Allow authenticated users to read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);