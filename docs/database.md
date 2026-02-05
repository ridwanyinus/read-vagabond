# Database Schema

This document describes the database schema for the Vagabond manga reader application.

## Context and Cross-references

- **Database Platform**: Cloudflare D1 (SQLite-compatible)
- **ORM**: Drizzle ORM
- **Schema Definition**: [src/db/schema.ts](../src/db/schema.ts)
- **Migrations**: [drizzle/migrations/](../drizzle/migrations/)

The schema is defined using Drizzle ORM and deployed to Cloudflare D1. All timestamps are stored as Unix epoch integers. Foreign key relationships are enforced at the application level through Drizzle ORM.

---

## authors

| Column     | Type      | SQL Type            | Nullable | Notes                          |
| ---------- | --------- | ------------------- | -------- | ------------------------------ |
| id         | key       | INTEGER PRIMARY KEY | NOT NULL | Auto-increment primary key     |
| name       | string    | TEXT                | NOT NULL | Author name                    |
| created_at | timestamp | INTEGER             | NOT NULL | Creation time (Unix timestamp) |

**SQL Type Mappings**:

- `id` → `INTEGER PRIMARY KEY` (auto-increment)
- `name` → `TEXT NOT NULL`
- `created_at` → `INTEGER NOT NULL DEFAULT (unixepoch())`

**Default Values**:

- `created_at`: Defaults to `unixepoch()` (current Unix timestamp)

**Indexes**:

- Primary key index on `id` (automatic)

---

## mangas

| Column      | Type      | SQL Type            | Nullable | Notes                          |
| ----------- | --------- | ------------------- | -------- | ------------------------------ |
| id          | key       | INTEGER PRIMARY KEY | NOT NULL | Auto-increment primary key     |
| author_id   | key       | INTEGER             | NOT NULL | References `authors(id)`       |
| artist_id   | key       | INTEGER             | NOT NULL | References `authors(id)`       |
| title       | string    | TEXT                | NOT NULL | Manga title                    |
| description | text      | TEXT                | OPTIONAL | Manga description              |
| status      | string    | TEXT                | NOT NULL | Ongoing / Completed / Hiatus   |
| created_at  | timestamp | INTEGER             | NOT NULL | Creation time (Unix timestamp) |

**SQL Type Mappings**:

- `id` → `INTEGER PRIMARY KEY` (auto-increment)
- `author_id` → `INTEGER NOT NULL` (foreign key)
- `artist_id` → `INTEGER NOT NULL` (foreign key)
- `title` → `TEXT NOT NULL`
- `description` → `TEXT` (nullable)
- `status` → `TEXT NOT NULL`
- `created_at` → `INTEGER NOT NULL DEFAULT (unixepoch())`

**Default Values**:

- `created_at`: Defaults to `unixepoch()` (current Unix timestamp)

**Constraints**:

- `UNIQUE (author_id, title)` - Prevents duplicate manga titles by the same author

**Recommended Indexes**:

- Primary key index on `id` (automatic)
- Index on `author_id` (for foreign key lookups)
- Index on `artist_id` (for foreign key lookups)
- Unique composite index on `(author_id, title)` (enforced by constraint)

---

## volumes

| Column       | Type      | SQL Type            | Nullable | Notes                          |
| ------------ | --------- | ------------------- | -------- | ------------------------------ |
| id           | key       | INTEGER PRIMARY KEY | NOT NULL | Auto-increment primary key     |
| manga_id     | key       | INTEGER             | NOT NULL | References `mangas(id)`        |
| number       | integer   | INTEGER             | NOT NULL | Volume number                  |
| release_date | date      | INTEGER             | OPTIONAL | Release date (Unix timestamp)  |
| created_at   | timestamp | INTEGER             | NOT NULL | Creation time (Unix timestamp) |

**SQL Type Mappings**:

- `id` → `INTEGER PRIMARY KEY` (auto-increment)
- `manga_id` → `INTEGER NOT NULL` (foreign key)
- `number` → `INTEGER NOT NULL`
- `release_date` → `INTEGER` (nullable, stored as Unix timestamp)
- `created_at` → `INTEGER NOT NULL DEFAULT (unixepoch())`

**Default Values**:

- `created_at`: Defaults to `unixepoch()` (current Unix timestamp)

**Constraints**:

- `UNIQUE (manga_id, number)` - Prevents duplicate volume numbers within a manga

**Recommended Indexes**:

- Primary key index on `id` (automatic)
- Index on `manga_id` (for foreign key lookups)
- Unique composite index on `(manga_id, number)` (enforced by constraint)

---

## chapters

| Column       | Type      | SQL Type            | Nullable | Notes                          |
| ------------ | --------- | ------------------- | -------- | ------------------------------ |
| id           | key       | INTEGER PRIMARY KEY | NOT NULL | Auto-increment primary key     |
| volume_id    | key       | INTEGER             | NOT NULL | References `volumes(id)`       |
| title        | string    | TEXT                | NOT NULL | Chapter title                  |
| number       | integer   | INTEGER             | NOT NULL | Chapter number                 |
| page_count   | integer   | INTEGER             | NOT NULL | Number of pages                |
| release_date | date      | INTEGER             | OPTIONAL | Release date (Unix timestamp)  |
| created_at   | timestamp | INTEGER             | NOT NULL | Creation time (Unix timestamp) |

**SQL Type Mappings**:

- `id` → `INTEGER PRIMARY KEY` (auto-increment)
- `volume_id` → `INTEGER NOT NULL` (foreign key)
- `title` → `TEXT NOT NULL`
- `number` → `INTEGER NOT NULL`
- `page_count` → `INTEGER NOT NULL`
- `release_date` → `INTEGER` (nullable, stored as Unix timestamp)
- `created_at` → `INTEGER NOT NULL DEFAULT (unixepoch())`

**Default Values**:

- `created_at`: Defaults to `unixepoch()` (current Unix timestamp)

**Constraints**:

- `UNIQUE (volume_id, number)` - Prevents duplicate chapter numbers within a volume

**Recommended Indexes**:

- Primary key index on `id` (automatic)
- Index on `volume_id` (for foreign key lookups)
- Unique composite index on `(volume_id, number)` (enforced by constraint)
