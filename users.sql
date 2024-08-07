-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2024 at 07:35 AM
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
  `user_role` enum('admin','user','teacher') DEFAULT NULL,
  `user_dob` date DEFAULT NULL,
  `user_exam_target` int(11) DEFAULT 550 CHECK (`user_exam_target` > 0 and `user_exam_target` <= 990),
  `user_status` enum('active','inactive','deleted') DEFAULT 'active',
  `user_verify` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_id_prefix`, `user_fullName`, `user_password`, `user_salt`, `user_email`, `user_sex`, `user_avatar`, `user_role`, `user_dob`, `user_exam_target`, `user_status`, `user_verify`, `created_at`, `updated_at`) VALUES
(1, '255f947ef2110b8c2f89650a61a03094', 'Admin Admin kkk', '$2b$10$tGgO01qjwJb//.3e.od9FOBcchs28F9pyS4OfQO/1NKXi24JD8FJy', '$2b$10$tGgO01qjwJb//.3e.od9FO', 'admin@gmail.com', 'male', '{\"asset_id\":\"85c936c0761677f2142671aa3de547e9\",\"public_id\":\"toeic/documents/images/avatar-icon-images-4\",\"format\":\"png\",\"resource_type\":\"image\",\"url\":\"http://res.cloudinary.com/dtsq971i7/image/upload/v1722701689/toeic/documents/images/avatar-icon-images-4.png\",\"secure_url\":\"https://res.cloudinary.com/dtsq971i7/image/upload/v1722701689/toeic/documents/images/avatar-icon-images-4.png\"}', 'admin', '2024-08-01', 450, 'active', NULL, '2024-07-19 14:23:33', '2024-08-06 04:24:24'),
(2, '8d5257528ea639c60ad48d827501f0c7', 'Admin Postmand', '$2b$10$wNEJizBNXqoXZU2hOmdS0OqbN6ad7H8Dc.y3KGLq3aD3xGATVHWSS', '$2b$10$wNEJizBNXqoXZU2hOmdS0O', 'admin.postmand@gmail.com', NULL, NULL, 'admin', NULL, 550, 'active', NULL, '2024-07-20 13:18:01', '2024-07-20 13:18:14'),
(3, '6e94169a003d8fe5b031c331d9acd415', 'Nguyễn Văn Test', '$2b$10$PCI9w/YITiMKpKFWKqhp3.4I6HdYSibs9jnLza8jK5mMKvl31m.aS', '$2b$10$PCI9w/YITiMKpKFWKqhp3.', 'test@gmail.com', NULL, NULL, 'user', NULL, 550, 'active', NULL, '2024-07-24 12:49:02', '2024-07-24 12:49:02'),
(4, '786f7a59ac8815f726dea157b6b4bf19', 'Trần Tiến Đạt', '$2b$10$ZWvb1nRIgdrzxmjt4rz71OuBRyLBW8jh3perhLIOafOC2rNaHqYBa', '$2b$10$ZWvb1nRIgdrzxmjt4rz71O', 'tiendat@gmail.com', 'male', NULL, 'teacher', '1990-01-01', 550, 'active', NULL, '2024-08-01 07:07:09', '2024-08-07 05:11:28'),
(5, 'f7f49c37cee0a36d5a0d92dfd72e6e4f', 'Nguyễn Tiến Luật 2', '$2b$10$.R1641yR96EMCLv.VT7aqOlOihuVO59nt1sjqct898Tt6xQx0ZDES', '$2b$10$.R1641yR96EMCLv.VT7aqO', 'tienluan@gmail.com', 'male', NULL, 'teacher', '1982-10-10', 410, 'active', NULL, '2024-08-02 16:29:48', '2024-08-07 05:06:19'),
(6, '1c729137f4547c6a9aa8254e70b08d89', 'Trần Công Vĩnh', '$2b$10$53Jmf7ZzWzaOifOisu3EtulXu1RT1uly6UrWpS6ihA9Cuiulufg0G', '$2b$10$53Jmf7ZzWzaOifOisu3Etu', 'congvinh@gmail.com', 'male', NULL, 'teacher', '1998-01-01', 550, 'active', NULL, '2024-08-07 05:09:45', '2024-08-07 05:09:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
