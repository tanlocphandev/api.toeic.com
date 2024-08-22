
CREATE DATABASE IF NOT EXISTS `db_toeic_dev_v2` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE `db_toeic_dev_v2`;

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
ALTER TABLE `question_types` ADD IF NOT EXISTS `type_desc` VARCHAR(255) DEFAULT NULL AFTER `type_name`;
ALTER TABLE `question_types` ADD IF NOT EXISTS `type_thumb` JSON DEFAULT NULL AFTER `type_name`;
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `prod_get_max_question_correct_by_userId` (IN `userId` INT)   SELECT 
	DISTINCT ex.*, tes.test_name, tes.test_tag
FROM 
	exams ex
JOIN (
    SELECT 
		test_id,
    	MAX(exam_count_question_correct) as max_exam_count_question_correct
	FROM 
		exams
	WHERE 
        score_id IS NOT NULL 
        AND user_id = userId
        AND exam_type = 'full_test'
	GROUP BY 
		test_id
) te 
	ON ex.test_id = te.test_id 
    AND ex.exam_count_question_correct = te.max_exam_count_question_correct
JOIN tests tes
	ON ex.test_id = tes.test_id
WHERE 
	exam_type = 'full_test'
    AND score_id IS NOT NULL 
    AND user_id = userId
GROUP BY ex.test_id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `prod_get_role_grants` (IN `roleId_input` INT, IN `isSelectNotInRoleId_input` BOOLEAN)   IF(isSelectNotInRoleId_input = 1) then
    SELECT gr.grant_id, roleId_input as role_id, gr.grant_action, rs.resource_name as resource FROM grants gr JOIN resources rs ON gr.resource_id = rs.resource_id WHERE gr.grant_id NOT IN(SELECT ro_gr.grant_id FROM roles_grants ro_gr WHERE ro_gr.role_id = roleId_input) ORDER BY rs.resource_name;
ELSE 
	SELECT gr.grant_id, roleId_input as role_id, gr.grant_action, rs.resource_name as resource FROM grants gr JOIN resources rs ON gr.resource_id = rs.resource_id WHERE gr.grant_id IN(SELECT ro_gr.grant_id FROM roles_grants ro_gr WHERE ro_gr.role_id = roleId_input) ORDER BY rs.resource_name;
END IF$$

DELIMITER ;

-- Mock Data

INSERT INTO `users` (`user_id`, `user_id_prefix`, `user_fullName`, `user_password`, `user_salt`, `user_email`, `user_sex`, `user_avatar`, `user_role`, `user_dob`, `user_exam_target`, `user_status`, `user_verify`, `created_at`, `updated_at`) VALUES
(1, '255f947ef2110b8c2f89650a61a03094', 'Admin Admin kkk', '$2b$10$tGgO01qjwJb//.3e.od9FOBcchs28F9pyS4OfQO/1NKXi24JD8FJy', '$2b$10$tGgO01qjwJb//.3e.od9FO', 'admin@gmail.com', 'male', '{\"asset_id\":\"85c936c0761677f2142671aa3de547e9\",\"public_id\":\"toeic/documents/images/avatar-icon-images-4\",\"format\":\"png\",\"resource_type\":\"image\",\"url\":\"http://res.cloudinary.com/dtsq971i7/image/upload/v1722701689/toeic/documents/images/avatar-icon-images-4.png\",\"secure_url\":\"https://res.cloudinary.com/dtsq971i7/image/upload/v1722701689/toeic/documents/images/avatar-icon-images-4.png\"}', 'admin', '2024-08-01', 450, 'active', NULL, '2024-07-19 14:23:33', '2024-08-06 04:24:24'),
(2, '8d5257528ea639c60ad48d827501f0c7', 'Admin Postmand', '$2b$10$wNEJizBNXqoXZU2hOmdS0OqbN6ad7H8Dc.y3KGLq3aD3xGATVHWSS', '$2b$10$wNEJizBNXqoXZU2hOmdS0O', 'admin.postmand@gmail.com', NULL, NULL, 'admin', NULL, 550, 'active', NULL, '2024-07-20 13:18:01', '2024-07-20 13:18:14'),
(3, '6e94169a003d8fe5b031c331d9acd415', 'Nguyễn Văn Test', '$2b$10$PCI9w/YITiMKpKFWKqhp3.4I6HdYSibs9jnLza8jK5mMKvl31m.aS', '$2b$10$PCI9w/YITiMKpKFWKqhp3.', 'test@gmail.com', NULL, NULL, 'user', NULL, 550, 'active', NULL, '2024-07-24 12:49:02', '2024-07-24 12:49:02'),
(4, '786f7a59ac8815f726dea157b6b4bf19', 'Trần Tiến Đạt', '$2b$10$ZWvb1nRIgdrzxmjt4rz71OuBRyLBW8jh3perhLIOafOC2rNaHqYBa', '$2b$10$ZWvb1nRIgdrzxmjt4rz71O', 'tiendat@gmail.com', 'male', NULL, 'teacher', '1990-01-01', 550, 'active', NULL, '2024-08-01 07:07:09', '2024-08-07 05:11:28'),
(5, 'f7f49c37cee0a36d5a0d92dfd72e6e4f', 'Nguyễn Tiến Luật 2', '$2b$10$.R1641yR96EMCLv.VT7aqOlOihuVO59nt1sjqct898Tt6xQx0ZDES', '$2b$10$.R1641yR96EMCLv.VT7aqO', 'tienluan@gmail.com', 'male', NULL, 'teacher', '1982-10-10', 410, 'active', NULL, '2024-08-02 16:29:48', '2024-08-07 05:06:19'),
(6, '1c729137f4547c6a9aa8254e70b08d89', 'Trần Công Vĩnh', '$2b$10$53Jmf7ZzWzaOifOisu3EtulXu1RT1uly6UrWpS6ihA9Cuiulufg0G', '$2b$10$53Jmf7ZzWzaOifOisu3Etu', 'congvinh@gmail.com', 'male', NULL, 'teacher', '1998-01-01', 550, 'active', NULL, '2024-08-07 05:09:45', '2024-08-07 05:09:45');

