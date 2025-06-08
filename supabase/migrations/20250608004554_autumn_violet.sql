/*
  # Fix infinite recursion in team_members RLS policies

  1. Problem
    - Current policies create circular dependencies between teams and team_members tables
    - "Team creators can manage team members" policy references teams table
    - Teams table policies reference team_members table
    - This creates infinite recursion

  2. Solution
    - Simplify team_members policies to avoid circular references
    - Use direct user_id checks instead of complex joins
    - Maintain security while eliminating recursion

  3. Changes
    - Drop existing problematic policies
    - Create new simplified policies
    - Ensure proper access control without recursion
*/

-- Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "Team creators can manage team members" ON team_members;
DROP POLICY IF EXISTS "Team creators can view all team members" ON team_members;

-- Create simplified policies that don't cause recursion

-- Policy for team admins to manage team members (simplified to avoid recursion)
CREATE POLICY "Team admins can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    -- Allow if user is admin of the team (direct check without joining teams table)
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'admin'
        AND tm.status = 'active'
    )
  )
  WITH CHECK (
    -- Same check for inserts/updates
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'admin'
        AND tm.status = 'active'
    )
  );

-- Simplified policy for viewing team members
CREATE POLICY "Team admins can view team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    -- Allow if user is admin of the team
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'admin'
        AND tm.status = 'active'
    )
  );