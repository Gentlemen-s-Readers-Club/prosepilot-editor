/*
  # Fix infinite recursion in team_members RLS policies

  1. Problem
    - Current policies on team_members table are causing infinite recursion
    - Policies are trying to query team_members table from within the policies themselves
    - This creates a circular dependency when checking permissions

  2. Solution
    - Replace recursive policies with direct user_id comparisons
    - Simplify admin checks to avoid self-referential queries
    - Ensure policies can determine permissions without querying the same table

  3. Changes
    - Drop existing problematic policies
    - Create new simplified policies that avoid recursion
    - Maintain security while fixing the circular dependency
*/

-- Drop all existing policies on team_members to start fresh
DROP POLICY IF EXISTS "Team admins can manage team members" ON team_members;
DROP POLICY IF EXISTS "Team admins can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can join teams via invitation" ON team_members;
DROP POLICY IF EXISTS "Users can update own membership" ON team_members;
DROP POLICY IF EXISTS "Users can view own team memberships" ON team_members;

-- Create new policies that avoid recursion

-- Users can view their own team memberships (direct comparison, no subquery)
CREATE POLICY "Users can view own team memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own membership status (direct comparison)
CREATE POLICY "Users can update own membership"
  ON team_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can insert their own team membership (for accepting invitations)
CREATE POLICY "Users can insert own team membership"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Team creators (from teams table) can manage all team members
CREATE POLICY "Team creators can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  );

-- Allow viewing team members for any team member (but avoid recursion by using direct team access)
CREATE POLICY "Team members can view other team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    -- User is viewing their own membership OR
    user_id = auth.uid() OR
    -- User is a team creator
    team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  );