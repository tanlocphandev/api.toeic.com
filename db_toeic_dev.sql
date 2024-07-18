-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2024 at 05:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_toeic_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `answer_id` int(11) NOT NULL,
  `answer_order` int(11) NOT NULL CHECK (`answer_order` > 0 and `answer_order` <= 4),
  `answer_text` varchar(255) NOT NULL,
  `answer_isCorrect` tinyint(1) NOT NULL,
  `answer_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`answer_image`)),
  `question_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group_questions`
--

CREATE TABLE `group_questions` (
  `group_id` int(11) NOT NULL,
  `group_question_order` varchar(255) NOT NULL,
  `group_audio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`group_audio`)),
  `group_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`group_image`)),
  `group_text` text DEFAULT NULL,
  `group_transcript` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `key_tokens`
--

CREATE TABLE `key_tokens` (
  `key_id` varchar(16) NOT NULL,
  `user_id` int(11) NOT NULL,
  `public_key` varchar(255) NOT NULL,
  `private_key` varchar(255) NOT NULL,
  `refresh_token_used` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`refresh_token_used`)),
  `refresh_token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `key_tokens`
--

INSERT INTO `key_tokens` (`key_id`, `user_id`, `public_key`, `private_key`, `refresh_token_used`, `refresh_token`, `created_at`, `updated_at`) VALUES
('5ce50893e90f4d81', 5, 'fa4cc6a9532a7e3face36ac699e5c81d0e3e3197eb4247a59576188d49c8a9b16fea3d612f6ac6449ed43495d725d6f416fb821d056c77ba71498a429506d056', '2fde4fd94002b41110693daef606b398df5dc2ef39bd4596f65d5ab032f42bd34d475e4586b67de452e28ebf24124499460b46b53af1508f3998111bdb6a8dde', '[\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwNTk5NDQ1LCJleHAiOjE3MjEyMDQyNDV9.jxEXCz4HCWO28igprmDTk03SdZKXVPKptYLIFvdu2gk\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwNTk5NDg1LCJleHAiOjE3MjEyMDQyODV9.RcyRsf26_EEhTYnCjgvarkYz7X3KeDOWK6_G_UaxW00\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwNTk5NTE3LCJleHAiOjE3MjEyMDQzMTd9.CbPwFeqB_YjXiLRA8qtFSri57HWbDmUirRVcIQzemP0\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwNjc2MzIwLCJleHAiOjE3MjEyODExMjB9._fODb3xWWFvtTJFLWyVQB_pGsqtzQ-_XgiQyHmYo2yY\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc1MDM5LCJleHAiOjE3MjE0Nzk4Mzl9.YcRNP474sDJ1Iwk2AW04nIL47a1G6KW07FrpuQhvFjg\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc1MjA0LCJleHAiOjE3MjE0ODAwMDR9.ojgPS3hBKLn1UhXVQLDm9d7FFNt8WMif_0O5PqbSo3E\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc2NDk0LCJleHAiOjE3MjE0ODEyOTR9.0VB0BtoiPw0k-kwQ2G62vDvgyGr0F8LL7TnS6w3tA_c\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc2NTM2LCJleHAiOjE3MjE0ODEzMzZ9.EpbuVhmihV9KS3dT7qffY1YLnT3_0S3oQIXimL-l8Gg\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc2NTgwLCJleHAiOjE3MjE0ODEzODB9.nokY0W4Mzl1GmqaEsWpe_YgJxVTxOxThuRHTyVGJrms\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc2NjU1LCJleHAiOjE3MjE0ODE0NTV9.jZaYAxdhfa2dYw5vs_CZawdiwfhZxuZcbFW1wKZdN_U\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc2ODA4LCJleHAiOjE3MjE0ODE2MDh9.Yhoc6FVAwkM9DxaeRM3sFgWGx8MxfVqHkp56C8sPTPc\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc2ODQ0LCJleHAiOjE3MjE0ODE2NDR9._l4ksPTGV6Ezj-bbn3lDjDnr4ViXLE8vRUvQQ0In4AM\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc3MDI1LCJleHAiOjE3MjE0ODE4MjV9.tm5VHAVqyEPmelvpOFjdcLqVqLZaUxBJ4xuSqoXULjs\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc3NDIwLCJleHAiOjE3MjE0ODIyMjB9.9LX2SJCT_ap-PRW43aLcyXE6fXr3vd-tD_T0EdbIeBA\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc3NTA5LCJleHAiOjE3MjE0ODIzMDl9.BoC8hSIYPFhBfkCNj5-ZzlzpmapO2PZd9IGzxqHLuEU\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc3NTk0LCJleHAiOjE3MjE0ODIzOTR9.rMmH0Zc53RbVuNujFJOpVwchUxwDdJPDGBlROKE1eIw\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc3ODE5LCJleHAiOjE3MjE0ODI2MTl9.50k4NPlRgeOEUHr1WzZ0SsIh8an-HBJBwL7F_QWDBxE\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODc4Nzc4LCJleHAiOjE3MjE0ODM1Nzh9.bQz1WQiegWzpQZ4reB_K7vsWFuSGFGRBfwHHj1xG9t8\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODgwMjIzLCJleHAiOjE3MjE0ODUwMjN9.RC_ykhXyYOUA2yhyoFdW_FWG4qevZa6Mu2devng8do4\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODgwMjc1LCJleHAiOjE3MjE0ODUwNzV9.YvOuqo6EU60bg5OdVyFk0oD3czCruKytL8G8CVcYAd8\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODgwMzMxLCJleHAiOjE3MjE0ODUxMzF9.EbvjplpjjrKHYC2x2FVgay-_9lLVBjMbW3b50zeFekw\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODgyNjc2LCJleHAiOjE3MjE0ODc0NzZ9.sCdDnCDjGyjN24SCUIkXeLNesxxwlqnxPWH-oXhfwyo\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODgyNzEwLCJleHAiOjE3MjE0ODc1MTB9.D0Fyl8nEqMPR2Vngi4K6_zi07vdv9mmnOMXd-RWtu24\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODgyODUxLCJleHAiOjE3MjE0ODc2NTF9.pe5QZJHGWM09Zp4Su68Gk2ihdhlnh46o8pd98qbFRbM\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODgyOTEyLCJleHAiOjE3MjE0ODc3MTJ9.sNCPWmDkMApj7tx0ac10P6YS3VhiKh7O_AR5RgKAFHs\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODgyOTQ2LCJleHAiOjE3MjE0ODc3NDZ9.tMvWnDvRL4IGjC6RWM66V2zatKqdnX3c_r8NuZ8_ooQ\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwODgzMjkyLCJleHAiOjE3MjE0ODgwOTJ9.zW1PirG5odBKkxVaewJqTQGQoWyHTq5We2IY20izv_k\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQwMDM2LCJleHAiOjE3MjE1NDQ4MzZ9.4TGYrjyyUVY72iLIasG-X-TLDF4dP5imskJPfcltxpo\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQyNzQ2LCJleHAiOjE3MjE1NDc1NDZ9.WV_CkD-6tP8nqzcDbuUlMcQJPPQ8oPOrPvatooaZCQU\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQzMTcxLCJleHAiOjE3MjE1NDc5NzF9.2nLhoZHM4GwtArsEXjmSwh-0kgOQozxBs72qhUKeYFw\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQ0ODYyLCJleHAiOjE3MjE1NDk2NjJ9.lWOae8gn48c_qOG1tfCD2b5CNoQu6-dhKlX-Zj-1Vgo\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQ0OTMxLCJleHAiOjE3MjE1NDk3MzF9.BVweYJX987DRTP38hd9ZmsOFggCcE70FXMMrfViMxpg\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQ1NTczLCJleHAiOjE3MjE1NTAzNzN9.b9UxSDDoxHvcChTwxt6Th7kkezIAv_1KxPSXlatmSBg\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQ1NjE3LCJleHAiOjE3MjE1NTA0MTd9.PocTTD7bvWl6U6A7_qbVe9r-H-J1HhgsOMNQcAAVQPY\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQ1NjYwLCJleHAiOjE3MjE1NTA0NjB9.eFKLFvKKIVsMgvHmjcJqZbzUyCKpeI-4mpsgmdoJgGA\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQ2NzYyLCJleHAiOjE3MjE1NTE1NjJ9.-FDE6G2vczg-fsBATl13n9pOsVc8Ih8yWUhvzl3LsM8\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQ2OTgxLCJleHAiOjE3MjE1NTE3ODF9.ROqsvvaWUHGLwvHX6zzGKLKruQHmNYatirXqriT2AKk\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQ3MDY5LCJleHAiOjE3MjE1NTE4Njl9.8ZUy6qGHoHMsUdHwu1Yra_gM0-zurX5-v66xCcRT6sE\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTQ3MTU3LCJleHAiOjE3MjE1NTE5NTd9.3Zq3u1i5lQfw3dagYY10Z1q9lKgW-MGI3F9JDo7QGAM\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTU3NTI0LCJleHAiOjE3MjE1NjIzMjR9.JIzB9ZSKHi5tobPGAo27hcZOKzSS7kLkGJcu_PikRjQ\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIxMTg4MTA2LCJleHAiOjE3MjE3OTI5MDZ9.re-JJanL5YVARhC-kd6p0aN8_r9k3J-uWviR6qbu8VI\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIxMTg5MzUwLCJleHAiOjE3MjE3OTQxNTB9.8itRE3YFuhGsRjrt8sk0e8Un1bVPanz_cQcIAXpDQJU\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIxMTkyNTMxLCJleHAiOjE3MjE3OTczMzF9.fKSi_AgSL7bCS8tY8LIUBGwx_3yPF1XtSBIx9KHjX58\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIxMjE2Nzk1LCJleHAiOjE3MjE4MjE1OTV9.6K5X5mBtYq8sXp6osVG_n2uLYccbva6zaQRxkPc-42g\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIxMjE4OTgzLCJleHAiOjE3MjE4MjM3ODN9.xg930judgDqoavI5wU7bOgfZMm0azUAQfjnAh66TeRo\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIxMjE5MDY4LCJleHAiOjE3MjE4MjM4Njh9.IPPBRJ6sRwzLUI-2nZvWFvMu5XBp5ODlIS2_h6rfWcY\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIxMjE5MDk4LCJleHAiOjE3MjE4MjM4OTh9.jIX6oKzqSxZs_kHNZhgCaun6DUSrXtbngGqLYrrNeAM\",\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIxMjE5NjAyLCJleHAiOjE3MjE4MjQ0MDJ9.m5GA0zqeHmm1uJwkYK90oIEIKevegmqXpnesRhF0Htw\"]', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIxMjI4NDkwLCJleHAiOjE3MjE4MzMyOTB9.j8150zm8JOwzXw2B4snngfzNY7CD_bWS65eJLgW7ARA', '2024-07-10 08:17:25', '2024-07-17 15:01:30');

-- --------------------------------------------------------

--
-- Table structure for table `parts`
--

CREATE TABLE `parts` (
  `part_id` varchar(16) NOT NULL,
  `part_name` varchar(255) NOT NULL,
  `part_slug` varchar(255) NOT NULL,
  `part_number` int(11) NOT NULL,
  `part_desc` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `parts`
--

INSERT INTO `parts` (`part_id`, `part_name`, `part_slug`, `part_number`, `part_desc`, `created_at`, `updated_at`) VALUES
('297869ca560720ea', 'Part 5', 'part-5', 5, NULL, '2024-07-17 15:01:30', '2024-07-17 15:01:30'),
('2c581c2a5fcd529d', 'Part 3', 'part-3', 3, NULL, '2024-07-17 15:01:30', '2024-07-17 15:01:30'),
('53884ebc201d38a7', 'Part 1', 'part-1', 1, NULL, '2024-07-17 15:01:30', '2024-07-17 15:01:30'),
('b0b398f82db24982', 'Part 6', 'part-6', 6, NULL, '2024-07-17 15:01:30', '2024-07-17 15:01:30'),
('c21290fa283d8953', 'Part 4', 'part-4', 4, NULL, '2024-07-17 15:01:30', '2024-07-17 15:01:30'),
('e091dfa61fc8edc6', 'Part 7', 'part-7', 7, NULL, '2024-07-17 15:01:30', '2024-07-17 15:01:30'),
('e3895e306c599b32', 'Part 2', 'part-2', 2, NULL, '2024-07-17 15:01:30', '2024-07-17 15:01:30');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `question_order` int(11) NOT NULL,
  `question_audio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`question_audio`)),
  `question_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`question_image`)),
  `question_text` text DEFAULT NULL,
  `question_transcript` text DEFAULT NULL,
  `question_explain` text DEFAULT NULL,
  `question_type_id` int(11) NOT NULL,
  `part_id` varchar(16) NOT NULL,
  `test_id` int(11) NOT NULL,
  `group_question_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions_tags`
