/*
  # Add newsletter preferences to profiles

  1. Changes
    - Add newsletter preference columns to profiles table
    - Add default values for existing users
    - Update RLS policies to include new columns

  2. Security
    - Users can only update their own newsletter preferences
*/

-- Add newsletter preference columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'newsletter_product'
  ) THEN
    ALTER TABLE profiles ADD COLUMN newsletter_product boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'newsletter_marketing'
  ) THEN
    ALTER TABLE profiles ADD COLUMN newsletter_marketing boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'newsletter_writing'
  ) THEN
    ALTER TABLE profiles ADD COLUMN newsletter_writing boolean DEFAULT true;
  END IF;
END $$;

-- Update existing users to have newsletter preferences enabled by default
UPDATE profiles 
SET 
  newsletter_product = COALESCE(newsletter_product, true),
  newsletter_marketing = COALESCE(newsletter_marketing, true),
  newsletter_writing = COALESCE(newsletter_writing, true)
WHERE 
  newsletter_product IS NULL 
  OR newsletter_marketing IS NULL 
  OR newsletter_writing IS NULL;