INSERT INTO `resources` (`resource_id`, `resource_name`, `resource_desc`, `created_at`, `updated_at`) VALUES
(1, 'comment', 'global comment', '2024-08-01 01:27:06', '2024-08-01 01:27:06'),
(2, 'score', 'global score', '2024-08-01 01:27:15', '2024-08-01 01:27:15'),
(3, 'exam', 'global exam', '2024-08-01 01:27:22', '2024-08-01 01:27:22'),
(4, 'document', 'global document', '2024-08-01 01:27:29', '2024-08-01 01:27:29'),
(5, 'user', 'global user', '2024-08-01 01:27:58', '2024-08-01 01:27:58'),
(6, 'tag', 'global tag', '2024-08-01 01:28:06', '2024-08-01 01:28:06'),
(7, 'part', 'global part', '2024-08-01 01:28:11', '2024-08-01 01:28:11'),
(8, 'questionType', 'global questionType', '2024-08-01 01:28:16', '2024-08-01 01:28:16'),
(9, 'test', 'global test', '2024-08-01 01:28:22', '2024-08-01 01:28:22'),
(10, 'score-details', 'global score-details', '2024-08-01 01:28:30', '2024-08-01 01:28:30'),
(11, 'note', 'global note', '2024-08-01 01:28:38', '2024-08-01 01:28:38'),
(12, 'note-details', 'global note-details', '2024-08-01 01:28:45', '2024-08-01 01:28:45'),
(13, 'rbac', 'global rbac', '2024-08-01 01:28:54', '2024-08-01 01:28:54'),
(14, 'question', 'global question', '2024-08-01 07:56:46', '2024-08-01 07:56:46');

