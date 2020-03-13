-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2019 at 02:05 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: ha
--

-- --------------------------------------------------------

--
-- Table structure for table ha_member
--

CREATE TABLE ha_member (
  id bigint(20) NOT NULL,
  name varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  username varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  password varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  email varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  type varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  test varchar(6) COLLATE utf8_unicode_ci NOT NULL,
  thongtin text COLLATE utf8_unicode_ci NOT NULL,
  email_auth varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  recovery_auth varchar(32) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table test
--

CREATE TABLE test (
  i bigint(20) NOT NULL,
  name varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  time smallint(6) NOT NULL,
  id varchar(6) COLLATE utf8_unicode_ci NOT NULL,
  data text COLLATE utf8_unicode_ci NOT NULL,
  author text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table ha_member
--
ALTER TABLE ha_member
  ADD PRIMARY KEY (id);

--
-- Indexes for table test
--
ALTER TABLE test
  ADD PRIMARY KEY (i);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table ha_member
--
ALTER TABLE ha_member
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table test
--
ALTER TABLE test
  MODIFY i bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;