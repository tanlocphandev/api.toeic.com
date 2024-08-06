
CREATE DATABASE IF NOT EXISTS `db_toeic_dev` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE `db_toeic_dev`;

CREATE TABLE IF NOT EXISTS `users` (
    `user_id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id_prefix` varchar(255) NOT NULL,
    `user_fullName` varchar(255) DEFAULT NULL,
    `user_password` varchar(255) DEFAULT NULL,
    `user_salt` varchar(255) DEFAULT NULL,
    `user_email` varchar(255) DEFAULT NULL,
    `user_sex` enum('male', 'female') DEFAULT NULL,
    `user_avatar` varchar(255) DEFAULT NULL,
    `user_role` enum('admin', 'user') DEFAULT NULL,
    `user_dob` date DEFAULT NULL,
    `user_status` enum('active', 'inactive', 'deleted') DEFAULT 'active',
    `user_verify` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `users` CHANGE `user_avatar` `user_avatar` JSON DEFAULT NULL;

ALTER TABLE `users` ADD IF NOT EXISTS `user_exam_target` INT DEFAULT 550 CHECK(user_exam_target > 0 AND user_exam_target <= 990) AFTER `user_dob`;

ALTER TABLE `users` CHANGE `user_role` `user_role` enum('admin', 'user', 'teacher') DEFAULT NULL;

CREATE TABLE IF NOT EXISTS `key_tokens` (
    `key_id` VARCHAR(16) NOT NULL,
    `user_id` INT NOT NULL,
    `public_key` VARCHAR(255) NOT NULL,
    `private_key` VARCHAR(255) NOT NULL,
    `refresh_token_used` JSON DEFAULT '[]',
    `refresh_token` VARCHAR(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
    PRIMARY KEY (`key_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `tags` (
    `tag_id` VARCHAR(16) NOT NULL,
    `tag_name` VARCHAR(255) NOT NULL UNIQUE,
    `tag_slug` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`tag_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `parts` (
    `part_id` VARCHAR(16) NOT NULL,
    `part_name` VARCHAR(255) NOT NULL UNIQUE,
    `part_slug` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`part_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `parts` ADD IF NOT EXISTS `part_desc` TEXT DEFAULT NULL AFTER `part_slug`;
ALTER TABLE `parts` ADD IF NOT EXISTS `part_number` INT NOT NULL UNIQUE AFTER `part_slug`;

CREATE TABLE IF NOT EXISTS `question_types` (
    `type_id` INT NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`type_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1000;

ALTER TABLE `question_types` ADD IF NOT EXISTS `part_id` VARCHAR(16) NOT NULL AFTER `type_name`;
ALTER TABLE `question_types` ADD IF NOT EXISTS `type_slug` VARCHAR(255) DEFAULT NULL AFTER `type_name`;

ALTER TABLE `question_types`
DROP FOREIGN KEY IF EXISTS `fk_question_types_far_parts`;

DROP INDEX IF EXISTS `fk_question_types_far_parts_idx` ON `question_types`;

ALTER TABLE `question_types`
ADD INDEX `fk_question_types_far_parts_idx` (`part_id` ASC),
ADD CONSTRAINT `fk_question_types_far_parts`
  FOREIGN KEY (`part_id`)
  REFERENCES `parts` (`part_id`)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS `tests` (
    `test_id` INT NOT NULL AUTO_INCREMENT,
    `test_name` VARCHAR(255) NOT NULL UNIQUE,
    `test_slug` VARCHAR(255) NOT NULL UNIQUE,
    `test_of_year` VARCHAR(4) DEFAULT NULL,
    `test_duration` INT DEFAULT 120,
    `test_comment_count` INT DEFAULT 0,
    `test_user_count` INT DEFAULT 0,
    `test_question_count` INT DEFAULT 200,
    `test_tag` VARCHAR(255) DEFAULT "#TOEIC",
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`test_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1000;


ALTER TABLE `tests` ADD IF NOT EXISTS `test_audio` VARCHAR(255) DEFAULT NULL AFTER `test_tag`;
ALTER TABLE `tests` ADD IF NOT EXISTS `test_no_of_year` INT DEFAULT 1 AFTER `test_tag`;
ALTER TABLE `tests` CHANGE `test_audio` `test_audio` JSON DEFAULT NULL;

CREATE TABLE IF NOT EXISTS `tests_parts` (
    `part_id` VARCHAR(16) NOT NULL,
    `test_id` INT NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `deleted_at` datetime DEFAULT NULL,
    FOREIGN KEY (`part_id`) REFERENCES `parts` (`part_id`),
    FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`),
    PRIMARY KEY (`test_id`, `part_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `group_questions` (
    `group_id` INT NOT NULL AUTO_INCREMENT,
    `group_question_order` VARCHAR(255) NOT NULL,
    `group_audio` JSON DEFAULT NULL,
    `group_image` JSON DEFAULT NULL,
    `group_text` TEXT DEFAULT NULL,
    `group_transcript` TEXT DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`group_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `group_questions` ADD IF NOT EXISTS `question_type_id` INT NOT NULL AFTER `group_transcript`;
ALTER TABLE `group_questions` ADD IF NOT EXISTS `part_id` VARCHAR(16) NOT NULL AFTER `group_transcript`;
ALTER TABLE `group_questions` ADD IF NOT EXISTS `test_id` INT NOT NULL AFTER `group_transcript`;

ALTER TABLE `group_questions`
DROP FOREIGN KEY IF EXISTS `fk_group_questions_far_question_types`;
ALTER TABLE `group_questions`
DROP FOREIGN KEY IF EXISTS `fk_group_questions_far_parts`;
ALTER TABLE `group_questions`
DROP FOREIGN KEY IF EXISTS `fk_group_questions_far_tests`;

DROP INDEX IF EXISTS `fk_group_questions_far_question_types_idx` ON `group_questions`;
DROP INDEX IF EXISTS `fk_group_questions_far_parts_idx` ON `group_questions`;
DROP INDEX IF EXISTS `fk_group_questions_far_tests_idx` ON `group_questions`;

ALTER TABLE `group_questions`
ADD INDEX `fk_group_questions_far_question_types_idx` (`question_type_id` ASC),
ADD CONSTRAINT `fk_group_questions_far_question_types`
  FOREIGN KEY (`question_type_id`)
  REFERENCES `question_types` (`type_id`)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;

ALTER TABLE `group_questions`
ADD INDEX `fk_group_questions_far_parts_idx` (`part_id` ASC),
ADD CONSTRAINT `fk_group_questions_far_parts`
  FOREIGN KEY (`part_id`)
  REFERENCES `parts` (`part_id`)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;

ALTER TABLE `group_questions`
ADD INDEX `fk_group_questions_far_tests_idx` (`test_id` ASC),
ADD CONSTRAINT `fk_group_questions_far_tests`
  FOREIGN KEY (`test_id`)
  REFERENCES `tests` (`test_id`)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS `questions` (
    `question_id` INT NOT NULL AUTO_INCREMENT,
    `question_order` INT NOT NULL,
    `question_audio` VARCHAR(255) DEFAULT NULL,
    `question_image` VARCHAR(255) DEFAULT NULL,
    `question_text` TEXT DEFAULT NULL,
    `question_score` INT NOT NULL,
    `question_transcript` JSON DEFAULT NULL,
    `question_explain` JSON DEFAULT NULL,
    `question_type_id` INT NOT NULL,
    `part_id` VARCHAR(16) NOT NULL,
    `test_id` INT NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `deleted_at` datetime DEFAULT NULL,
    FOREIGN KEY (`part_id`) REFERENCES `parts` (`part_id`),
    FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`),
    FOREIGN KEY (`question_type_id`) REFERENCES `question_types` (`type_id`),
    PRIMARY KEY (`question_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1000;

DROP INDEX IF EXISTS `index_question_order` ON `questions`;
ALTER TABLE `questions` ADD INDEX `index_question_order`(`question_order` ASC);
ALTER TABLE `questions` DROP IF EXISTS `question_score`;
ALTER TABLE `questions` CHANGE `question_audio` `question_audio` JSON DEFAULT NULL;
ALTER TABLE `questions` CHANGE `question_image` `question_image` JSON DEFAULT NULL;
ALTER TABLE `questions` CHANGE `question_transcript` `question_transcript` TEXT DEFAULT NULL;
ALTER TABLE `questions` CHANGE `question_explain` `question_explain` TEXT DEFAULT NULL;
ALTER TABLE `questions` ADD IF NOT EXISTS `group_question_id` INT DEFAULT NULL AFTER `test_id`;

ALTER TABLE `questions`
DROP FOREIGN KEY IF EXISTS `fk_questions_far_group_questions`;

DROP INDEX IF EXISTS `fk_questions_far_group_questions_idx` ON `questions`;

ALTER TABLE `questions`
ADD INDEX `fk_questions_far_group_questions_idx` (`group_question_id` ASC),
ADD CONSTRAINT `fk_questions_far_group_questions`
  FOREIGN KEY (`group_question_id`)
  REFERENCES `group_questions` (`group_id`)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;


CREATE TABLE IF NOT EXISTS `questions_tags` (
    `tag_id` VARCHAR(16) NOT NULL,
    `question_id` INT NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `deleted_at` datetime DEFAULT NULL,
    FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`),
    FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`),
    PRIMARY KEY (`tag_id`, `question_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `answers` (
    `answer_id` INT NOT NULL AUTO_INCREMENT,
    `answer_order` INT NOT NULL CHECK(answer_order > 0 AND answer_order <= 4),
    `answer_text` VARCHAR(255) NOT NULL,
    `answer_isCorrect` BOOLEAN NOT NULL,
    `answer_image` VARCHAR(255) DEFAULT NULL,
    `question_id` INT NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `deleted_at` datetime DEFAULT NULL,
    FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`),
    PRIMARY KEY (`answer_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1000;

DROP INDEX IF EXISTS `index_answer_order` ON `answers`;
ALTER TABLE `answers` ADD INDEX `index_answer_order`(`answer_order` ASC);
ALTER TABLE `answers` CHANGE `answer_image` `answer_image` JSON DEFAULT NULL;


CREATE TABLE IF NOT EXISTS `scores` (
  `score_id` INT NOT NULL AUTO_INCREMENT,
  `score_name` VARCHAR(255) NOT NULL,
  `score_status` ENUM('active', 'inactive') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`score_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `score_details` (
  `details_id` INT NOT NULL AUTO_INCREMENT,
  `reading_score` INT NOT NULL,
  `listening_score` INT NOT NULL,
  `number_correct_answer` INT NOT NULL,
  `score_id` INT NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  FOREIGN KEY (`score_id`) REFERENCES `scores` (`score_id`),
  PRIMARY KEY (`details_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `exams` (
  `exam_id` INT NOT NULL AUTO_INCREMENT,
  `exam_total_answer` INT NOT NULL,
  `exam_count_question_correct` INT NOT NULL,
  `exam_count_question_wrong` INT NOT NULL,
  `exam_count_question_skip` INT NOT NULL,
  `exam_type` ENUM('ONE_TEST', 'FULL_TEST') NOT NULL,
  `exam_used_timer` INT NOT NULL,
  `score_id` INT DEFAULT NULL,
  `user_id` INT NOT NULL,
  `test_id` INT NOT NULL,
  `question_type_id` INT DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  FOREIGN KEY (`score_id`) REFERENCES `scores` (`score_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`),
  FOREIGN KEY (`question_type_id`) REFERENCES `question_types` (`type_id`),
  PRIMARY KEY (`exam_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `exams` ADD IF NOT EXISTS `exam_target` INT DEFAULT 550 CHECK(exam_target > 0 AND exam_target <= 990) AFTER `exam_type`;
ALTER TABLE `exams` CHANGE IF EXISTS `exam_total_answer` `exam_total_question` INT NOT NULL;
ALTER TABLE `exams` ADD IF NOT EXISTS `exam_count_listening_correct` INT DEFAULT 0 AFTER `exam_count_question_correct`;
ALTER TABLE `exams` ADD IF NOT EXISTS `exam_count_reading_correct` INT DEFAULT 0 AFTER `exam_count_question_correct`;

CREATE TABLE IF NOT EXISTS `exam_details` (
  `detail_id` INT NOT NULL AUTO_INCREMENT,
  `exam_id` INT NOT NULL,
  `answer_id` INT DEFAULT NULL,
  `question_id` INT NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`),
  FOREIGN KEY (`answer_id`) REFERENCES `answers` (`answer_id`),
  FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`),
  PRIMARY KEY (`detail_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `documents` (
  `doc_id` INT NOT NULL AUTO_INCREMENT,
  `doc_title` VARCHAR(255) NOT NULL,
  `doc_desc` VARCHAR(255) NOT NULL,
  `doc_slug` VARCHAR(255) NOT NULL,
  `doc_type` ENUM('audio', 'video', 'text', 'document') NOT NULL,
  `doc_audio` JSON DEFAULT NULL,
  `doc_video` JSON DEFAULT NULL,
  `doc_text` TEXT DEFAULT NULL,
  `doc_pdf` JSON DEFAULT NULL,
  `doc_link` TEXT DEFAULT NULL,
  `doc_thumbnail` JSON DEFAULT NULL,
  `doc_status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`doc_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `document_sections` (
  `section_id` INT NOT NULL AUTO_INCREMENT,
  `section_title` VARCHAR(255),
  `section_link` VARCHAR(255),
  `section_video` JSON DEFAULT NULL,
  `section_audio` JSON DEFAULT NULL,
  `section_status` ENUM('active', 'inactive') DEFAULT 'active',
  `doc_id` INT NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`doc_id`) REFERENCES `documents` (`doc_id`),
  PRIMARY KEY (`section_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `document_sections`;

CREATE TABLE IF NOT EXISTS `notes` (
  `note_id` INT NOT NULL AUTO_INCREMENT,
  `note_name` VARCHAR(255) NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  PRIMARY KEY (`note_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `note_details` (
  `detail_id` INT NOT NULL AUTO_INCREMENT,
  `detail_title` VARCHAR(255),
  `detail_content` VARCHAR(255),
  `note_id` INT NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`note_id`) REFERENCES `notes` (`note_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (`detail_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `comments` (
  `comment_id` INT NOT NULL AUTO_INCREMENT,
  `comment_content` VARCHAR(255) NOT NULL,
  `comment_left` INT NOT NULL,
  `comment_right` INT NOT NULL,
  `comment_parentId` INT DEFAULT NULL,
  `user_id` INT NOT NULL,
  `test_id` INT NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`),
  PRIMARY KEY (`comment_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `comments` ADD IF NOT EXISTS `comment_status` ENUM('active', 'inactive') DEFAULT 'active' AFTER `comment_parentId`;
ALTER TABLE `comments` ADD IF NOT EXISTS `comment_count_sub` INT DEFAULT 0 AFTER `comment_parentId`;
ALTER TABLE `comments` DROP COLUMN IF EXISTS `comment_count_sub`;

-- DROP TABLE IF EXISTS `users_roles`;
-- DROP TABLE IF EXISTS `roles_grants`;
-- DROP TABLE IF EXISTS `roles`;
-- DROP TABLE IF EXISTS `resources`;
-- DROP TABLE IF EXISTS `grants`;

-- Role based access control (RBAC)

CREATE TABLE IF NOT EXISTS `resources` (
  `resource_id` INT NOT NULL AUTO_INCREMENT,
  `resource_name` VARCHAR(255) NOT NULL,
  `resource_desc` VARCHAR(255),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`resource_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

-- Role base of system
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_name` ENUM('admin', 'user', 'teacher') NOT NULL,
  `role_slug` VARCHAR(255) NOT NULL UNIQUE,
  `role_desc` VARCHAR(255),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`role_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `grants` (
  `grant_id` INT NOT NULL AUTO_INCREMENT,
  `grant_action` ENUM('create:any', 'read:any', 'update:any', 'delete:any', 'create:own', 'read:own', 'update:own', 'delete:own') NOT NULL,  -- ['create:any', 'read:any', 'update:any', 'delete:any', 'create:own', 'read:own', 'update:own', 'delete:own']
  `grant_attribute` VARCHAR(255) DEFAULT '*', -- '*' or '* !column, !column2, ...'
  `resource_id` INT NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`resource_id`) REFERENCES `resources` (`resource_id`),
  PRIMARY KEY (`grant_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `roles_grants` (
  `role_id` INT NOT NULL,
  `grant_id` INT NOT NULL,
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  FOREIGN KEY (`grant_id`) REFERENCES `grants` (`grant_id`),
  PRIMARY KEY (`role_id`, `grant_id`)
) ENGINE = InnoDB;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE IF NOT EXISTS `prod_get_role_grants` (IN `roleId_input` INT, IN `isSelectNotInRoleId_input` BOOLEAN)   IF(isSelectNotInRoleId_input = 1) then
    SELECT gr.grant_id, roleId_input as role_id, gr.grant_action, rs.resource_name as resource FROM grants gr JOIN resources rs ON gr.resource_id = rs.resource_id WHERE gr.grant_id NOT IN(SELECT ro_gr.grant_id FROM roles_grants ro_gr WHERE ro_gr.role_id = roleId_input) ORDER BY rs.resource_name;
ELSE 
	SELECT gr.grant_id, roleId_input as role_id, gr.grant_action, rs.resource_name as resource FROM grants gr JOIN resources rs ON gr.resource_id = rs.resource_id WHERE gr.grant_id IN(SELECT ro_gr.grant_id FROM roles_grants ro_gr WHERE ro_gr.role_id = roleId_input) ORDER BY rs.resource_name;
END IF$$

DELIMITER ;