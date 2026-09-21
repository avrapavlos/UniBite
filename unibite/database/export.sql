-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: unibite
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin_root','password123','admin.root@unibite.edu','2026-09-13 15:03:36'),(2,'admin_support','password123','support@unibite.edu','2026-09-13 15:03:36');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advertisments`
--

DROP TABLE IF EXISTS `advertisments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advertisments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `point_cost` int NOT NULL DEFAULT '0',
  `date_posted` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_of_deletion` timestamp NULL DEFAULT NULL,
  `date_of_delivery` timestamp NULL DEFAULT NULL,
  `location_lat` decimal(9,6) NOT NULL,
  `location_lng` decimal(9,6) NOT NULL,
  `building_name` varchar(255) NOT NULL,
  `room_number` varchar(255) NOT NULL,
  `portions` int NOT NULL,
  `path_to_picture` varchar(255) DEFAULT NULL,
  `state_of_ad` enum('ACTIVE','INACTIVE','DELETED') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ad_creator` (`creator_id`),
  CONSTRAINT `fk_ad_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advertisments`
--

LOCK TABLES `advertisments` WRITE;
/*!40000 ALTER TABLE `advertisments` DISABLE KEYS */;
INSERT INTO `advertisments` VALUES (1,1,'Leftover Pizza from Club Meeting','About 8 slices of pepperoni and veggie pizza left over from the CS club meeting.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 09:03:36',38.291800,21.789700,'Student Union','204',8,'/uploads/ads/pizza.jpg','ACTIVE'),(2,2,'Extra Sushi Platters','Two untouched sushi platters from a department seminar. Vegetarian rolls included.',4,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 13:03:36',38.292300,21.788400,'Engineering Hall','110',6,'/uploads/ads/sushi.jpg','ACTIVE'),(3,3,'Bakery Surplus - Croissants','Fresh croissants from the campus bakery, baked this morning and unsold.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 17:03:36',38.290500,21.790800,'Campus Bakery','N/A',12,'/uploads/ads/croissants.jpg','ACTIVE'),(4,4,'Vegetable Stir Fry - Cooking Class Extras','Large batch of vegetable stir fry made during today\'s culinary elective.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-11 13:03:36',38.293000,21.787200,'Home Economics Bldg','305',10,'/uploads/ads/stirfry.jpg','ACTIVE'),(5,5,'Sandwich Platter from Seminar','Assorted sandwich halves left after a guest lecture, mostly turkey and hummus.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 21:03:36',38.289600,21.791600,'Arts Building','2',5,'/uploads/ads/sandwiches.jpg','ACTIVE'),(6,6,'Fresh Fruit Bowls','Pre-cut fruit bowls from a wellness fair, apples, grapes, and melon.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 23:03:36',38.294100,21.786900,'Sports Complex','Lobby',7,'/uploads/ads/fruit.jpg','ACTIVE'),(7,1,'Pasta Bake - Dorm Event Leftovers','Baked ziti from tonight\'s dorm floor social, still warm.',3,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 01:03:36',38.291800,21.789700,'Maple Hall','Common Room',9,'/uploads/ads/pasta.jpg','ACTIVE'),(8,2,'Bagels & Cream Cheese','Boxed bagels with a few tubs of cream cheese left from a morning meeting.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 03:03:36',38.292300,21.788400,'Admin Building','112',10,'/uploads/ads/bagels.jpg','ACTIVE'),(9,3,'Curry and Rice - Cultural Night','Chickpea curry and rice from the International Student Association cultural night.',3,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 05:03:36',38.290500,21.790800,'Global Center','Main Hall',8,'/uploads/ads/curry.jpg','ACTIVE'),(10,4,'Soup and Bread - Charity Event','Vegetable soup and fresh bread rolls from tonight\'s charity dinner.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 07:03:36',38.293000,21.787200,'Community Kitchen','1',6,'/uploads/ads/soup.jpg','ACTIVE'),(11,5,'Cupcakes - Bake Sale Extras','Unsold cupcakes from the fundraiser bake sale, assorted flavors.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 10:03:36',38.289600,21.791600,'Student Union','Atrium',15,'/uploads/ads/cupcakes.jpg','ACTIVE'),(12,6,'Falafel Wraps - Food Truck Leftovers','Falafel wraps that the food truck pop-up couldn\'t sell before closing.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 13:03:36',38.294100,21.786900,'Quad','Food Truck Row',5,'/uploads/ads/falafel.jpg','ACTIVE'),(13,1,'Granola Bars - Study Session Extras','Boxes of granola bars left over from a late-night study session giveaway.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 14:03:36',38.291800,21.789700,'Library','Study Room 3',20,'/uploads/ads/granola.jpg','INACTIVE'),(14,2,'Veggie Burgers - BBQ Leftovers','Grilled veggie burgers from the dorm BBQ, buns included.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 14:03:36',38.292300,21.788400,'Maple Hall','Courtyard',6,'/uploads/ads/veggieburgers.jpg','INACTIVE'),(15,3,'Rice Pudding - Dessert Night','Homemade rice pudding from the international dessert night.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-11 03:03:36',38.290500,21.790800,'Global Center','Kitchen',8,'/uploads/ads/ricepudding.jpg','DELETED'),(16,4,'Chicken Wraps - Sports Event Leftovers','Chicken wraps left over from the intramural sports tournament.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-11 08:03:36',38.293000,21.787200,'Sports Complex','Concessions',5,'/uploads/ads/chickenwraps.jpg','DELETED');
/*!40000 ALTER TABLE `advertisments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `calcDeletion` BEFORE INSERT ON `advertisments` FOR EACH ROW BEGIN
    SET NEW.date_of_deletion = ADDDATE(CURRENT_TIMESTAMP(), INTERVAL 48 HOUR);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;