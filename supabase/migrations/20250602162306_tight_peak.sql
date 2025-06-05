/*
  # Create categories and languages tables

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
    - `languages`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)

  2. Initial Data
    - Populates both tables with predefined values
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert categories
INSERT INTO categories (name) VALUES
  ('Fiction'),
  ('Non-Fiction'),
  ('Mystery'),
  ('Thriller'),
  ('Romance'),
  ('Science Fiction'),
  ('Fantasy'),
  ('Historical Fiction'),
  ('Biography'),
  ('Memoir'),
  ('Self-Help'),
  ('Health'),
  ('Travel'),
  ('Children''s Books'),
  ('Young Adult'),
  ('Graphic Novels'),
  ('Horror'),
  ('Poetry'),
  ('Religion'),
  ('Spirituality'),
  ('Science'),
  ('History'),
  ('Business'),
  ('Cooking'),
  ('Art'),
  ('Photography'),
  ('Education'),
  ('True Crime'),
  ('Politics'),
  ('Philosophy'),
  ('Sports'),
  ('Humor'),
  ('Parenting'),
  ('Technology'),
  ('Essays'),
  ('Classic Literature')
ON CONFLICT (name) DO NOTHING;

-- Insert languages
INSERT INTO languages (name) VALUES
  ('English'),
  ('Spanish'),
  ('French'),
  ('German'),
  ('Italian'),
  ('Portuguese'),
  ('Russian'),
  ('Chinese'),
  ('Japanese'),
  ('Korean'),
  ('Arabic'),
  ('Hindi'),
  ('Bengali'),
  ('Dutch'),
  ('Polish'),
  ('Turkish'),
  ('Vietnamese'),
  ('Thai'),
  ('Greek'),
  ('Swedish')
ON CONFLICT (name) DO NOTHING;