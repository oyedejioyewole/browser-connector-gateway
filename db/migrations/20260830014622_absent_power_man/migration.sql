CREATE TABLE `allowed_clients` (
	`allowed_client_id` text PRIMARY KEY,
	`client_name` text NOT NULL UNIQUE,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
