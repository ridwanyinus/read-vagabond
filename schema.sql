CREATE TABLE IF NOT EXISTS chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  volume INTEGER NOT NULL,
  release_date TEXT,
  page_count INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chapter_number ON chapters(number);
CREATE INDEX IF NOT EXISTS idx_chapter_volume ON chapters(volume);
