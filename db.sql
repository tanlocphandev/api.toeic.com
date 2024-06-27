
-- CREATE DATABASE `db_toeic_dev` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

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
    `deleted_at` timestamp DEFAULT NULL,
    PRIMARY KEY (`test_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1000;

CREATE TABLE IF NOT EXISTS `tests_parts` (
    `part_id` VARCHAR(16) NOT NULL,
    `test_id` INT NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `deleted_at` timestamp DEFAULT NULL,
    FOREIGN KEY (`part_id`) REFERENCES `parts` (`part_id`),
    FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`),
    PRIMARY KEY (`test_id`, `part_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

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
    `deleted_at` timestamp DEFAULT NULL,
    FOREIGN KEY (`part_id`) REFERENCES `parts` (`part_id`),
    FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`),
    FOREIGN KEY (`question_type_id`) REFERENCES `question_types` (`type_id`),
    PRIMARY KEY (`question_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1000;

CREATE TABLE IF NOT EXISTS `questions_tags` (
    `tag_id` VARCHAR(16) NOT NULL,
    `question_id` INT NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `deleted_at` timestamp DEFAULT NULL,
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
    `deleted_at` timestamp DEFAULT NULL,
    FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`),
    PRIMARY KEY (`answer_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1000;