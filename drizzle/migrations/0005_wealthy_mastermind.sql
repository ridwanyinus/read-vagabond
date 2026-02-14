DROP INDEX `chapters_number_idx`;--> statement-breakpoint
CREATE INDEX `chapters_number_idx` ON `chapters` (`number`);--> statement-breakpoint
DROP INDEX `volumes_number_idx`;--> statement-breakpoint
CREATE INDEX `volumes_number_idx` ON `volumes` (`number`);