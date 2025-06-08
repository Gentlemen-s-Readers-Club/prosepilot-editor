/*
  # Fix Team Database Errors

  1. Foreign Key Constraints
    - Add missing foreign key for team_activity_logs.user_id -> profiles.id
    - Add missing foreign key for team_invitations.invited_by -> profiles.id

  2. Database Functions
    - Drop and recreate get_team_stats function with correct return type
    - Create accept_team_invitation function for handling invitations

  3. Security
    - Grant appropriate permissions to authenticated users
*/

-- Add missing foreign key constraint for team_activity_logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_activity_logs_user_id_fkey'
    AND table_name = 'team_activity_logs'
  ) THEN
    ALTER TABLE team_activity_logs 
    ADD CONSTRAINT team_activity_logs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id);
  END IF;
END $$;

-- Add missing foreign key constraint for team_invitations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_invitations_invited_by_fkey'
    AND table_name = 'team_invitations'
  ) THEN
    ALTER TABLE team_invitations 
    ADD CONSTRAINT team_invitations_invited_by_fkey 
    FOREIGN KEY (invited_by) REFERENCES profiles(id);
  END IF;
END $$;

-- Drop existing get_team_stats function if it exists
DROP FUNCTION IF EXISTS get_team_stats(uuid);

-- Create the get_team_stats function
CREATE OR REPLACE FUNCTION get_team_stats(team_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  total_members_count integer;
  total_books_count integer;
  recent_activity_count integer;
BEGIN
  -- Get total active members count
  SELECT COUNT(*)
  INTO total_members_count
  FROM team_members tm
  WHERE tm.team_id = team_uuid 
    AND tm.status = 'active';

  -- Get total books count for the team
  SELECT COUNT(*)
  INTO total_books_count
  FROM books b
  WHERE b.team_id = team_uuid;

  -- Get recent activity count (last 30 days)
  SELECT COUNT(*)
  INTO recent_activity_count
  FROM team_activity_logs tal
  WHERE tal.team_id = team_uuid 
    AND tal.created_at >= NOW() - INTERVAL '30 days';

  -- Build the result JSON
  result := json_build_object(
    'total_members', COALESCE(total_members_count, 0),
    'total_books', COALESCE(total_books_count, 0),
    'recent_activity_count', COALESCE(recent_activity_count, 0)
  );

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_team_stats(uuid) TO authenticated;

-- Drop existing accept_team_invitation function if it exists
DROP FUNCTION IF EXISTS accept_team_invitation(text);

-- Create accept_team_invitation function
CREATE OR REPLACE FUNCTION accept_team_invitation(invitation_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record team_invitations%ROWTYPE;
  user_record auth.users%ROWTYPE;
  result json;
BEGIN
  -- Get current user
  SELECT * INTO user_record FROM auth.users WHERE id = auth.uid();
  
  IF user_record.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not authenticated');
  END IF;

  -- Find the invitation
  SELECT * INTO invitation_record 
  FROM team_invitations 
  WHERE token = invitation_token 
    AND email = user_record.email
    AND accepted_at IS NULL 
    AND expires_at > NOW();

  IF invitation_record.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;

  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_id = invitation_record.team_id 
      AND user_id = user_record.id
  ) THEN
    RETURN json_build_object('success', false, 'error', 'User is already a member of this team');
  END IF;

  -- Add user to team
  INSERT INTO team_members (team_id, user_id, role, invited_by, status)
  VALUES (
    invitation_record.team_id,
    user_record.id,
    invitation_record.role,
    invitation_record.invited_by,
    'active'
  );

  -- Mark invitation as accepted
  UPDATE team_invitations 
  SET accepted_at = NOW() 
  WHERE id = invitation_record.id;

  RETURN json_build_object('success', true, 'team_id', invitation_record.team_id);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION accept_team_invitation(text) TO authenticated;