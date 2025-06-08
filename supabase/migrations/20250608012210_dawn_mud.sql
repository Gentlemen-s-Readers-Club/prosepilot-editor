/*
  # Create annotations system

  1. New Tables
    - `annotations`
      - `id` (uuid, primary key)
      - `chapter_id` (uuid, foreign key to chapters)
      - `user_id` (uuid, foreign key to profiles)
      - `content` (text, annotation content)
      - `start_offset` (integer, text start position)
      - `end_offset` (integer, text end position)
      - `selected_text` (text, the annotated text)
      - `status` (text, 'open' or 'resolved')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `annotation_replies`
      - `id` (uuid, primary key)
      - `annotation_id` (uuid, foreign key to annotations)
      - `user_id` (uuid, foreign key to profiles)
      - `content` (text, reply content)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their annotations
    - Allow viewing annotations for accessible chapters
*/

-- Create annotations table
CREATE TABLE IF NOT EXISTS annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (length(content) > 0 AND length(content) <= 1000),
  start_offset integer NOT NULL CHECK (start_offset >= 0),
  end_offset integer NOT NULL CHECK (end_offset >= start_offset),
  selected_text text NOT NULL CHECK (length(selected_text) > 0),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create annotation_replies table
CREATE TABLE IF NOT EXISTS annotation_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  annotation_id uuid NOT NULL REFERENCES annotations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (length(content) > 0 AND length(content) <= 1000),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_annotations_chapter_id ON annotations(chapter_id);
CREATE INDEX IF NOT EXISTS idx_annotations_user_id ON annotations(user_id);
CREATE INDEX IF NOT EXISTS idx_annotations_status ON annotations(status);
CREATE INDEX IF NOT EXISTS idx_annotations_created_at ON annotations(created_at);
CREATE INDEX IF NOT EXISTS idx_annotation_replies_annotation_id ON annotation_replies(annotation_id);
CREATE INDEX IF NOT EXISTS idx_annotation_replies_user_id ON annotation_replies(user_id);

-- Enable RLS
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotation_replies ENABLE ROW LEVEL SECURITY;

-- Annotations policies
CREATE POLICY "Users can view annotations for accessible chapters"
  ON annotations FOR SELECT
  TO authenticated
  USING (
    chapter_id IN (
      SELECT chapters.id FROM chapters
      JOIN books ON books.id = chapters.book_id
      WHERE (
        books.user_id = auth.uid() 
        OR books.team_id IN (
          SELECT id FROM teams 
          WHERE created_by = auth.uid() 
          AND is_active = true
        )
      )
    )
  );

CREATE POLICY "Users can create annotations on accessible chapters"
  ON annotations FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    chapter_id IN (
      SELECT chapters.id FROM chapters
      JOIN books ON books.id = chapters.book_id
      WHERE (
        books.user_id = auth.uid() 
        OR books.team_id IN (
          SELECT id FROM teams 
          WHERE created_by = auth.uid() 
          AND is_active = true
        )
      )
    )
  );

CREATE POLICY "Users can update their own annotations"
  ON annotations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own annotations"
  ON annotations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Annotation replies policies
CREATE POLICY "Users can view replies for accessible annotations"
  ON annotation_replies FOR SELECT
  TO authenticated
  USING (
    annotation_id IN (
      SELECT annotations.id FROM annotations
      JOIN chapters ON chapters.id = annotations.chapter_id
      JOIN books ON books.id = chapters.book_id
      WHERE (
        books.user_id = auth.uid() 
        OR books.team_id IN (
          SELECT id FROM teams 
          WHERE created_by = auth.uid() 
          AND is_active = true
        )
      )
    )
  );

CREATE POLICY "Users can create replies on accessible annotations"
  ON annotation_replies FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    annotation_id IN (
      SELECT annotations.id FROM annotations
      JOIN chapters ON chapters.id = annotations.chapter_id
      JOIN books ON books.id = chapters.book_id
      WHERE (
        books.user_id = auth.uid() 
        OR books.team_id IN (
          SELECT id FROM teams 
          WHERE created_by = auth.uid() 
          AND is_active = true
        )
      )
    )
  );

CREATE POLICY "Users can update their own replies"
  ON annotation_replies FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own replies"
  ON annotation_replies FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_annotations_updated_at
  BEFORE UPDATE ON annotations
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_annotation_replies_updated_at
  BEFORE UPDATE ON annotation_replies
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();