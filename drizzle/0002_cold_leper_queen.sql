ALTER TABLE `reply_templates` ADD `content_type` text DEFAULT 'macro' NOT NULL;
--> statement-breakpoint
DELETE FROM `reply_templates` WHERE `department` = 'chat';
