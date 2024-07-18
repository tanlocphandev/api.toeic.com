
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