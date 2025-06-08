/*
  # Fix infinite recursion in team_members RLS policies

  1. Security Changes
    - Drop existing recursive policies on team_members table
    - Create new non-recursive policies that avoid self-referential lookups
    - Ensure policies are simple and don't create circular dependencies

  2. Policy Changes
    - Replace recursive team admin check with direct team ownership check
    - Simplify team member viewing policy to avoid self-reference
    - Add policy for users to view their own team membership records
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Team admins can manage team members" ON team_members;
DROP POLICY IF EXISTS "Users can view team members of their teams" ON team_members;

-- Create new non-recursive policies

-- Users can view their own team membership records
CREATE POLICY "Users can view own team memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can view team members of teams they own (created)
CREATE POLICY "Team creators can view all team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() AND is_active = true
    )
  );

-- Team creators can manage all team members
CREATE POLICY "Team creators can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() AND is_active = true
    )
  );

-- Users can insert themselves into teams (for invitation acceptance)
CREATE POLICY "Users can join teams via invitation"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own team membership status
CREATE POLICY "Users can update own membership"
  ON team_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());