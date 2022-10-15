-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: today_workout_complete
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `board_id` int NOT NULL AUTO_INCREMENT,
  `MemberInfo_member_id` int NOT NULL,
  `board_name` varchar(45) NOT NULL,
  `board_type_code` varchar(45) NOT NULL COMMENT '큰 유형을 나누기 위한 코드. ',
  `creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `availability` tinyint(1) NOT NULL DEFAULT '1' COMMENT '게시판 사용 여부 ex. 0 = 폐쇄, 1 = 개방',
  `sort_order` varchar(45) DEFAULT NULL COMMENT '이름순, 생성 날짜순 등',
  PRIMARY KEY (`board_id`),
  KEY `fk_Board_MemberInfo_idx` (`MemberInfo_member_id`),
  CONSTRAINT `fk_Board_MemberInfo` FOREIGN KEY (`MemberInfo_member_id`) REFERENCES `memberinfo` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
INSERT INTO `board` VALUES (1,1,'테스트 게시판','999','2022-08-16 19:04:41',1,NULL),(2,1,'운동 게시판','99','2022-08-16 19:13:10',1,NULL);
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `Comments_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `nickname` varchar(45) NOT NULL,
  `parent_comment_id` int DEFAULT NULL,
  `ip` varchar(45) NOT NULL,
  `content` varchar(45) NOT NULL,
  `delete_stats` tinyint(1) NOT NULL DEFAULT '1',
  `creation_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Comments_id`),
  KEY `fk_Comments_Post1_idx` (`post_id`),
  KEY `fk_Comments_Comments1_idx` (`parent_comment_id`,`Comments_id`),
  CONSTRAINT `fk_Comments_Comments1` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`Comments_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Comments_Post1` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,9,'테스뚜',NULL,'::ffff:127.0.0.1',' 테스트1댓글1',1,'2022-08-22 15:25:47','2022-08-22 15:25:47'),(2,9,'테스뚜',NULL,'::ffff:127.0.0.1','테스트1댓글2',1,'2022-08-22 15:25:54','2022-08-22 15:25:54'),(3,9,'테스뚜',NULL,'::ffff:127.0.0.1','테스트1댓글3',1,'2022-08-22 15:26:05','2022-08-22 15:26:05'),(4,7,'a2수정닉넴',NULL,'::ffff:127.0.0.1','Hi',1,'2022-10-09 18:12:50','2022-10-09 18:12:50'),(5,7,'a2수정닉넴',NULL,'::ffff:127.0.0.1','Hi2',1,'2022-10-09 18:13:17','2022-10-09 18:13:17'),(6,13,'이름',NULL,'::ffff:127.0.0.1','Hoho',1,'2022-10-09 22:39:45','2022-10-09 22:39:45'),(7,14,'이름',NULL,'::ffff:127.0.0.1','Sggggg',1,'2022-10-10 13:19:47','2022-10-10 13:19:47'),(8,14,'s',NULL,'::ffff:127.0.0.1','Hi',1,'2022-10-10 20:57:36','2022-10-10 20:57:36');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `post_id` int NOT NULL,
  `nickname` varchar(45) NOT NULL,
  KEY `fk_Likes_Post1` (`post_id`),
  KEY `fk_Likes_MemberInfo1` (`nickname`),
  CONSTRAINT `fk_Likes_MemberInfo1` FOREIGN KEY (`nickname`) REFERENCES `memberinfo` (`nickname`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Likes_Post1` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (8,'테스뚜'),(8,'a33'),(8,'이름'),(9,'테스뚜'),(12,'이름'),(13,'이름'),(5,'s');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memberinfo`
--

DROP TABLE IF EXISTS `memberinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memberinfo` (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(45) NOT NULL,
  `password` varchar(128) NOT NULL,
  `uesr_name` varchar(30) NOT NULL,
  `introduction` text NOT NULL COMMENT '자기소개',
  `phonenumber` int NOT NULL,
  `address` varchar(45) NOT NULL,
  `sex` varchar(1) NOT NULL COMMENT 'M = Male, F = Female',
  `nickname` varchar(45) NOT NULL,
  `profile_img_path` varchar(500) DEFAULT '../public/img/userProfile/default.jpg',
  `grantion_level` varchar(1) NOT NULL COMMENT '권한 등급  ex. 관리자, 사용자',
  `creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_datetime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '최근 로그인 일시',
  `password_changed_datetime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '비밀번호 변경일시',
  `deletion_datetime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '삭제일시',
  `mail_reception` tinyint(1) DEFAULT '1' COMMENT '메일 수신 여부',
  `authentication_status` tinyint(1) DEFAULT '1' COMMENT '인증여부',
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
ALTER table memberinfo modify column password varchar(250);

--
-- Dumping data for table `memberinfo`
--

LOCK TABLES `memberinfo` WRITE;
/*!40000 ALTER TABLE `memberinfo` DISABLE KEYS */;
INSERT INTO `memberinfo` VALUES (1,'test123@naver.com','qwe123','테스트','안녕하세요! 테스트입니다.',1045627894,'서울시 노원구','M','테스뚜','default.png','1','2022-08-16 19:04:41','2022-08-16 19:04:41',NULL,NULL,1,1),(2,'a2@naver.com','a2','a2이름','자기소개dfdafafsdafewrwerqrwer',1022222222,'대전시','남','이름','default.png','1','2022-08-16 19:06:44','2022-08-16 19:06:44',NULL,NULL,1,1),(3,'a3@naver.com','a3','에이쓰리','안녕',1033333333,'충북','남','a33','default','1','2022-08-18 16:00:54','2022-08-18 16:00:54',NULL,NULL,1,1),(4,'abcdef@naver.com','1234','궁영정','없어융',1010101010,'없서용','남','뉙뉌','default','1','2022-10-09 21:13:23','2022-10-09 21:13:23',NULL,NULL,1,1),(5,'jgy_98@naver.com','1234','','없엉ㅅㅌ',1000000000,'Qwer','남','닙눼ㅔ임','default','1','2022-10-09 21:17:46','2022-10-09 21:17:46',NULL,NULL,1,1),(6,'park@naver.com','123456','park','얍',1047561234,'교통','남','얍','default','1','2022-10-09 21:17:48','2022-10-09 21:17:48',NULL,NULL,1,1),(7,'s@a.c','1','s','s',1,'S','여','s','default','1','2022-10-10 13:43:51','2022-10-10 13:43:51',NULL,NULL,1,1);
/*!40000 ALTER TABLE `memberinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `board_id` int NOT NULL,
  `nickname` varchar(45) NOT NULL,
  `title` varchar(45) NOT NULL,
  `comment` text NOT NULL,
  `ip` varchar(45) NOT NULL,
  `photographic_path` varchar(200) DEFAULT NULL,
  `creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `delection_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `views` int NOT NULL DEFAULT '0',
  `like` int NOT NULL DEFAULT '0',
  `availabilty_comments` tinyint(1) NOT NULL DEFAULT '1' COMMENT '댓글 작성 가능 여부 ex. 0 = 불가능, 1 = 가능',
  `comments_quantity` int NOT NULL DEFAULT '0' COMMENT '댓글 개수',
  `emg_data_path` varchar(100) DEFAULT NULL,
  `likes` int DEFAULT '0',
  `chartname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `fk_Bulletin_MemberInfo1_idx` (`nickname`),
  KEY `fk_Bulletin_Board1_idx` (`board_id`),
  KEY `emg_data_path` (`emg_data_path`),
  CONSTRAINT `fk_Bulletin_Board1` FOREIGN KEY (`board_id`) REFERENCES `board` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Bulletin_MemberInfo1` FOREIGN KEY (`nickname`) REFERENCES `memberinfo` (`nickname`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`emg_data_path`) REFERENCES `sensordata` (`emg_data_path`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (5,2,'테스뚜','a1','a1','::ffff:127.0.0.1','default.png','2022-08-16 19:13:51',NULL,NULL,1,0,1,0,NULL,0,NULL),(6,2,'테스뚜','test1','test1','::ffff:127.0.0.1','undefined_function toLocaleString() { [native code] }_RFID 태그땟ㅇ르때.jpg','2022-08-16 19:14:17',NULL,NULL,1,0,1,0,NULL,0,NULL),(7,2,'이름','a2첫글','a2처음글내용','::ffff:127.0.0.1','undefined_function toLocaleString() { [native code] }_브레드보드테스트사진.jpg','2022-08-16 19:15:39',NULL,NULL,5,0,1,0,NULL,0,NULL),(8,2,'이름','a2두번째글제목','a2두번째글내용','::ffff:127.0.0.1','undefined_function toLocaleString() { [native code] }_태그.jpg','2022-08-16 19:17:40',NULL,NULL,5,0,1,0,NULL,0,NULL),(9,2,'테스뚜','테스트1','테스트1내용ㅇㅇ','::ffff:127.0.0.1','undefined_function toLocaleString() { [native code] }_RFID 태그댓을때.jpg','2022-08-21 02:53:58',NULL,NULL,11,0,1,0,NULL,3,NULL),(12,2,'이름','asdf','asdf','::ffff:127.0.0.1','undefined_function toLocaleString() { [native code] }_교통대마크.png','2022-10-09 21:51:52',NULL,NULL,5,0,1,0,NULL,NULL,NULL),(13,2,'이름','mobile test1','오늘 운동한 내용을 말해주세요~!dfadfasfsd','::ffff:127.0.0.1','default.png','2022-10-09 22:30:34',NULL,NULL,3,0,1,0,NULL,NULL,NULL),(14,2,'이름','no webview1','no webivewdddddd','::ffff:127.0.0.1','undefined_function toLocaleString() { [native code] }_IMG_20221010_041355.jpg','2022-10-10 13:14:10',NULL,NULL,14,0,1,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensordata`
--

DROP TABLE IF EXISTS `sensordata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensordata` (
  `nickname` varchar(45) NOT NULL,
  `creation_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `emg_data_path` varchar(100) DEFAULT NULL,
  UNIQUE KEY `emg_data_path` (`emg_data_path`),
  KEY `fk_SensorData_MemberInfo_nickname` (`nickname`),
  CONSTRAINT `fk_SensorData_MemberInfo_nickname` FOREIGN KEY (`nickname`) REFERENCES `memberinfo` (`nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensordata`
--

LOCK TABLES `sensordata` WRITE;
/*!40000 ALTER TABLE `sensordata` DISABLE KEYS */;
/*!40000 ALTER TABLE `sensordata` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-12 12:34:40