--

CREATE TABLE `questions_tags` (
  `tag_id` varchar(16) NOT NULL,
  `question_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_types`
--

CREATE TABLE `question_types` (
  `type_id` int(11) NOT NULL,
  `type_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `question_types`
--

INSERT INTO `question_types` (`type_id`, `type_name`, `created_at`, `updated_at`) VALUES
(1186, 'Câu hỏi về chi tiết cuộc hội thoại', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1187, 'Chủ đề: Shopping, Service', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1188, 'Đại từ', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1189, 'Danh động từ', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1190, 'Danh từ', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1191, 'Động từ nguyên mẫu', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1192, 'Động từ nguyên mẫu có to', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1193, 'Giới từ', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1194, 'Liên từ', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1195, 'Mệnh đề quan hệ', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1196, 'Phân từ và Cấu trúc phân từ', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1197, 'Thể', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1198, 'Thì', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1199, 'Tính từ', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1200, 'Trạng từ', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1201, 'Tranh tả cả người và vật', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1202, 'Tranh tả người', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1203, 'Câu hỏi đuôi', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1204, 'Câu hỏi HOW', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1205, 'Câu hỏi lựa chọn', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1206, 'Câu hỏi WHAT', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1207, 'Câu hỏi WHEN', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1208, 'Câu hỏi WHERE', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1209, 'Câu hỏi WHO', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1210, 'Câu hỏi WHY', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1211, 'Câu hỏi YES/NO', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1212, 'Câu trần thuật', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1213, 'Câu yêu cầu, đề nghị', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1214, 'Câu hỏi về danh tính người nói', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1215, 'Câu hỏi về yêu cầu, gợi ý', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1216, 'Chủ đề: Company - Event, Project', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1217, 'Chủ đề: Company - Business, Marketing', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1218, 'Chủ đề: Company - Facility', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1219, 'Chủ đề: Company - General Office Work', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1220, 'Chủ đề: Company - Personnel', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1221, 'Chủ đề: Order, delivery', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1222, 'Chủ đề: Transportation', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1223, 'Câu hỏi kết hợp bảng biểu', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1224, 'Câu hỏi về chi tiết', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1225, 'Câu hỏi về chủ đề, mục đích', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1226, 'Câu hỏi về danh tính, địa điểm', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1227, 'Câu hỏi về hàm ý câu nói', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1228, 'Câu hỏi yêu cầu, gợi ý', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1229, 'Câu hỏi về hành động tương lai', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1230, 'Dạng bài: Advertisement - Quảng cáo', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1231, 'Dạng bài: Announcement - Thông báo', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1232, 'Dạng bài: Excerpt from a meeting - Trích dẫn từ buổi họp', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1233, 'Dạng bài: Telephone message - Tin nhắn thoại', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1234, 'Dạng bài: Talk - Bài phát biểu, diễn văn', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1235, 'Câu hỏi ngữ pháp', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1236, 'Câu hỏi từ loại', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1237, 'Câu hỏi từ vựng', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1238, 'Câu hỏi điền câu vào đoạn văn', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1239, 'Dạng bài: Text message chain - Chuỗi tin nhắn', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1240, 'Dạng bài: Schedule - Lịch trình, thời gian biểu', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1241, 'Dạng bài: Instructions: Văn bản hướng dẫn', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1242, 'Dạng bài: Form - Đơn từ, biểu mẫu', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1243, 'Dạng bài: Email/ Letter: Thư điện tử/ Thư tay', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1244, 'Dạng bài: Article/ Review: Bài báo/ Bài đánh giá', '2024-06-22 13:41:10', '2024-06-22 13:41:10'),
(1245, 'Cấu trúc: nhiều đoạn', '2024-06-22 13:42:08', '2024-06-22 13:44:35'),
(1246, 'Câu hỏi HOW 2', '2024-06-29 08:18:53', '2024-06-29 08:19:03');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `tag_id` varchar(16) NOT NULL,
  `tag_name` varchar(255) NOT NULL,
  `tag_slug` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`tag_id`, `tag_name`, `tag_slug`, `created_at`, `updated_at`) VALUES
('03rpingemjazauay', 'Câu hỏi WHEN', 'cau-hoi-when', '2024-06-22 10:46:32', '2024-06-22 10:46:32'),
('15bc4927dec8a6cd', 'Câu hỏi WHAT', 'cau-hoi-what', '2024-06-29 14:55:17', '2024-06-29 14:55:17'),
('46513be8d87b08cc', 'Câu hỏi kết hợp bảng biểu 1', 'cau-hoi-ket-hop-bang-bieu-1', '2024-06-29 07:54:25', '2024-06-29 07:54:25'),
('5beae80189afc475', 'Câu hỏi về cuộc sống', 'cau-hoi-ve-cuoc-song', '2024-06-29 08:39:34', '2024-06-29 08:39:34'),
('a2wlw4h06tw6hvo0', 'Câu hỏi về hàm ý câu nói', 'cau-hoi-ve-ham-y-cau-noi', '2024-06-22 11:30:28', '2024-06-22 11:30:28'),
('cfinddk8sypnofy4', 'Tranh tả cả người và vật', 'tranh-ta-ca-nguoi-va-vat', '2024-06-22 07:17:15', '2024-06-22 07:17:15'),
('empbikxovpbvazxf', 'Chủ đề: Company - General Office Work', 'chu-de-company-general-office-work', '2024-06-22 11:30:28', '2024-06-22 11:30:28'),
('eumtikefmisozwxh', 'Câu hỏi kết hợp bảng biểu 11', 'cau-hoi-ket-hop-bang-bieu-11', '2024-06-22 11:30:28', '2024-06-29 16:06:54'),
('f886ec63771f427c', 'Câu hỏi về cuộc sống update', 'cau-hoi-ve-cuoc-song-update', '2024-06-29 07:58:20', '2024-06-29 07:58:53'),
('fhd05r0or7un017y', 'Câu hỏi về hành động tương lai', 'cau-hoi-ve-hanh-dong-tuong-lai', '2024-06-22 11:30:28', '2024-06-22 11:30:28'),
('iwqojszk2jzstmus', 'Tranh tả người', 'tranh-ta-nguoi', '2024-06-22 07:15:22', '2024-06-22 07:15:22'),
('jporhnsc8r4svkp2', 'Câu hỏi WHO', 'cau-hoi-who', '2024-06-22 10:46:32', '2024-06-22 10:46:32'),
('lku4b7e3dbfqjslt', 'Câu hỏi WHERE 1', 'cau-hoi-where-1', '2024-06-22 10:48:31', '2024-06-22 10:48:31'),
('ozwfyubi4vkisakn', 'Câu hỏi WHEN 1', 'cau-hoi-when-1', '2024-06-22 10:48:31', '2024-06-22 10:48:31'),
('spfmlmcj971ulfnd', 'Câu hỏi WHO 1', 'cau-hoi-who-1', '2024-06-22 10:48:31', '2024-06-22 10:48:31'),
('tdjypkqesa35fff2', 'Câu hỏi WHERE', 'cau-hoi-where', '2024-06-22 10:46:32', '2024-06-22 10:46:32'),
('timvsjulzdkerjzf', 'Câu hỏi WHAT [Update]', 'cau-hoi-what-update', '2024-06-22 07:18:29', '2024-06-22 07:22:04'),
('vb02vujshnm32cdn', 'Câu hỏi về chi tiết cuộc hội thoại', 'cau-hoi-ve-chi-tiet-cuoc-hoi-thoai', '2024-06-22 11:30:28', '2024-06-22 11:30:28');

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `test_id` int(11) NOT NULL,
  `test_name` varchar(255) NOT NULL,
  `test_slug` varchar(255) NOT NULL,
  `test_of_year` varchar(4) DEFAULT NULL,
  `test_duration` int(11) DEFAULT 120,
  `test_comment_count` int(11) DEFAULT 0,
  `test_user_count` int(11) DEFAULT 0,
  `test_question_count` int(11) DEFAULT 200,
  `test_tag` varchar(255) DEFAULT '#TOEIC',
  `test_no_of_year` int(11) DEFAULT 1,
  `test_audio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`test_audio`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tests_parts`
--

CREATE TABLE `tests_parts` (
  `part_id` varchar(16) NOT NULL,
  `test_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_id_prefix` varchar(255) NOT NULL,
  `user_fullName` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `user_salt` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_sex` enum('male','female') DEFAULT NULL,
  `user_avatar` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`user_avatar`)),
  `user_role` enum('admin','user') DEFAULT NULL,
  `user_dob` date DEFAULT NULL,
  `user_status` enum('active','inactive','deleted') DEFAULT 'active',
  `user_verify` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_id_prefix`, `user_fullName`, `user_password`, `user_salt`, `user_email`, `user_sex`, `user_avatar`, `user_role`, `user_dob`, `user_status`, `user_verify`, `created_at`, `updated_at`) VALUES
(5, '0f94386add9c8b30b0c6de42c4f3cdcf', 'Nguyễn Văn Admin', '$2b$10$lCpsC/.sef7SKLiV0/OTs.Sctjbp40Qq0Is/ux3YsA1MBO/3legoK', '$2b$10$lCpsC/.sef7SKLiV0/OTs.', 'admin@gmail.com', NULL, NULL, 'admin', NULL, 'active', NULL, '2024-06-28 04:53:45', '2024-06-28 04:53:45'),
(6, '484cefd357f79973d4fde8991874d773', 'Nguyễn Văn Toàn', '$2b$10$HtnZTDdlxtbL6cSO1IcSU.bpJwV5G2UTnzWHa/Mv0QBjzPbcRWIbq', '$2b$10$HtnZTDdlxtbL6cSO1IcSU.', 'toan@gmail.com', NULL, NULL, 'user', NULL, 'active', NULL, '2024-06-29 14:55:51', '2024-06-29 14:55:51'),
(7, 'ebb7b0fb72c7fbc8698ed8aaf7cfe8f7', 'Nguyễn Tấn Kiệt', '$2b$10$3f/N1Lia1uJgBoFDxdwT..9koKm.BVUN3LNI5dtWbVF8l8yWvgFxu', '$2b$10$3f/N1Lia1uJgBoFDxdwT..', 'kiet@gmail.com', NULL, NULL, 'user', NULL, 'active', NULL, '2024-06-29 16:05:45', '2024-06-29 16:05:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `index_answer_order` (`answer_order`);

--
-- Indexes for table `group_questions`
--
ALTER TABLE `group_questions`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `key_tokens`
--
ALTER TABLE `key_tokens`
  ADD PRIMARY KEY (`key_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `refresh_token` (`refresh_token`),
  ADD KEY `refresh_token_used` (`refresh_token_used`(768));

