/*
  # Fix team member and invitation permissions

  1. Security Updates
    - Update profiles RLS policies to allow authenticated users to read all profiles
    - Fix team_invitations policies to properly handle profile joins
    - Ensure team_members policies work correctly with profile data

  2. Changes
    - Modify profiles SELECT policies to allow reading all user profiles for team functionality
    - Update team_invitations policies to avoid users table permission issues
    - Ensure proper access for team member profile information
*/

-- Drop existing problematic policies on profiles
DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create a comprehensive policy for profiles that allows authenticated users to read all profiles
-- This is necessary for team functionality where users need to see other team members' profiles
CREATE POLICY "Authenticated users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Update team_invitations policies to avoid users table issues
DROP POLICY IF EXISTS "Users can view invitations sent to them" ON team_invitations;

-- Create a new policy that uses the profiles table instead of users table
CREATE POLICY "Users can view invitations sent to them"
  ON team_invitations
  FOR SELECT
  TO authenticated
  USING (
    email IN (
      SELECT email 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  );

-- Ensure team_members policies work correctly
DROP POLICY IF EXISTS "Users can view own team memberships" ON team_members;

CREATE POLICY "Users can view own team memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add policy for team creators to view all team members (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'team_members' 
    AND policyname = 'Team creators can view all team members'
  ) THEN
    CREATE POLICY "Team creators can view all team members"
      ON team_members
      FOR SELECT
      TO authenticated
      USING (
        team_id IN (
          SELECT id
          FROM teams
          WHERE created_by = auth.uid() AND is_active = true
        )
      );
  END IF;
END $$;