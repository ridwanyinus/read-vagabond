type Database = D1Database;

export async function getMetadata(db: Database) {
  const result = await db
    .prepare(
      `
      SELECT 
        COUNT(DISTINCT volume) as tankobon,
        COUNT(*) as chapters
      FROM chapters
    `,
    )
    .first<{ tankobon: number; chapters: number }>();

  return result || { tankobon: 0, chapters: 0 };
}

export async function getVolumes(db: Database) {
  const result = await db
    .prepare(
      `
      SELECT
        volume,
        MIN(release_date) as release_date,
        COUNT(*) as chapter_count,
        MIN(number) as first_chapter,
        MAX(number) as last_chapter
      FROM chapters
      WHERE volume IS NOT NULL
      GROUP BY volume
      ORDER BY volume ASC
    `,
    )
    .all<{
      volume: number;
      release_date: string;
      chapter_count: number;
      first_chapter: number;
      last_chapter: number;
    }>();

  return result?.results || [];
}

export async function getVolumeDetails(
  db: Database,
  volumeNumber: string | number,
) {
  const volumeData = await db
    .prepare(
      `
      SELECT 
        volume,
        MIN(number) as first_chapter,
        MAX(number) as last_chapter,
        COUNT(*) as chapter_count,
        MIN(release_date) as release_date
      FROM chapters 
      WHERE volume = ?
      GROUP BY volume
    `,
    )
    .bind(volumeNumber)
    .first<{
      volume: number;
      first_chapter: number;
      last_chapter: number;
      chapter_count: number;
      release_date: string;
    }>();

  if (!volumeData) {
    return null;
  }

  const chapters = await db
    .prepare(
      `
      SELECT number, title, description, release_date 
      FROM chapters 
      WHERE volume = ? 
      ORDER BY number ASC
    `,
    )
    .bind(volumeNumber)
    .all<{
      number: number;
      title: string;
      description: string | null;
      release_date: string;
    }>();

  return {
    volume: volumeData,
    chapters: chapters?.results || [],
  };
}

export async function getChapterDetails(
  db: Database,
  chapterNumber: string | number,
) {
  const chapter = await db
    .prepare(`SELECT * FROM chapters WHERE number = ?`)
    .bind(chapterNumber)
    .first<{
      id: number;
      number: number;
      title: string;
      description: string | null;
      volume: number;
      release_date: string;
      page_count: number;
      created_at: string;
    }>();

  return chapter;
}
