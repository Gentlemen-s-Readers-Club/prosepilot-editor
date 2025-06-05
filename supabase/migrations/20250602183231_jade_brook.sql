/*
  # Insert mock books

  This migration adds 16 sample books with varied data for testing and demonstration purposes.

  1. Data Population
    - Inserts 16 books with different titles, categories, and statuses
    - Associates books with categories
    - Creates initial chapters for each book
*/

-- Function to get a random user ID (for demo purposes)
CREATE OR REPLACE FUNCTION get_random_user_id()
RETURNS uuid AS $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users LIMIT 1;
  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- Insert mock books
DO $$ 
DECLARE
  v_user_id uuid;
  v_book_id uuid;
  v_english_id uuid;
  v_spanish_id uuid;
  v_french_id uuid;
BEGIN
  -- Get user ID
  v_user_id := get_random_user_id();
  
  -- Get language IDs
  SELECT id INTO v_english_id FROM languages WHERE name = 'English';
  SELECT id INTO v_spanish_id FROM languages WHERE name = 'Spanish';
  SELECT id INTO v_french_id FROM languages WHERE name = 'French';

  -- Fantasy Novel
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'The Crystal Scepter',
    'Sarah Anderson',
    'writing',
    v_english_id,
    v_user_id,
    'In a world where magic is controlled through ancient crystals, one apprentice discovers a power that could change everything.',
    'https://images.pexels.com/photos/1738434/pexels-photo-1738434.jpeg'
  ) RETURNING id INTO v_book_id;
  
  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Fantasy', 'Young Adult');

  -- Mystery Thriller
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'Silent Whispers',
    'Sarah Anderson',
    'published',
    v_english_id,
    v_user_id,
    'A detective races against time to solve a series of mysterious disappearances in a small coastal town.',
    'https://images.pexels.com/photos/1738434/pexels-photo-1738434.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Mystery', 'Thriller');

  -- Historical Romance
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'Echoes of Yesterday',
    'Sarah Anderson',
    'reviewing',
    v_english_id,
    v_user_id,
    'A tale of forbidden love set against the backdrop of 19th century Paris.',
    'https://images.pexels.com/photos/3747463/pexels-photo-3747463.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Romance', 'Historical Fiction');

  -- Science Fiction
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'Beyond the Stars',
    'Sarah Anderson',
    'draft',
    v_english_id,
    v_user_id,
    'A space exploration mission discovers an ancient alien artifact that could hold the key to humanity''s future.',
    'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Science Fiction');

  -- Contemporary Fiction
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'The Coffee Shop',
    'Sarah Anderson',
    'writing',
    v_spanish_id,
    v_user_id,
    'Intersecting lives and stories unfold in a busy city coffee shop over the course of one day.',
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Fiction');

  -- Horror
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'The Haunted Mirror',
    'Sarah Anderson',
    'archived',
    v_english_id,
    v_user_id,
    'An antique mirror holds dark secrets that begin to affect its new owners.',
    'https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Horror');

  -- Children's Book
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'The Magic Garden',
    'Sarah Anderson',
    'published',
    v_french_id,
    v_user_id,
    'A whimsical tale about a garden where flowers can talk and dreams come true.',
    'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Children''s Books');

  -- Self-Help
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'Your Best Life Now',
    'Sarah Anderson',
    'writing',
    v_english_id,
    v_user_id,
    'A practical guide to achieving your goals and living your dreams.',
    'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Self-Help');

  -- Travel Memoir
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'Wanderlust',
    'Sarah Anderson',
    'reviewing',
    v_english_id,
    v_user_id,
    'A personal journey through Southeast Asia that changed everything.',
    'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Travel', 'Memoir');

  -- Poetry Collection
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'Midnight Verses',
    'Sarah Anderson',
    'published',
    v_english_id,
    v_user_id,
    'A collection of poems exploring themes of love, loss, and redemption.',
    'https://images.pexels.com/photos/3328892/pexels-photo-3328892.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Poetry');

  -- Historical Fiction
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'The Last Queen',
    'Sarah Anderson',
    'draft',
    v_spanish_id,
    v_user_id,
    'The untold story of a forgotten queen who changed the course of history.',
    'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Historical Fiction');

  -- Science Book
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'The Hidden Universe',
    'Sarah Anderson',
    'writing',
    v_english_id,
    v_user_id,
    'An exploration of the mysteries of quantum physics and cosmic phenomena.',
    'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Science');

  -- Cookbook
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'Mediterranean Kitchen',
    'Sarah Anderson',
    'published',
    v_french_id,
    v_user_id,
    'A collection of authentic Mediterranean recipes passed down through generations.',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Cooking');

  -- Business Book
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'The Innovation Code',
    'Sarah Anderson',
    'reviewing',
    v_english_id,
    v_user_id,
    'A guide to fostering creativity and innovation in business.',
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Business');

  -- Graphic Novel
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'City of Dreams',
    'Sarah Anderson',
    'writing',
    v_english_id,
    v_user_id,
    'A noir-style story about a detective in a cyberpunk future.',
    'https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Graphic Novels');

  -- Philosophy Book
  INSERT INTO books (title, author_name, status, language_id, user_id, synopsis, cover_url)
  VALUES (
    'The Nature of Being',
    'Sarah Anderson',
    'draft',
    v_english_id,
    v_user_id,
    'An exploration of consciousness and the fundamental nature of reality.',
    'https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg'
  ) RETURNING id INTO v_book_id;

  INSERT INTO book_categories (book_id, category_id)
  SELECT v_book_id, id FROM categories WHERE name IN ('Philosophy');

END $$;