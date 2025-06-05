/*
  # Add narrator, style, and tone tables
  
  1. New Tables
    - `narrators`: Stores different narrator perspectives
    - `literature_styles`: Stores different literary styles
    - `tones`: Stores different writing tones

  2. Data
    - Populates each table with predefined options
*/

-- Create narrators table
CREATE TABLE IF NOT EXISTS narrators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create literature_styles table
CREATE TABLE IF NOT EXISTS literature_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tones table
CREATE TABLE IF NOT EXISTS tones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert narrator options
INSERT INTO narrators (name) VALUES
  ('First-person'),
  ('Second-person'),
  ('Third-person limited'),
  ('Third-person omniscient'),
  ('Third-person objective'),
  ('Unreliable narrator'),
  ('Stream of consciousness'),
  ('Alternating narrators')
ON CONFLICT (name) DO NOTHING;

-- Insert literature styles
INSERT INTO literature_styles (name) VALUES
  ('Realism'),
  ('Romanticism'),
  ('Modernism'),
  ('Postmodernism'),
  ('Naturalism'),
  ('Symbolism'),
  ('Surrealism'),
  ('Expressionism'),
  ('Gothic'),
  ('Absurdism'),
  ('Classicism'),
  ('Impressionism'),
  ('Minimalism'),
  ('Magical Realism'),
  ('Transcendentalism'),
  ('Existentialism'),
  ('Baroque'),
  ('Dadaism'),
  ('Futurism'),
  ('Regionalism')
ON CONFLICT (name) DO NOTHING;

-- Insert tones
INSERT INTO tones (name) VALUES
  ('Joyful'),
  ('Serious'),
  ('Humorous'),
  ('Sarcastic'),
  ('Melancholic'),
  ('Optimistic'),
  ('Pessimistic'),
  ('Nostalgic'),
  ('Angry'),
  ('Ironic'),
  ('Reflective'),
  ('Hopeful'),
  ('Somber'),
  ('Suspenseful'),
  ('Bitter'),
  ('Playful'),
  ('Affectionate'),
  ('Dramatic'),
  ('Formal'),
  ('Informal')
ON CONFLICT (name) DO NOTHING;