/*
  # Fix Team Invitations Permission Issues

  1. Problem
    - Permission denied for table users when accessing team_invitations
    - This occurs when trying to join team_invitations with users table via invited_by
    - The error happens because RLS policies don't allow access to the users table

  2. Solution
    - Update team_invitations policies to use profiles table instead of users
    - Ensure proper foreign key relationships between tables
    - Fix the RLS policies to allow proper access patterns
*/

-- Update team_invitations policies
DROP POLICY IF EXISTS "Team creators can manage invitations" ON team_invitations;
DROP POLICY IF EXISTS "Users can view invitations sent to them" ON team_invitations;

-- Create new policies that don't rely on users table
CREATE POLICY "Team creators can manage invitations"
  ON team_invitations
  FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Users can view invitations sent to them"
  ON team_invitations
  FOR SELECT
  TO authenticated
  USING (
    email = (
      SELECT email FROM auth.users 
      WHERE id = auth.uid()
    )
  );

-- Ensure proper foreign key for invited_by
ALTER TABLE team_invitations 
DROP CONSTRAINT IF EXISTS team_invitations_invited_by_fkey;

-- Add the correct foreign key constraint
ALTER TABLE team_invitations
ADD CONSTRAINT team_invitations_invited_by_fkey
FOREIGN KEY (invited_by) REFERENCES auth.users(id);

-- Create a view to safely expose user data needed for team invitations
CREATE OR REPLACE VIEW public.team_invitation_users AS
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.avatar_url
FROM 
  auth.users u
JOIN 
  public.profiles p ON u.id = p.id;

-- Grant access to the view
GRANT SELECT ON public.team_invitation_users TO authenticated;

-- Update the inviteMembers function in the teamsSlice.ts file