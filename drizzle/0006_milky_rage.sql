CREATE TABLE `coverage_areas` (
	`code` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_ar` text NOT NULL,
	`x` integer NOT NULL,
	`y` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`updated_at` text NOT NULL
);
