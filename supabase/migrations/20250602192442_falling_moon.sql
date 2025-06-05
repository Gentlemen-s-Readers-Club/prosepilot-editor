/*
  # Add mock chapters and versions data

  1. New Data
    - Creates a mock book "The Chronicles of Eldoria"
    - Adds 4 chapters (3 regular chapters and 1 page)
    - Adds multiple versions for each chapter showing content evolution
  
  2. Content
    - Rich HTML content with proper formatting
    - Includes headings, paragraphs, blockquotes, and lists
    - Follows a cohesive fantasy story narrative
*/

-- Insert mock book if it doesn't exist
DO $$
DECLARE
  v_book_id uuid;
  v_user_id uuid;
  v_chapter1_id uuid;
  v_chapter2_id uuid;
  v_chapter3_id uuid;
  v_page1_id uuid;
BEGIN
  -- Get first user ID
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  -- Generate UUIDs
  v_book_id := gen_random_uuid();
  v_chapter1_id := gen_random_uuid();
  v_chapter2_id := gen_random_uuid();
  v_chapter3_id := gen_random_uuid();
  v_page1_id := gen_random_uuid();

  -- Insert book if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM books 
    WHERE title = 'The Chronicles of Eldoria'
  ) THEN
    INSERT INTO books (
      id,
      title,
      author_name,
      status,
      language_id,
      user_id
    )
    SELECT 
      v_book_id,
      'The Chronicles of Eldoria',
      'Sarah J. Blackwood',
      'writing',
      id,
      v_user_id
    FROM languages
    WHERE name = 'English'
    LIMIT 1;

    -- Insert chapters
    INSERT INTO chapters (
      id,
      book_id,
      title,
      "order",
      type
    )
    VALUES
      (v_chapter1_id, v_book_id, 'Chapter 1: The Awakening', 0, 'chapter'),
      (v_chapter2_id, v_book_id, 'Chapter 2: Shadows of the Past', 1, 'chapter'),
      (v_chapter3_id, v_book_id, 'Chapter 3: The Council of Elders', 2, 'chapter'),
      (v_page1_id, v_book_id, 'About the Author', 3, 'page');

    -- Insert chapter versions
    INSERT INTO chapter_versions (
      id,
      chapter_id,
      content,
      created_at,
      created_by
    )
    VALUES
      (
        gen_random_uuid(),
        v_chapter1_id,
        E'<h1>Chapter 1: The Awakening</h1>\n<p>The ancient prophecy spoke of a time when the barriers between worlds would thin, and magic would once again flow freely through the realm of Eldoria. As dawn broke over the Misty Mountains, casting long shadows across the Valley of Whispers, young Aria found herself standing at the threshold of destiny.</p>\n<p>The air crackled with an energy she had never felt before, and the morning dew seemed to sparkle with an otherworldly gleam. Something was different today – she could feel it in her bones, in the way the wind whispered through the ancient oaks that had stood guard over her village for countless generations.</p>\n<h2>The First Signs</h2>\n<p>It began with subtle changes: flowers blooming out of season, strange lights dancing in the forest at night, and animals behaving in peculiar ways. The village elders spoke in hushed tones of the old legends, of a time when humans and magical creatures lived in harmony, before the Great Divide.</p>\n<blockquote>\n<p>"When the seventh moon rises crimson, and the ancient stones sing their forgotten song, the Chosen One shall emerge from the shadows of ignorance into the light of true power."</p>\n</blockquote>\n<p>Aria had always dismissed these tales as mere bedtime stories, meant to entertain children on cold winter nights. But now, as she watched the unusual patterns forming in the morning mist, she wasn''t so sure anymore.</p>',
        '2025-03-15 14:30:00+00',
        v_user_id
      ),
      (
        gen_random_uuid(),
        v_chapter1_id,
        E'<h1>Chapter 1: The Awakening</h1>\n<p>In the realm of Eldoria, where magic once flowed as freely as water, the ancient prophecies told of a time when the veil between worlds would grow thin. As the sun rose over the Misty Mountains, painting the Valley of Whispers in shades of gold and amber, Aria stood at the edge of her village, watching the unusual patterns forming in the morning mist.</p>\n<p>There was something different in the air today – a crackling energy that made her skin tingle and her heart race with anticipation. The morning dew sparkled with an otherworldly gleam, and the wind carried whispers of change through the ancient oaks that had protected her village for generations.</p>',
        '2025-03-14 16:45:00+00',
        v_user_id
      ),
      (
        gen_random_uuid(),
        v_chapter1_id,
        E'<h1>Chapter 1: The Awakening</h1>\n<p>The prophecy was clear: when the time was right, magic would return to Eldoria. As morning light spilled over the mountains and into the valley below, Aria watched the mist swirl in strange patterns around her feet. Something felt different today, though she couldn''t quite explain what.</p>\n<p>The air seemed charged with possibility, and even the morning dew appeared to sparkle more brightly than usual. Through the ancient oaks that surrounded her village, the wind carried whispers of change.</p>',
        '2025-03-13 09:20:00+00',
        v_user_id
      ),
      (
        gen_random_uuid(),
        v_chapter2_id,
        E'<h1>Chapter 2: Shadows of the Past</h1>\n<p>The library of the Ancient Order stood silent and imposing, its towering shelves holding secrets that had remained undisturbed for centuries. Aria''s footsteps echoed through the dusty corridors as she made her way deeper into the heart of the repository of knowledge.</p>\n<p>Here, among yellowed scrolls and leather-bound tomes, she hoped to find answers to the questions that had plagued her since that fateful morning. The mark on her palm – a spiral pattern that seemed to shift and change like living smoke – had to mean something.</p>\n<h2>The Hidden Chronicles</h2>\n<p>In the deepest corner of the library, where even the most dedicated scholars rarely ventured, Aria discovered a section of books written in a script she had never seen before. Yet, somehow, she could understand the words as if they had been written in her native tongue.</p>\n<blockquote>\n<p>"The power lies dormant in the blood of the ancient lines, waiting for the moment when the stars align and the veil between worlds grows thin."</p>\n</blockquote>\n<p>As she read these words, the mark on her palm began to glow with a soft, pulsing light. The truth was beginning to reveal itself, one page at a time.</p>',
        '2025-03-15 14:30:00+00',
        v_user_id
      ),
      (
        gen_random_uuid(),
        v_chapter3_id,
        E'<h1>Chapter 3: The Council of Elders</h1>\n<p>The Great Hall of the Council was a marvel of ancient architecture, its crystal dome capturing and refracting the light of the setting sun in mesmerizing patterns across the marble floor. Twelve seats arranged in a perfect circle, each carved from a different type of wood, each representing one of the original families of Eldoria.</p>\n<p>Aria stood in the center of this circle, her heart pounding as the most powerful mages in the realm studied her with intense curiosity. The mark on her palm was now impossible to hide, its glow visible even through the thick fabric of her gloves.</p>\n<h2>The Revelation</h2>\n<p>High Elder Theron, his silver hair gleaming in the ethereal light, rose from his seat of ancient oak. His voice, though soft, carried the weight of centuries of wisdom. "In all our recorded history, there has never been a marking quite like this. The prophecies speak of signs, but this... this is unprecedented."</p>\n<blockquote>\n<p>"In times of greatest need, when darkness threatens to consume all, a beacon shall rise from among the common folk, bearing the mark of the First Mages."</p>\n</blockquote>\n<p>The council chambers erupted in whispers and murmurs. Aria could feel the weight of destiny settling upon her shoulders, heavy as a winter cloak.</p>',
        '2025-03-15 14:30:00+00',
        v_user_id
      ),
      (
        gen_random_uuid(),
        v_page1_id,
        E'<h1>About the Author</h1>\n<p>Sarah J. Blackwood is an award-winning fantasy author known for her intricate worldbuilding and compelling character development. Born in a small town nestled among the mountains, she grew up surrounded by the kind of landscapes that would later inspire her magical worlds.</p>\n<h2>Writing Journey</h2>\n<p>Sarah began writing stories at the age of seven, filling countless notebooks with tales of dragons, magical portals, and brave young heroes. Her formal journey into professional writing began after completing her Master''s degree in Medieval Literature, which heavily influences her fantasy worlds.</p>\n<h2>Awards and Recognition</h2>\n<ul>\n<li>Winner of the Golden Quill Award for Best New Fantasy Author (2024)</li>\n<li>Finalist for the World Fantasy Award (2023)</li>\n<li>Named one of the "Top 10 Fantasy Authors to Watch" by Literary Review</li>\n</ul>\n<p>When not writing, Sarah can be found hiking in the mountains, practicing traditional archery, or teaching creative writing at her local community college. She lives with her two cats, Merlin and Morgana, who serve as her first draft readers and critics.</p>',
        '2025-03-15 14:30:00+00',
        v_user_id
      );
  END IF;
END $$;