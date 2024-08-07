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
-- Table structure for table `grants`
--

CREATE TABLE `grants` (
  `grant_id` int(11) NOT NULL,
  `grant_action` enum('create:any','read:any','update:any','delete:any','create:own','read:own','update:own','delete:own') NOT NULL,
  `grant_attribute` varchar(255) DEFAULT '*',
  `resource_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `grants`
--

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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `grants`
--
ALTER TABLE `grants`
  ADD PRIMARY KEY (`grant_id`),
  ADD KEY `resource_id` (`resource_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `grants`
--
ALTER TABLE `grants`
  MODIFY `grant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `grants`
--
ALTER TABLE `grants`
  ADD CONSTRAINT `grants_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`resource_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
