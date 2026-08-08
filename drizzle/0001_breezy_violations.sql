ALTER TABLE `reply_templates` ADD `department` text DEFAULT 'chat' NOT NULL;
--> statement-breakpoint
UPDATE `work_tools`
SET `url` = 'https://hub.haat.delivery/devices-management/tickets/new',
    `description_ar` = 'فتح تيكت جديد لمشاكل الأجهزة ومتابعة طلب الصيانة.',
    `description_en` = 'Open a new device issue ticket and follow up on maintenance.'
WHERE `id` = 'devices' AND `url` = 'https://devices.haat.delivery/';
