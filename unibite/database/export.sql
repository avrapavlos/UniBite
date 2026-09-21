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
INSERT INTO `advertisments` VALUES (1,1,'Leftover Pizza from Club Meeting','About 8 slices of pepperoni and veggie pizza left over from the CS club meeting.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 09:03:36',37.871900,-122.258500,'Student Union','204',8,'/uploads/ads/pizza.jpg','ACTIVE'),(2,2,'Extra Sushi Platters','Two untouched sushi platters from a department seminar. Vegetarian rolls included.',4,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 13:03:36',37.872400,-122.259800,'Engineering Hall','110',6,'/uploads/ads/sushi.jpg','ACTIVE'),(3,3,'Bakery Surplus - Croissants','Fresh croissants from the campus bakery, baked this morning and unsold.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 17:03:36',37.870600,-122.257100,'Campus Bakery','N/A',12,'/uploads/ads/croissants.jpg','ACTIVE'),(4,4,'Vegetable Stir Fry - Cooking Class Extras','Large batch of vegetable stir fry made during today\'s culinary elective.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-11 13:03:36',37.873100,-122.260200,'Home Economics Bldg','305',10,'/uploads/ads/stirfry.jpg','ACTIVE'),(5,5,'Sandwich Platter from Seminar','Assorted sandwich halves left after a guest lecture, mostly turkey and hummus.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 21:03:36',37.869800,-122.256200,'Arts Building','2',5,'/uploads/ads/sandwiches.jpg','ACTIVE'),(6,6,'Fresh Fruit Bowls','Pre-cut fruit bowls from a wellness fair, apples, grapes, and melon.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-12 23:03:36',37.874200,-122.261500,'Sports Complex','Lobby',7,'/uploads/ads/fruit.jpg','ACTIVE'),(7,1,'Pasta Bake - Dorm Event Leftovers','Baked ziti from tonight\'s dorm floor social, still warm.',3,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 01:03:36',37.871900,-122.258500,'Maple Hall','Common Room',9,'/uploads/ads/pasta.jpg','ACTIVE'),(8,2,'Bagels & Cream Cheese','Boxed bagels with a few tubs of cream cheese left from a morning meeting.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 03:03:36',37.872400,-122.259800,'Admin Building','112',10,'/uploads/ads/bagels.jpg','ACTIVE'),(9,3,'Curry and Rice - Cultural Night','Chickpea curry and rice from the International Student Association cultural night.',3,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 05:03:36',37.870600,-122.257100,'Global Center','Main Hall',8,'/uploads/ads/curry.jpg','ACTIVE'),(10,4,'Soup and Bread - Charity Event','Vegetable soup and fresh bread rolls from tonight\'s charity dinner.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 07:03:36',37.873100,-122.260200,'Community Kitchen','1',6,'/uploads/ads/soup.jpg','ACTIVE'),(11,5,'Cupcakes - Bake Sale Extras','Unsold cupcakes from the fundraiser bake sale, assorted flavors.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 10:03:36',37.869800,-122.256200,'Student Union','Atrium',15,'/uploads/ads/cupcakes.jpg','ACTIVE'),(12,6,'Falafel Wraps - Food Truck Leftovers','Falafel wraps that the food truck pop-up couldn\'t sell before closing.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 13:03:36',37.874200,-122.261500,'Quad','Food Truck Row',5,'/uploads/ads/falafel.jpg','ACTIVE'),(13,1,'Granola Bars - Study Session Extras','Boxes of granola bars left over from a late-night study session giveaway.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 14:03:36',37.871900,-122.258500,'Library','Study Room 3',20,'/uploads/ads/granola.jpg','INACTIVE'),(14,2,'Veggie Burgers - BBQ Leftovers','Grilled veggie burgers from the dorm BBQ, buns included.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-13 14:03:36',37.872400,-122.259800,'Maple Hall','Courtyard',6,'/uploads/ads/veggieburgers.jpg','INACTIVE'),(15,3,'Rice Pudding - Dessert Night','Homemade rice pudding from the international dessert night.',1,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-11 03:03:36',37.870600,-122.257100,'Global Center','Kitchen',8,'/uploads/ads/ricepudding.jpg','DELETED'),(16,4,'Chicken Wraps - Sports Event Leftovers','Chicken wraps left over from the intramural sports tournament.',2,'2026-09-13 15:03:36','2026-09-15 15:03:36','2026-09-11 08:03:36',37.873100,-122.260200,'Sports Complex','Concessions',5,'/uploads/ads/chickenwraps.jpg','DELETED');
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
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `allergens`
--

DROP TABLE IF EXISTS `allergens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allergens` (
  `allergen_id` int NOT NULL AUTO_INCREMENT,
  `allergen_name` varchar(255) NOT NULL,
  `id` int NOT NULL,
  PRIMARY KEY (`allergen_id`),
  UNIQUE KEY `unique_ad_allergen` (`id`,`allergen_name`),
  CONSTRAINT `fk_allergen_ad` FOREIGN KEY (`id`) REFERENCES `advertisments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allergens`
--

LOCK TABLES `allergens` WRITE;
/*!40000 ALTER TABLE `allergens` DISABLE KEYS */;
INSERT INTO `allergens` VALUES (2,'dairy',1),(1,'gluten',1),(26,'crustaceans',2),(3,'fish',2),(32,'molluscs',2),(4,'soybeans',2),(6,'dairy',3),(5,'gluten',3),(31,'lupin',3),(7,'soybeans',4),(8,'gluten',5),(30,'sulphur dioxide',5),(29,'celery',6),(10,'dairy',7),(9,'gluten',7),(12,'dairy',8),(11,'gluten',8),(13,'gluten',9),(28,'mustard',9),(14,'dairy',10),(15,'gluten',10),(17,'dairy',11),(16,'gluten',11),(18,'gluten',12),(27,'sesame',12),(19,'gluten',13),(20,'nuts',13),(33,'peanuts',13),(21,'gluten',14),(22,'soybeans',14),(23,'dairy',15),(24,'eggs',15),(25,'gluten',16);
/*!40000 ALTER TABLE `allergens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `req_id` int NOT NULL,
  `rater_id` int DEFAULT NULL,
  `rated_user_id` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `comment` text,
  `description` text,
  PRIMARY KEY (`rating_id`),
  KEY `fk_requests` (`req_id`),
  KEY `fk_rating_rater` (`rater_id`),
  KEY `fk_rating_rated_user` (`rated_user_id`),
  CONSTRAINT `fk_rating_rated_user` FOREIGN KEY (`rated_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_rating_rater` FOREIGN KEY (`rater_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_requests` FOREIGN KEY (`req_id`) REFERENCES `requests` (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,1,2,1,5,'Pizza was still warm and the pickup was easy, would grab again!',NULL),(2,3,1,2,4,'Sushi was fresh, just had to wait a bit at pickup.',NULL),(3,9,3,5,5,'Sandwiches were perfect for a quick meal between classes.',NULL),(4,13,4,1,4,'Pasta was good, portion size was generous for the point cost.',NULL);
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `con_id` int DEFAULT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `claimed_portions` int NOT NULL DEFAULT '1',
  `date_posted` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `accepted_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `state_of_delivery` enum('DELIVERED','MISSED') DEFAULT 'DELIVERED',
  `missedDeliveryPenalty` tinyint(1) DEFAULT '0',
  `penalty_applied` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`request_id`),
  KEY `fk_advertisment` (`id`),
  KEY `fk_consumer` (`con_id`),
  CONSTRAINT `fk_advertisment` FOREIGN KEY (`id`) REFERENCES `advertisments` (`id`),
  CONSTRAINT `fk_consumer` FOREIGN KEY (`con_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
INSERT INTO `requests` VALUES (1,1,2,'ACCEPTED',2,'2026-09-12 09:03:36','2026-09-12 10:03:36',NULL,'2026-09-12 10:03:36','DELIVERED',0,0),(2,1,3,'REJECTED',1,'2026-09-12 11:03:36',NULL,'2026-09-12 12:03:36','2026-09-12 12:03:36','DELIVERED',0,0),(3,2,1,'ACCEPTED',1,'2026-09-12 13:03:36','2026-09-12 14:03:36',NULL,'2026-09-12 14:03:36','DELIVERED',0,0),(4,2,4,'PENDING',2,'2026-09-13 10:03:36',NULL,NULL,NULL,'DELIVERED',0,0),(5,3,5,'ACCEPTED',3,'2026-09-12 17:03:36','2026-09-12 18:03:36',NULL,'2026-09-12 18:03:36','DELIVERED',0,0),(6,3,6,'PENDING',1,'2026-09-13 11:03:36',NULL,NULL,NULL,'DELIVERED',0,0),(7,4,2,'ACCEPTED',2,'2026-09-11 13:03:36','2026-09-11 14:03:36',NULL,'2026-09-13 12:03:36','MISSED',1,1),(8,4,1,'REJECTED',1,'2026-09-12 19:03:36',NULL,'2026-09-12 20:03:36','2026-09-12 20:03:36','DELIVERED',0,0),(9,5,3,'ACCEPTED',1,'2026-09-12 21:03:36','2026-09-12 22:03:36',NULL,'2026-09-12 22:03:36','DELIVERED',0,0),(10,5,6,'PENDING',2,'2026-09-13 12:03:36',NULL,NULL,NULL,'DELIVERED',0,0),(11,6,4,'ACCEPTED',2,'2026-09-12 23:03:36','2026-09-13 00:03:36',NULL,'2026-09-13 00:03:36','DELIVERED',0,0),(12,6,5,'PENDING',1,'2026-09-13 13:03:36',NULL,NULL,NULL,'DELIVERED',0,0),(13,7,4,'ACCEPTED',3,'2026-09-13 01:03:36','2026-09-13 02:03:36',NULL,'2026-09-13 02:03:36','DELIVERED',0,0),(14,7,6,'REJECTED',1,'2026-09-13 03:03:36',NULL,'2026-09-13 04:03:36','2026-09-13 04:03:36','DELIVERED',0,0),(15,9,2,'ACCEPTED',2,'2026-09-13 05:03:36','2026-09-13 06:03:36',NULL,'2026-09-13 06:03:36','DELIVERED',0,0),(16,9,1,'PENDING',1,'2026-09-13 14:03:36',NULL,NULL,NULL,'DELIVERED',0,0),(17,11,2,'ACCEPTED',1,'2026-09-11 23:03:36','2026-09-12 00:03:36',NULL,'2026-09-13 09:03:36','MISSED',1,1),(18,12,3,'PENDING',2,'2026-09-13 13:03:36',NULL,NULL,NULL,'DELIVERED',0,0),(19,13,5,'REJECTED',1,'2026-09-13 07:03:36',NULL,'2026-09-13 08:03:36','2026-09-13 08:03:36','DELIVERED',0,0),(20,16,6,'PENDING',2,'2026-09-13 14:03:36',NULL,NULL,NULL,'DELIVERED',0,0);
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `points` int DEFAULT '0',
  `portions_given` int DEFAULT '0',
  `portions_received` int DEFAULT '0',
  `profile_picture` varchar(255) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'alex_kim','alex.kim@uni.edu','password123','Alex Kim',42,10,3,'/uploads/profiles/alex_kim.jpg',37.871900,-122.258500,'2026-09-13 15:03:36'),(2,'maria_lopez','maria.lopez@uni.edu','password123','Maria Lopez',27,6,5,'/uploads/profiles/maria_lopez.jpg',37.872400,-122.259800,'2026-09-13 15:03:36'),(3,'daniel_osei','daniel.osei@uni.edu','password123','Daniel Osei',15,3,7,'/uploads/profiles/daniel_osei.jpg',37.870600,-122.257100,'2026-09-13 15:03:36'),(4,'priya_singh','priya.singh@uni.edu','password123','Priya Singh',8,2,4,'/uploads/profiles/priya_singh.jpg',37.873100,-122.260200,'2026-09-13 15:03:36'),(5,'tom_becker','tom.becker@uni.edu','password123','Tom Becker',19,4,2,'/uploads/profiles/tom_becker.jpg',37.869800,-122.256200,'2026-09-13 15:03:36'),(6,'sofia_ionescu','sofia.ionescu@uni.edu','password123','Sofia Ionescu',33,7,1,'/uploads/profiles/sofia_ionescu.jpg',37.874200,-122.261500,'2026-09-13 15:03:36');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-13 18:09:19
