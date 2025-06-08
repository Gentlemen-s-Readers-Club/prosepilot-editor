/*
# Fix Team Foreign Key Relationships

1. Foreign Key Updates
   - Add missing foreign key from team_members.user_id to profiles(id)
   - Add missing foreign key from team_members.invited_by to profiles(id)
   - These are needed for the Supabase queries to work correctly

2. Security
   - Maintain existing RLS policies
   - No changes to permissions
*/

-- Add missing foreign key constraint for team_members.user_id -> profiles(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_members_user_id_fkey'
    AND table_name = 'team_members'
  ) THEN
    ALTER TABLE team_members 
    ADD CONSTRAINT team_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id);
  END IF;
END $$;

-- Add missing foreign key constraint for team_members.invited_by -> profiles(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_members_invited_by_fkey'
    AND table_name = 'team_members'
  ) THEN
    ALTER TABLE team_members 
    ADD CONSTRAINT team_members_invited_by_fkey 
    FOREIGN KEY (invited_by) REFERENCES profiles(id);
  END IF;
END $$;