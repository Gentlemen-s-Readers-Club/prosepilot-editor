/*
  # Create Book-Related Tables

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `author_name` (text, required)
      - `isbn` (text)
      - `cover_url` (text)
      - `synopsis` (text)
      - `status` (text, required)
      - `language_id` (uuid, foreign key to languages)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `book_categories`
      - `book_id` (uuid, foreign key to books)
      - `category_id` (uuid, foreign key to categories)
      - Primary key is (book_id, category_id)

    - `chapters`
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key to books)
      - `title` (text, required)
      - `order` (integer, required)
      - `type` (text, required) - either 'chapter' or 'page'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `chapter_versions`
      - `id` (uuid, primary key)
      - `chapter_id` (uuid, foreign key to chapters)
      - `content` (text)
      - `created_at` (timestamp)
      - `created_by` (uuid, foreign key to users)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Indexes
    - Add indexes for foreign keys and frequently queried columns
*/

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author_name text NOT NULL,
  isbn text,
  cover_url text,
  synopsis text,
  status text NOT NULL CHECK (status IN ('draft', 'writing', 'reviewing', 'published', 'archived')),
  language_id uuid NOT NULL REFERENCES languages(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create book_categories table
CREATE TABLE IF NOT EXISTS book_categories (
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title text NOT NULL,
  "order" integer NOT NULL,
  type text NOT NULL CHECK (type IN ('chapter', 'page')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chapter_versions table
CREATE TABLE IF NOT EXISTS chapter_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  content text,
  created_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_language_id ON books(language_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapter_versions_chapter_id ON chapter_versions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters("order");

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for books
CREATE POLICY "Users can create their own books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own books"
  ON books
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
  ON books
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for book_categories
CREATE POLICY "Users can manage categories for their own books"
  ON book_categories
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books
      WHERE books.id = book_categories.book_id
      AND books.user_id = auth.uid()
    )
  );

-- Create policies for chapters
CREATE POLICY "Users can manage chapters for their own books"
  ON chapters
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books
      WHERE books.id = chapters.book_id
      AND books.user_id = auth.uid()
    )
  );

-- Create policies for chapter_versions
CREATE POLICY "Users can manage chapter versions for their own books"
  ON chapter_versions
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chapters
      JOIN books ON books.id = chapters.book_id
      WHERE chapters.id = chapter_versions.chapter_id
      AND books.user_id = auth.uid()
    )
  );

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();