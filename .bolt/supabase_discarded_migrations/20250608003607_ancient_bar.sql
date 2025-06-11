/*
  # Team Management System for Collaborative Book Creation

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text, unique team name)
      - `description` (text, team description)
      - `logo_url` (text, team logo)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `max_members` (integer, default 50)
      - `is_active` (boolean, default true)

    - `team_members`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `user_id` (uuid, references users)
      - `role` (text, enum: admin, editor, reader)
      - `joined_at` (timestamp)
      - `invited_by` (uuid, references users)
      - `status` (text, enum: active, pending, inactive)

    - `team_invitations`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `email` (text, invitee email)
      - `role` (text, role to assign)
      - `invited_by` (uuid, references users)
      - `message` (text, custom invitation message)
      - `token` (text, unique invitation token)
      - `expires_at` (timestamp)
      - `accepted_at` (timestamp)
      - `created_at` (timestamp)

    - `team_activity_logs`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `user_id` (uuid, references users)
      - `action` (text, action performed)
      - `details` (jsonb, action details)
      - `created_at` (timestamp)

  2. Modified Tables
    - `books` - Add team_id column for team ownership
    - `chapters` - Inherit team access from books
    - `chapter_versions` - Track collaborative editing

  3. Security
    - Enable RLS on all team tables
    - Add policies for team-based access control
    - Ensure data isolation between teams

  4. Functions
    - Team invitation management
    - Role validation
    - Activity logging
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL CHECK (length(name) >= 3 AND length(name) <= 50),
  description text CHECK (length(description) <= 200),
  logo_url text,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  max_members integer DEFAULT 50 CHECK (max_members > 0 AND max_members <= 50),
  is_active boolean DEFAULT true
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'reader')),
  joined_at timestamptz DEFAULT now(),
  invited_by uuid REFERENCES users(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  UNIQUE(team_id, user_id)
);

-- Create team_invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'reader')),
  invited_by uuid NOT NULL REFERENCES users(id),
  message text,
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create team_activity_logs table
CREATE TABLE IF NOT EXISTS team_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Add team_id to books table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'team_id'
  ) THEN
    ALTER TABLE books ADD COLUMN team_id uuid REFERENCES teams(id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);
CREATE INDEX IF NOT EXISTS idx_teams_active ON teams(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_invitations_team_id ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_activity_logs_team_id ON team_activity_logs(team_id);
CREATE INDEX IF NOT EXISTS idx_books_team_id ON books(team_id);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activity_logs ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view teams they are members of"
  ON teams FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team admins can update teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

CREATE POLICY "Team admins can delete teams"
  ON teams FOR DELETE
  TO authenticated
  USING (
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- Team members policies
CREATE POLICY "Users can view team members of their teams"
  ON team_members FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Team admins can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- Team invitations policies
CREATE POLICY "Team admins can manage invitations"
  ON team_invitations FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

CREATE POLICY "Users can view invitations sent to them"
  ON team_invitations FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Team activity logs policies
CREATE POLICY "Team members can view activity logs"
  ON team_activity_logs FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "System can insert activity logs"
  ON team_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update books policies for team access
DROP POLICY IF EXISTS "Users can view their own books" ON books;
DROP POLICY IF EXISTS "Users can create their own books" ON books;
DROP POLICY IF EXISTS "Users can update their own books" ON books;
DROP POLICY IF EXISTS "Users can delete their own books" ON books;

CREATE POLICY "Users can view their own books or team books"
  ON books FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create personal books or team books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND team_id IS NULL)
    OR (team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND status = 'active'
    ))
  );

CREATE POLICY "Users can update their own books or team books with edit access"
  ON books FOR UPDATE
  TO authenticated
  USING (
    (user_id = auth.uid() AND team_id IS NULL)
    OR (team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND status = 'active'
    ))
  );

CREATE POLICY "Users can delete their own books or team books with admin access"
  ON books FOR DELETE
  TO authenticated
  USING (
    (user_id = auth.uid() AND team_id IS NULL)
    OR (team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    ))
  );

-- Update chapters policies for team access
DROP POLICY IF EXISTS "Users can view chapters for their own books" ON chapters;
DROP POLICY IF EXISTS "Users can insert chapters for their own books" ON chapters;
DROP POLICY IF EXISTS "Users can update chapters for their own books" ON chapters;
DROP POLICY IF EXISTS "Users can delete chapters for their own books" ON chapters;

CREATE POLICY "Users can view chapters for accessible books"
  ON chapters FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = chapters.book_id 
      AND (
        books.user_id = auth.uid() 
        OR books.team_id IN (
          SELECT team_id FROM team_members 
          WHERE user_id = auth.uid() AND status = 'active'
        )
      )
    )
  );

CREATE POLICY "Users can insert chapters for editable books"
  ON chapters FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = chapters.book_id 
      AND (
        (books.user_id = auth.uid() AND books.team_id IS NULL)
        OR books.team_id IN (
          SELECT team_id FROM team_members 
          WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND status = 'active'
        )
      )
    )
  );

CREATE POLICY "Users can update chapters for editable books"
  ON chapters FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = chapters.book_id 
      AND (
        (books.user_id = auth.uid() AND books.team_id IS NULL)
        OR books.team_id IN (
          SELECT team_id FROM team_members 
          WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND status = 'active'
        )
      )
    )
  );

CREATE POLICY "Users can delete chapters for editable books"
  ON chapters FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = chapters.book_id 
      AND (
        (books.user_id = auth.uid() AND books.team_id IS NULL)
        OR books.team_id IN (
          SELECT team_id FROM team_members 
          WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND status = 'active'
        )
      )
    )
  );

-- Update chapter_versions policies for team access
DROP POLICY IF EXISTS "Users can manage chapter versions for their own books" ON chapter_versions;

CREATE POLICY "Users can manage chapter versions for accessible books"
  ON chapter_versions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chapters 
      JOIN books ON books.id = chapters.book_id
      WHERE chapters.id = chapter_versions.chapter_id 
      AND (
        (books.user_id = auth.uid() AND books.team_id IS NULL)
        OR books.team_id IN (
          SELECT team_id FROM team_members 
          WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND status = 'active'
        )
      )
    )
  );

-- Create function to automatically add team creator as admin
CREATE OR REPLACE FUNCTION add_team_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO team_members (team_id, user_id, role, invited_by, status)
  VALUES (NEW.id, NEW.created_by, 'admin', NEW.created_by, 'active');
  
  INSERT INTO team_activity_logs (team_id, user_id, action, details)
  VALUES (NEW.id, NEW.created_by, 'team_created', jsonb_build_object('team_name', NEW.name));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for team creation
DROP TRIGGER IF EXISTS trigger_add_team_creator_as_admin ON teams;
CREATE TRIGGER trigger_add_team_creator_as_admin
  AFTER INSERT ON teams
  FOR EACH ROW
  EXECUTE FUNCTION add_team_creator_as_admin();

-- Create function to log team activities
CREATE OR REPLACE FUNCTION log_team_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO team_activity_logs (team_id, user_id, action, details)
    VALUES (
      NEW.team_id, 
      auth.uid(), 
      CASE 
        WHEN NEW.status = 'active' THEN 'member_joined'
        ELSE 'member_invited'
      END,
      jsonb_build_object('role', NEW.role, 'user_id', NEW.user_id)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.role != NEW.role THEN
      INSERT INTO team_activity_logs (team_id, user_id, action, details)
      VALUES (
        NEW.team_id, 
        auth.uid(), 
        'role_changed',
        jsonb_build_object('user_id', NEW.user_id, 'old_role', OLD.role, 'new_role', NEW.role)
      );
    END IF;
    IF OLD.status != NEW.status THEN
      INSERT INTO team_activity_logs (team_id, user_id, action, details)
      VALUES (
        NEW.team_id, 
        auth.uid(), 
        CASE 
          WHEN NEW.status = 'active' THEN 'member_activated'
          WHEN NEW.status = 'inactive' THEN 'member_deactivated'
          ELSE 'status_changed'
        END,
        jsonb_build_object('user_id', NEW.user_id, 'old_status', OLD.status, 'new_status', NEW.status)
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO team_activity_logs (team_id, user_id, action, details)
    VALUES (
      OLD.team_id, 
      auth.uid(), 
      'member_removed',
      jsonb_build_object('user_id', OLD.user_id, 'role', OLD.role)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for team member activity logging
DROP TRIGGER IF EXISTS trigger_log_team_member_activity ON team_members;
CREATE TRIGGER trigger_log_team_member_activity
  AFTER INSERT OR UPDATE OR DELETE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION log_team_activity();

-- Create function to handle invitation acceptance
CREATE OR REPLACE FUNCTION accept_team_invitation(invitation_token text)
RETURNS jsonb AS $$
DECLARE
  invitation_record team_invitations%ROWTYPE;
  user_email text;
  team_member_count integer;
  max_team_members integer;
BEGIN
  -- Get current user email
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  -- Find and validate invitation
  SELECT * INTO invitation_record 
  FROM team_invitations 
  WHERE token = invitation_token 
    AND email = user_email 
    AND expires_at > now() 
    AND accepted_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;
  
  -- Check team member limit
  SELECT COUNT(*), t.max_members 
  INTO team_member_count, max_team_members
  FROM team_members tm
  JOIN teams t ON t.id = tm.team_id
  WHERE tm.team_id = invitation_record.team_id 
    AND tm.status = 'active'
  GROUP BY t.max_members;
  
  IF team_member_count >= max_team_members THEN
    RETURN jsonb_build_object('success', false, 'error', 'Team has reached maximum member limit');
  END IF;
  
  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_id = invitation_record.team_id 
      AND user_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'User is already a member of this team');
  END IF;
  
  -- Add user to team
  INSERT INTO team_members (team_id, user_id, role, invited_by, status)
  VALUES (
    invitation_record.team_id, 
    auth.uid(), 
    invitation_record.role, 
    invitation_record.invited_by, 
    'active'
  );
  
  -- Mark invitation as accepted
  UPDATE team_invitations 
  SET accepted_at = now() 
  WHERE id = invitation_record.id;
  
  RETURN jsonb_build_object('success', true, 'team_id', invitation_record.team_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get team statistics
CREATE OR REPLACE FUNCTION get_team_stats(team_uuid uuid)
RETURNS jsonb AS $$
DECLARE
  stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_members', COUNT(DISTINCT tm.user_id),
    'active_members', COUNT(DISTINCT tm.user_id) FILTER (WHERE tm.status = 'active'),
    'total_books', COUNT(DISTINCT b.id),
    'books_by_status', jsonb_object_agg(b.status, book_counts.count),
    'member_roles', jsonb_object_agg(tm.role, role_counts.count),
    'recent_activity_count', (
      SELECT COUNT(*) FROM team_activity_logs 
      WHERE team_id = team_uuid AND created_at > now() - interval '7 days'
    )
  ) INTO stats
  FROM team_members tm
  LEFT JOIN books b ON b.team_id = team_uuid
  LEFT JOIN (
    SELECT status, COUNT(*) as count 
    FROM books 
    WHERE team_id = team_uuid 
    GROUP BY status
  ) book_counts ON true
  LEFT JOIN (
    SELECT role, COUNT(*) as count 
    FROM team_members 
    WHERE team_id = team_uuid AND status = 'active'
    GROUP BY role
  ) role_counts ON true
  WHERE tm.team_id = team_uuid;
  
  RETURN COALESCE(stats, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger for teams
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();