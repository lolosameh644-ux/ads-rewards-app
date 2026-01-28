ALTER TABLE `ad_views` MODIFY COLUMN `adId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `ad_views` ADD `createdAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isVpnUser` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `fraudScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastIpAddress` varchar(45);--> statement-breakpoint
ALTER TABLE `users` ADD `isBlocked` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `blockReason` varchar(255);--> statement-breakpoint
ALTER TABLE `withdrawal_requests` ADD `methodDetails` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `ad_views` DROP COLUMN `pointsEarned`;--> statement-breakpoint
ALTER TABLE `ad_views` DROP COLUMN `viewedAt`;--> statement-breakpoint
ALTER TABLE `withdrawal_requests` DROP COLUMN `contactInfo`;--> statement-breakpoint
ALTER TABLE `withdrawal_requests` DROP COLUMN `processedAt`;