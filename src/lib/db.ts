import { sql, eq, asc } from "drizzle-orm";
import { chaptersTable, volumesTable } from "../db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

export const getMangaLibraryCounts = async (db: DrizzleD1Database) => {
  const data = await db
    .select({
      volumeCount: sql<number>`count(distinct ${volumesTable.id})`,
      chapterCount: sql<number>`count(${chaptersTable.id})`,
    })
    .from(volumesTable)
    .innerJoin(chaptersTable, eq(chaptersTable.volumeId, volumesTable.id));
  return data[0];
};

export const getMangaVolumes = async (db: DrizzleD1Database) => {
  const data = await db
    .select({
      number: volumesTable.number,
      releaseDate: sql<number>`min(${chaptersTable.releaseDate})`,
      chapterCount: sql<number>`count(${chaptersTable.id})`,
      firstChapter: sql<number>`min(${chaptersTable.number})`,
      lastChapter: sql<number>`max(${chaptersTable.number})`,
    })
    .from(volumesTable)
    .innerJoin(chaptersTable, eq(chaptersTable.volumeId, volumesTable.id))
    .groupBy(volumesTable.id, volumesTable.number)
    .orderBy(asc(volumesTable.number));
  return data;
};

export const getMangaVolumeById = async (
  db: DrizzleD1Database,
  volumeId: number,
) => {
  const data = await db
    .select({
      number: volumesTable.number,
      releaseDate: sql<number>`min(${chaptersTable.releaseDate})`,
      chapterCount: sql<number>`count(${chaptersTable.id})`,
      firstChapter: sql<number>`min(${chaptersTable.number})`,
      lastChapter: sql<number>`max(${chaptersTable.number})`,
    })
    .from(volumesTable)
    .innerJoin(chaptersTable, eq(chaptersTable.volumeId, volumesTable.id))
    .where(eq(volumesTable.id, volumeId))
    .groupBy(volumesTable.id, volumesTable.number);
  return data[0];
};

export const getMangaChaptersByVolumeId = async (
  db: DrizzleD1Database,
  volumeId: number,
) => {
  const data = await db
    .select({
      number: chaptersTable.number,
      title: chaptersTable.title,
      releaseDate: chaptersTable.releaseDate,
    })
    .from(chaptersTable)
    .where(eq(chaptersTable.volumeId, volumeId))
    .orderBy(asc(chaptersTable.number));
  return data;
};

export const getMangaChapterById = async (
  db: DrizzleD1Database,
  chapterId: number,
) => {
  const data = await db
    .select({
      title: chaptersTable.title,
      number: chaptersTable.number,
      pageCount: chaptersTable.pageCount,
      releaseDate: chaptersTable.releaseDate,
    })
    .from(chaptersTable)
    .where(eq(chaptersTable.id, chapterId));
  return data[0];
};
