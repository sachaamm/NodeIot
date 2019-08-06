-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 11, 2018 at 11:04 PM
-- Server version: 5.7.19
-- PHP Version: 7.0.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `beeyond`
--

-- --------------------------------------------------------

--
-- Table structure for table `beeyond_archive_file`
--

DROP TABLE IF EXISTS `beeyond_archive_file`;
CREATE TABLE IF NOT EXISTS `beeyond_archive_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(70) NOT NULL,
  `description` text NOT NULL,
  `fileName` varchar(55) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `beeyond_captation`
--

DROP TABLE IF EXISTS `beeyond_captation`;
CREATE TABLE IF NOT EXISTS `beeyond_captation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `sensorId` text NOT NULL,
  `protocol` varchar(30) NOT NULL,
  `port` varchar(30) NOT NULL,
  `dateStart` varchar(30) DEFAULT NULL,
  `dateEnd` varchar(40) DEFAULT NULL,
  `nbResults` int(20) DEFAULT NULL,
  `fileName` varchar(40) DEFAULT NULL,
  `additionalProtocolInfo` varchar(50) DEFAULT NULL,
  `gpsAssisted` varchar(20) NOT NULL,
  `arduinoFileName` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `beeyond_captation`
--

INSERT INTO `beeyond_captation` (`id`, `name`, `sensorId`, `protocol`, `port`, `dateStart`, `dateEnd`, `nbResults`, `fileName`, `additionalProtocolInfo`, `gpsAssisted`, `arduinoFileName`) VALUES
(2, 'DHT11viaUDP', '7', 'UDP', '', NULL, NULL, NULL, NULL, '9600', 'off', ''),
(3, 'MSC5611-Captation', '9', 'UDP', '', NULL, NULL, NULL, NULL, '9600', 'off', ''),
(16, 'DHT11-GPS', '7', 'UDP', '', NULL, NULL, NULL, NULL, '', 'on', ''),
(7, 'GPS Captation', '10', 'UDP', '', NULL, NULL, NULL, NULL, '', 'off', ''),
(15, 'MSC5611-gps', '9', 'UDP', '', NULL, NULL, NULL, NULL, '', 'on', ''),
(14, 'GPS T', '7', 'UDP', '', NULL, NULL, NULL, NULL, '', 'on', ''),
(17, 'BME280-Gps', '12', 'UDP', '', NULL, NULL, NULL, NULL, '', 'on', '');

-- --------------------------------------------------------

--
-- Table structure for table `beeyond_captation_file`
--

DROP TABLE IF EXISTS `beeyond_captation_file`;
CREATE TABLE IF NOT EXISTS `beeyond_captation_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `captationId` int(11) NOT NULL,
  `date` varchar(140) NOT NULL,
  `fileName` varchar(40) NOT NULL,
  `nbResults` int(11) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `beeyond_captation_file`
--

INSERT INTO `beeyond_captation_file` (`id`, `captationId`, `date`, `fileName`, `nbResults`, `description`) VALUES
(6, 15, 'Tue Mar 06 2018 14:47:34 GMT+0100 (Romance Standard Time)', 'MSC5611-gps-r7iva9Wu7QsR0d1_AAAC', 4, 'CZSFDFSDF'),
(5, 15, 'Tue Mar 06 2018 14:36:34 GMT+0100 (Romance Standard Time)', 'MSC5611-gps-jFzz4sOX9PzvQRbGAAAA', 1, 'sdsdfsdf'),
(4, 15, 'Mon Mar 05 2018 13:11:30 GMT+0100 (Romance Standard Time)', 'MSC5611-gps-32YuPOZ2bXuMQquJAAAA', 3, 'heyyyyy');

-- --------------------------------------------------------

--
-- Table structure for table `beeyond_newsletter_subscription`
--

DROP TABLE IF EXISTS `beeyond_newsletter_subscription`;
CREATE TABLE IF NOT EXISTS `beeyond_newsletter_subscription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(40) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `company` varchar(50) NOT NULL,
  `mail` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `beeyond_newsletter_subscription`
--

INSERT INTO `beeyond_newsletter_subscription` (`id`, `nom`, `prenom`, `company`, `mail`) VALUES
(2, 'AMIEL', 'Alexandre', 'asdasdsd', 'sachaamm@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `beeyond_sensor`
--

DROP TABLE IF EXISTS `beeyond_sensor`;
CREATE TABLE IF NOT EXISTS `beeyond_sensor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(35) NOT NULL,
  `palette` varchar(35) NOT NULL,
  `valuesNames` text NOT NULL,
  `unitsNames` text NOT NULL,
  `valuesTypes` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `beeyond_sensor`
--

INSERT INTO `beeyond_sensor` (`id`, `name`, `palette`, `valuesNames`, `unitsNames`, `valuesTypes`) VALUES
(9, 'MSC5611', 'spectrum2001', 'Temperature***Pression***Altitude***', 'C***mBar***m***', 'Float32***Float32***Float32***'),
(7, 'DHT11', 'classic9', 'Temperature***Humidity***', 'C***H***', 'Int8***Int8***'),
(10, 'GPSTest', 'classic9', 'Latitude***Longitude***Altitude***Satellites***', '-***-***m***-***', 'Float32***Float32***Float32***Int8***'),
(12, 'BME280', 'classic9', 'Temperature***Pressure***Altitude***Humidite***', 'C***mBar***m***H***', 'Float32***Float32***Float32***Float32***');

-- --------------------------------------------------------

--
-- Table structure for table `beeyond_user`
--

DROP TABLE IF EXISTS `beeyond_user`;
CREATE TABLE IF NOT EXISTS `beeyond_user` (
  `id` int(11) NOT NULL,
  `mail` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `statut` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
