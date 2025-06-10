/*
  # Fix team invitations foreign key relationships

  1. Changes
    - Drop existing foreign key constraint that references users table
    - Add new foreign key constraint that references profiles table
    - Update RLS policies to ensure proper permissions for team invitations

  2. Security
    - Add INSERT policy for team invitations allowing team admins to invite members
    - Ensure SELECT policies work with the corrected foreign key relationships
*/

-- Drop the existing foreign key constraint that references users
ALTER TABLE team_invitations 
DROP CONSTRAINT IF EXISTS team_invitations_invited_by_fkey;

-- Add new foreign key constraint that references profiles instead of users
ALTER TABLE team_invitations 
ADD CONSTRAINT team_invitations_invited_by_fkey 
FOREIGN KEY (invited_by) REFERENCES profiles(id);

-- Update RLS policies for team_invitations to ensure proper INSERT permissions
DROP POLICY IF EXISTS "Team creators can manage invitations" ON team_invitations;

-- Create comprehensive policies for team invitations
CREATE POLICY "Team admins can insert invitations"
  ON team_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT teams.id
      FROM teams
      JOIN team_members ON team_members.team_id = teams.id
      WHERE team_members.user_id = auth.uid()
        AND team_members.role IN ('admin', 'editor')
        AND team_members.status = 'active'
        AND teams.is_active = true
    )
  );

CREATE POLICY "Team members can view team invitations"
  ON team_invitations
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT teams.id
      FROM teams
      JOIN team_members ON team_members.team_id = teams.id
      WHERE team_members.user_id = auth.uid()
        AND team_members.status = 'active'
        AND teams.is_active = true
    )
  );

CREATE POLICY "Users can view invitations sent to them"
  ON team_invitations
  FOR SELECT
  TO authenticated
  USING (
    email = (
      SELECT users.email
      FROM auth.users
      WHERE users.id = auth.uid()
    )::text
  );

CREATE POLICY "Team admins can update invitations"
  ON team_invitations
  FOR UPDATE
  TO authenticated
  USING (
    team_id IN (
      SELECT teams.id
      FROM teams
      JOIN team_members ON team_members.team_id = teams.id
      WHERE team_members.user_id = auth.uid()
        AND team_members.role IN ('admin', 'editor')
        AND team_members.status = 'active'
        AND teams.is_active = true
    )
  );

CREATE POLICY "Team admins can delete invitations"
  ON team_invitations
  FOR DELETE
  TO authenticated
  USING (
    team_id IN (
      SELECT teams.id
      FROM teams
      JOIN team_members ON team_members.team_id = teams.id
      WHERE team_members.user_id = auth.uid()
        AND team_members.role IN ('admin', 'editor')
        AND team_members.status = 'active'
        AND teams.is_active = true
    )
  );