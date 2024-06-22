
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