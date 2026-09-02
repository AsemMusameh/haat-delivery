CREATE TABLE `couriers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`area` text NOT NULL,
	`shift` text NOT NULL,
	`notes` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_key` text NOT NULL,
	`employee_name` text NOT NULL,
	`employee_id` text NOT NULL,
	`department` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`details` text NOT NULL,
	`from_date` text,
	`to_date` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`manager_note` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portal_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`group_name` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pulse_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_key` text NOT NULL,
	`entry_date` text NOT NULL,
	`mood` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
