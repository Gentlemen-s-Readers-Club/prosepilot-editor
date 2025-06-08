-- Drop all existing policies on team_members that cause recursion
DROP POLICY IF EXISTS "Team creators can manage team members" ON team_members;
DROP POLICY IF EXISTS "Team members can view other team members" ON team_members;
DROP POLICY IF EXISTS "Users can view own team memberships" ON team_members;
DROP POLICY IF EXISTS "Users can update own membership" ON team_members;
DROP POLICY IF EXISTS "Users can insert own team membership" ON team_members;

-- Create a simple, non-recursive policy structure

-- 1. Users can always view their own team memberships (no subqueries)
CREATE POLICY "Users can view own team memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 2. Users can update their own membership status (no subqueries)
CREATE POLICY "Users can update own membership"
  ON team_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. Users can insert their own team membership (for accepting invitations)
CREATE POLICY "Users can insert own team membership"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 4. Team creators can manage all members (using teams table only, no team_members recursion)
CREATE POLICY "Team creators can manage all team members"
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

-- 5. Allow viewing team members for team creators (using teams table only)
CREATE POLICY "Team creators can view all team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  );

-- Update the teams policies to be simpler and avoid any potential recursion
DROP POLICY IF EXISTS "Users can view teams they are members of" ON teams;
DROP POLICY IF EXISTS "Team admins can update teams" ON teams;
DROP POLICY IF EXISTS "Team admins can delete teams" ON teams;

-- Recreate teams policies without team_members subqueries
CREATE POLICY "Users can view teams they created"
  ON teams
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Team creators can update teams"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Team creators can delete teams"
  ON teams
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Update team_invitations policies to use teams table instead of team_members
DROP POLICY IF EXISTS "Team admins can manage invitations" ON team_invitations;

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

-- Update team_activity_logs policies to use teams table instead of team_members
DROP POLICY IF EXISTS "Team members can view activity logs" ON team_activity_logs;

CREATE POLICY "Team creators can view activity logs"
  ON team_activity_logs
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  );

-- Update books policies to use teams table instead of team_members for team access
DROP POLICY IF EXISTS "Users can view their own books or team books" ON books;
DROP POLICY IF EXISTS "Users can create personal books or team books" ON books;
DROP POLICY IF EXISTS "Users can update their own books or team books with edit access" ON books;
DROP POLICY IF EXISTS "Users can delete their own books or team books with admin access" ON books;

CREATE POLICY "Users can view their own books or team books"
  ON books FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Users can create personal books or team books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND team_id IS NULL)
    OR team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Users can update their own books or team books"
  ON books FOR UPDATE
  TO authenticated
  USING (
    (user_id = auth.uid() AND team_id IS NULL)
    OR team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Users can delete their own books or team books"
  ON books FOR DELETE
  TO authenticated
  USING (
    (user_id = auth.uid() AND team_id IS NULL)
    OR team_id IN (
      SELECT id FROM teams 
      WHERE created_by = auth.uid() 
      AND is_active = true
    )
  );

-- Update chapters policies to use teams table instead of team_members
DROP POLICY IF EXISTS "Users can view chapters for accessible books" ON chapters;
DROP POLICY IF EXISTS "Users can insert chapters for editable books" ON chapters;
DROP POLICY IF EXISTS "Users can update chapters for editable books" ON chapters;
DROP POLICY IF EXISTS "Users can delete chapters for editable books" ON chapters;

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
          SELECT id FROM teams 
          WHERE created_by = auth.uid() 
          AND is_active = true
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
          SELECT id FROM teams 
          WHERE created_by = auth.uid() 
          AND is_active = true
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
          SELECT id FROM teams 
          WHERE created_by = auth.uid() 
          AND is_active = true
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
          SELECT id FROM teams 
          WHERE created_by = auth.uid() 
          AND is_active = true
        )
      )
    )
  );

-- Update chapter_versions policies to use teams table instead of team_members
DROP POLICY IF EXISTS "Users can manage chapter versions for accessible books" ON chapter_versions;

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
          SELECT id FROM teams 
          WHERE created_by = auth.uid() 
          AND is_active = true
        )
      )
    )
  );