INSERT INTO `grants` (`grant_id`, `grant_action`, `grant_attribute`, `resource_id`, `created_at`, `updated_at`) VALUES
(1, 'create:any', '*', 1, '2024-08-01 01:36:04', '2024-08-01 01:36:04'),
(2, 'update:any', '*', 1, '2024-08-01 01:36:55', '2024-08-01 01:36:55'),
(3, 'update:own', '*', 1, '2024-08-01 01:37:00', '2024-08-01 01:37:00'),
(4, 'read:any', '*', 1, '2024-08-01 01:37:16', '2024-08-01 01:37:16'),
(5, 'delete:own', '*', 1, '2024-08-01 01:38:53', '2024-08-01 01:38:53'),
(6, 'create:any', '*', 2, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(7, 'update:any', '*', 2, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(8, 'create:any', '*', 3, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(9, 'read:any', '*', 3, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(10, 'update:any', '*', 3, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(11, 'delete:any', '*', 3, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(12, 'create:any', '*', 4, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(13, 'read:any', '*', 4, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(14, 'update:any', '*', 4, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(15, 'delete:any', '*', 4, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(16, 'create:any', '*', 5, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(17, 'create:own', '*', 5, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(18, 'read:any', '*', 5, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(19, 'read:own', '*, !password, !user_verify, !user_salt', 5, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(20, 'update:own', '*', 5, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(21, 'create:any', '*', 6, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(22, 'read:any', '*', 6, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(23, 'update:any', '*', 6, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(24, 'delete:any', '*', 6, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(25, 'create:any', '*', 7, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(26, 'read:any', '*', 7, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(27, 'update:any', '*', 7, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(28, 'create:any', '*', 8, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(29, 'read:any', '*', 8, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(30, 'update:any', '*', 8, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(31, 'delete:any', '*', 8, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(32, 'create:any', '*', 9, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(33, 'read:any', '*', 9, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(34, 'update:any', '*', 9, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(35, 'delete:any', '*', 9, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(36, 'create:any', '*', 10, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(37, 'read:any', '*', 10, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(38, 'update:any', '*', 10, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(39, 'create:own', '*', 11, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(40, 'read:own', '*', 11, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(41, 'update:own', '*', 11, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(42, 'create:own', '*', 11, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(43, 'create:own', '*', 12, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(44, 'read:own', '*', 12, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(45, 'update:own', '*', 12, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(46, 'delete:own', '*', 12, '2024-08-01 03:45:08', '2024-08-01 15:37:02'),
(47, 'create:own', '*', 13, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(48, 'read:own', '*', 13, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(49, 'update:own', '*', 13, '2024-08-01 03:45:08', '2024-08-01 03:45:08'),
(50, 'delete:own', '*', 13, '2024-08-01 03:45:08', '2024-08-01 07:20:54'),
(51, 'read:any', '*', 2, '2024-08-01 04:07:46', '2024-08-01 04:07:46'),
(52, 'delete:own', '*', 12, '2024-08-01 06:19:15', '2024-08-01 06:19:15'),
(53, 'delete:own', '*', 11, '2024-08-01 06:19:25', '2024-08-01 06:19:25'),
(54, 'create:own', '*', 14, '2024-08-01 07:57:02', '2024-08-01 07:57:02'),
(55, 'update:own', '*', 14, '2024-08-01 07:57:14', '2024-08-01 07:57:14'),
(56, 'read:any', '*', 14, '2024-08-01 07:57:23', '2024-08-01 07:57:23'),
(57, 'delete:own', '*', 14, '2024-08-01 07:58:54', '2024-08-01 07:58:54'),
(58, 'delete:any', '*', 7, '2024-08-04 09:28:19', '2024-08-04 09:28:19');

INSERT INTO `roles` (`role_id`, `role_name`, `role_slug`, `role_desc`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin', 'Vai trò dành cho admin', '2024-08-01 04:01:48', '2024-08-01 04:01:48'),
(2, 'user', 'user', 'Vai trò dành cho user', '2024-08-01 04:12:35', '2024-08-01 04:12:35'),
(3, 'teacher', 'teacher', 'Vai trò dành cho teacher', '2024-08-01 04:22:16', '2024-08-01 04:22:16');

INSERT INTO `roles_grants` (`role_id`, `grant_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 8),
(1, 9),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 33),
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43),
(1, 44),
(1, 45),
(1, 46),
(1, 47),
(1, 48),
(1, 49),
(1, 50),
(1, 51),
(1, 52),
(1, 53),
(1, 56),
(2, 1),
(2, 3),
(2, 4),
(2, 5),
(2, 8),
(2, 9),
(2, 13),
(2, 19),
(2, 20),
(2, 22),
(2, 26),
(2, 29),
(2, 33),
(2, 36),
(2, 37),
(2, 39),
(2, 40),
(2, 41),
(2, 43),
(2, 44),
(2, 45),
(2, 46),
(2, 51),
(2, 56),
(3, 1),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 8),
(3, 9),
(3, 10),
(3, 11),
(3, 12),
(3, 13),
(3, 14),
(3, 15),
(3, 19),
(3, 20),
(3, 21),
(3, 22),
(3, 23),
(3, 24),
(3, 25),
(3, 26),
(3, 27),
(3, 28),
(3, 29),
(3, 30),
(3, 31),
(3, 32),
(3, 33),
(3, 34),
(3, 35),
(3, 36),
(3, 37),
(3, 38),
(3, 39),
(3, 40),
(3, 41),
(3, 42),
(3, 43),
(3, 44),
(3, 45),
(3, 46),
(3, 51),
(3, 54),
(3, 55),
(3, 56),
(3, 57),
(3, 58);