--
-- Indexes for table `parts`
--
ALTER TABLE `parts`
  ADD PRIMARY KEY (`part_id`),
  ADD UNIQUE KEY `part_name` (`part_name`),
  ADD UNIQUE KEY `part_slug` (`part_slug`),
  ADD UNIQUE KEY `part_number` (`part_number`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `part_id` (`part_id`),
  ADD KEY `test_id` (`test_id`),
  ADD KEY `question_type_id` (`question_type_id`),
  ADD KEY `index_question_order` (`question_order`),
  ADD KEY `fk_questions_far_group_questions_idx` (`group_question_id`);

--
-- Indexes for table `questions_tags`
--
ALTER TABLE `questions_tags`
  ADD PRIMARY KEY (`tag_id`,`question_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `question_types`
--
ALTER TABLE `question_types`
  ADD PRIMARY KEY (`type_id`),
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `tag_name` (`tag_name`),
  ADD UNIQUE KEY `tag_slug` (`tag_slug`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`test_id`),
  ADD UNIQUE KEY `test_name` (`test_name`),
  ADD UNIQUE KEY `test_slug` (`test_slug`);

--
-- Indexes for table `tests_parts`
--
ALTER TABLE `tests_parts`
  ADD PRIMARY KEY (`test_id`,`part_id`),
  ADD KEY `part_id` (`part_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_email` (`user_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1000;

--
-- AUTO_INCREMENT for table `group_questions`
--
ALTER TABLE `group_questions`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1000;

--
-- AUTO_INCREMENT for table `question_types`
--
ALTER TABLE `question_types`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1247;

--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `test_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2147483648;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`);

--
-- Constraints for table `key_tokens`
--
ALTER TABLE `key_tokens`
  ADD CONSTRAINT `key_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_questions_far_group_questions` FOREIGN KEY (`group_question_id`) REFERENCES `group_questions` (`group_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `parts` (`part_id`),
  ADD CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`),
  ADD CONSTRAINT `questions_ibfk_3` FOREIGN KEY (`question_type_id`) REFERENCES `question_types` (`type_id`);

--
-- Constraints for table `questions_tags`
--
ALTER TABLE `questions_tags`
  ADD CONSTRAINT `questions_tags_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`),
  ADD CONSTRAINT `questions_tags_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`);

--
-- Constraints for table `tests_parts`
--
ALTER TABLE `tests_parts`
  ADD CONSTRAINT `tests_parts_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `parts` (`part_id`),
  ADD CONSTRAINT `tests_parts_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
