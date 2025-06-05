/*
  # Add language codes to languages table

  1. Changes
    - Add code column to languages table
    - Update existing languages with their HTML language codes
    - Make code column required

  2. Implementation
    - Uses a safe approach to add and populate the column
    - Ensures all records have valid codes before enforcing NOT NULL
*/

-- Create a temporary column that allows NULL values
ALTER TABLE languages 
ADD COLUMN code_temp text;

-- Update existing languages with their HTML language codes
UPDATE languages SET code_temp = CASE name
  WHEN 'English' THEN 'en'
  WHEN 'Spanish' THEN 'es'
  WHEN 'French' THEN 'fr'
  WHEN 'German' THEN 'de'
  WHEN 'Italian' THEN 'it'
  WHEN 'Portuguese' THEN 'pt'
  WHEN 'Russian' THEN 'ru'
  WHEN 'Chinese' THEN 'zh'
  WHEN 'Japanese' THEN 'ja'
  WHEN 'Korean' THEN 'ko'
  WHEN 'Arabic' THEN 'ar'
  WHEN 'Hindi' THEN 'hi'
  WHEN 'Bengali' THEN 'bn'
  WHEN 'Dutch' THEN 'nl'
  WHEN 'Polish' THEN 'pl'
  WHEN 'Turkish' THEN 'tr'
  WHEN 'Vietnamese' THEN 'vi'
  WHEN 'Thai' THEN 'th'
  WHEN 'Greek' THEN 'el'
  WHEN 'Swedish' THEN 'sv'
  ELSE lower(substring(name from 1 for 2))  -- Fallback: first 2 letters lowercase
END;

-- Add the final column with NOT NULL constraint
ALTER TABLE languages 
ADD COLUMN code text NOT NULL 
DEFAULT 'en';  -- Temporary default to satisfy NOT NULL

-- Copy data from temporary column
UPDATE languages 
SET code = code_temp;

-- Remove temporary column and default value
ALTER TABLE languages 
DROP COLUMN code_temp;

ALTER TABLE languages 
ALTER COLUMN code DROP DEFAULT;