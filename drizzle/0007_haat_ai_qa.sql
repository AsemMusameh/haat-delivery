CREATE TABLE IF NOT EXISTS `knowledge_articles` (
  `id` text PRIMARY KEY NOT NULL, `title` text NOT NULL, `summary` text NOT NULL, `content` text NOT NULL,
  `category` text NOT NULL, `department` text NOT NULL, `keywords` text NOT NULL, `language` text NOT NULL,
  `status` text DEFAULT 'active' NOT NULL, `version` integer DEFAULT 1 NOT NULL, `updated_by` text NOT NULL,
  `updated_at` text NOT NULL, `source_label` text NOT NULL
);
CREATE INDEX IF NOT EXISTS `idx_knowledge_status_category` ON `knowledge_articles` (`status`,`category`);
CREATE INDEX IF NOT EXISTS `idx_knowledge_department` ON `knowledge_articles` (`department`,`status`);
CREATE TABLE IF NOT EXISTS `qa_evaluations` (
  `id` text PRIMARY KEY NOT NULL, `user_key` text NOT NULL, `employee_name` text NOT NULL, `department` text NOT NULL,
  `evaluation_date` text NOT NULL, `evaluation_id` text NOT NULL, `channel` text NOT NULL, `score` integer NOT NULL,
  `rating` text NOT NULL, `evaluator` text NOT NULL, `notes` text, `metrics_json` text NOT NULL, `source_file` text NOT NULL, `created_at` text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_qa_evaluation_id` ON `qa_evaluations` (`user_key`,`evaluation_id`);
CREATE INDEX IF NOT EXISTS `idx_qa_employee_month` ON `qa_evaluations` (`user_key`,`evaluation_date`);
CREATE TABLE IF NOT EXISTS `simulator_results` (
  `id` text PRIMARY KEY NOT NULL, `user_key` text NOT NULL, `employee_name` text NOT NULL, `level` text NOT NULL,
  `scenario_title` text NOT NULL, `overall_score` integer NOT NULL, `scores_json` text NOT NULL, `feedback_json` text NOT NULL, `created_at` text NOT NULL
);
CREATE INDEX IF NOT EXISTS `idx_simulator_user_date` ON `simulator_results` (`user_key`,`created_at`);
PRAGMA optimize;
