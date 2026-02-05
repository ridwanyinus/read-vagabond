CREATE UNIQUE INDEX `chapters_volume_id_number_unique` ON `chapters` (`volume_id`,`number`);--> statement-breakpoint
CREATE UNIQUE INDEX `mangas_author_id_title_unique` ON `mangas` (`author_id`,`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `volumes_manga_id_number_unique` ON `volumes` (`manga_id`,`number`);