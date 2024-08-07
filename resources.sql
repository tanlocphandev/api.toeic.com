-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2024 at 07:33 AM
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
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `resource_id` int(11) NOT NULL,
  `resource_name` varchar(255) NOT NULL,
  `resource_desc` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `resources`
--

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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`resource_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `resource_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
