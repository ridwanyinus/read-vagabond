# Database Schema

---

## authors

| Column     | Type      | Notes         |
| ---------- | --------- | ------------- |
| id         | key       | Primary key   |
| name       | string    | Author name   |
| created_at | timestamp | Creation time |

---

## mangas

| Column      | Type      | Notes                        |
| ----------- | --------- | ---------------------------- |
| id          | key       | Primary key                  |
| author_id   | key       | References `authors(id)`     |
| artist_id   | key       | References `authors(id)`     |
| title       | string    | Manga title                  |
| description | text      | Manga description            |
| status      | string    | Ongoing / Completed / Hiatus |
| created_at  | timestamp | Creation time                |

**Constraints**

- `UNIQUE (author_id, title)`

---

## volumes

| Column       | Type      | Notes                   |
| ------------ | --------- | ----------------------- |
| id           | key       | Primary key             |
| manga_id     | key       | References `mangas(id)` |
| number       | integer   | Volume number           |
| release_date | date      | Release date            |
| created_at   | timestamp | Creation time           |

**Constraints**

- `UNIQUE (manga_id, number)`

---

## chapters

| Column       | Type      | Notes                    |
| ------------ | --------- | ------------------------ |
| id           | key       | Primary key              |
| volume_id    | key       | References `volumes(id)` |
| title        | string    | Chapter title            |
| number       | integer   | Chapter number           |
| page_count   | integer   | Number of pages          |
| release_date | date      | Release date             |
| created_at   | timestamp | Creation time            |

**Constraints**

- `UNIQUE (volume_id, number)`
