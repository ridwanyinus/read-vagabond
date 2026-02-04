# Database Schema

---

## author

| Column     | Type      | Notes            |
| ---------- | --------- | ---------------- |
| id         | key       | Primary key      |
| name       | string    | Author name      |
| created_at | timestamp | Creation time    |
| updated_at | timestamp | Last update time |

---

## manga

| Column      | Type      | Notes                        |
| ----------- | --------- | ---------------------------- |
| id          | key       | Primary key                  |
| author_id   | key       | References `author(id)`      |
| artist_id   | key       | References `author(id)`      |
| title       | string    | Manga title                  |
| description | text      | Manga description            |
| status      | string    | Ongoing / Completed / Hiatus |
| created_at  | timestamp | Creation time                |
| updated_at  | timestamp | Last update time             |

**Constraints**

- `UNIQUE (author_id, title)`

---

## volume

| Column       | Type      | Notes                  |
| ------------ | --------- | ---------------------- |
| id           | key       | Primary key            |
| manga_id     | key       | References `manga(id)` |
| number       | integer   | Volume number          |
| release_date | date      | Release date           |
| created_at   | timestamp | Creation time          |
| updated_at   | timestamp | Last update time       |

**Constraints**

- `UNIQUE (manga_id, number)`

---

## chapter

| Column       | Type      | Notes                   |
| ------------ | --------- | ----------------------- |
| id           | key       | Primary key             |
| volume_id    | key       | References `volume(id)` |
| title        | string    | Chapter title           |
| number       | integer   | Chapter number          |
| page_count   | integer   | Number of pages         |
| release_date | date      | Release date            |
| created_at   | timestamp | Creation time           |
| updated_at   | timestamp | Last update time        |

**Constraints**

- `UNIQUE (volume_id, number)`
