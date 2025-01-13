-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fastevent
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `eventoID` int NOT NULL AUTO_INCREMENT,
  `titolo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nroPosti` int NOT NULL,
  `luogo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `data` date NOT NULL,
  `descrizione` text COLLATE utf8mb4_general_ci NOT NULL,
  `genere` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `isEcologic` tinyint(1) DEFAULT '0',
  `ora` time NOT NULL,
  `copertina` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isVisible` tinyint(1) DEFAULT '1',
  `promoterID` int NOT NULL,
  PRIMARY KEY (`eventoID`),
  KEY `promoterID` (`promoterID`),
  CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`promoterID`) REFERENCES `promoter` (`promoterID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
INSERT INTO `evento` VALUES (1,'Concerto Rock',500,'Stadio Centrale','2024-12-20','Un evento rock con band locali e internazionali.','Rock',0,'20:00:00','rock_concerto.jpg',1,1),(2,'Festa Elettronica',800,'Piazza Grande','2024-12-22','Evento di musica elettronica con DJ di fama internazionale.','Elettronica',1,'22:00:00','festa_elettronica.jpg',1,1),(3,'Evento Prova',150,'posizione','2015-10-05','Descrizione di prova','prova',0,'20:30:00',NULL,1,1),(4,'Evento Prova 2',150,'posizione','2015-10-05','Descrizione di prova','prova',0,'20:30:00',NULL,1,1);
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-12 17:56:24
