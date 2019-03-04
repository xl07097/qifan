-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2017-02-28 10:08:37
-- 服务器版本： 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qfdb`
--
CREATE DATABASE IF NOT EXISTS `qfdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `qfdb`;

DELIMITER $$
--
-- 存储过程
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_collectcook` (IN `userId` INT, IN `cookId` INT)  NO SQL
BEGIN
  DECLARE rowCount int;
  SELECT COUNT(*) INTO rowCount FROM t_collectcook WHERE t_cook_cook_id=cookId AND t_user_user_id=userId;
  if rowCount=0 THEN
  INSERT INTO t_collectcook VALUES(null,userId,cookId);
  UPDATE t_cook SET cook_collects = cook_collects+1 WHERE t_cook.cook_id=cookId;
  ELSE
  DELETE FROM t_collectcook WHERE t_cook_cook_id=cookId AND t_user_user_id=userId;
  UPDATE t_cook SET cook_collects = cook_collects-1 WHERE t_cook.cook_id=cookId;
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_collecttopic` (IN `userId` INT, IN `topicId` INT)  NO SQL
    COMMENT '话题收藏与取消收藏'
BEGIN
  DECLARE rowCount int;
  SELECT COUNT(*) INTO rowCount FROM t_collecttopic WHERE t_topic_topic_id=cookId AND t_user_user_id=userId;
  if rowCount=0 THEN
  INSERT INTO t_collecttopic VALUES(null,userId,topicId);
  UPDATE t_topic SET topic_collectNum=topic_collectNum+1 WHERE t_topic.topic_id=topicId;
  ELSE
  DELETE FROM t_collecttopic WHERE t_topic_topic_id=cookId AND t_user_user_id=userId;
  UPDATE t_topic SET topic_collectNum=topic_collectNum-1 WHERE t_topic.topic_id=topicId;
  END IF;  
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_collectvideo` (IN `videoId` INT, IN `userId` INT)  NO SQL
BEGIN
  DECLARE rowCount int;
  SELECT COUNT(*) INTO rowCount FROM t_videocollect WHERE t_video_video_id=videoId AND t_user_user_id=userId;
  if rowCount=0 THEN
  INSERT INTO t_videocollect VALUES(null,userId,videoId);
  UPDATE t_video SET video_collects = video_collects+1 WHERE t_video.video_id=videoId;
  ELSE
  DELETE FROM t_videocollect WHERE t_video_video_id=videoId AND t_user_user_id=userId;
  UPDATE t_video SET video_collects = video_collects-1 WHERE t_video.video_id=videoId;
  END IF;
  
  SELECT t_video.video_collects FROM t_video WHERE t_video.video_id=videoId;
  SELECT t_videocollect.* FROM t_videocollect WHERE t_videocollect.t_video_video_id=videoId AND t_videocollect.t_user_user_id=userId;
  
 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_cookcomment` (IN `content` TEXT, IN `time` VARCHAR(25), IN `userid` INT, IN `cookid` INT)  NO SQL
BEGIN
	insert into t_comment_cook values(null,content,time,userid,cookid);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_cookDelete` (IN `cookId` INT)  NO SQL
BEGIN
  DELETE FROM t_step WHERE t_step.t_cook_cook_id=cookId;
  DELETE FROM t_material WHERE t_material.t_cook_cook_id=cookId;
  DELETE FROM t_submaterial WHERE t_submaterial.t_cook_cook_id=cookId;
  DELETE FROM t_cook WHERE t_cook.cook_id=cookId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_cookdetail` (IN `cookid` INT)  NO SQL
    COMMENT '菜谱详情页的存储过程'
BEGIN
	SELECT * FROM t_cook WHERE cook_id=cookid;
    
    SELECT t_comment_cook.*,t_user.user_name,t_user.user_portart FROM t_comment_cook,t_user WHERE t_comment_cook.t_user_user_id=t_user.user_id and t_comment_cook.t_cook_cook_id=cookid ORDER BY t_comment_cook.commentcook_time DESC;
    
    SELECT t_user.* FROM t_user,t_cook WHERE t_cook.t_user_id=t_user.user_id and t_cook.cook_id=cookid;
    
    SELECT t_material.* from t_material WHERE t_cook_cook_id=cookid;
    
    SELECT t_submaterial.* from t_submaterial WHERE t_cook_cook_id=cookid;
    
    SELECT t_step.* from t_step WHERE t_step.t_cook_cook_id=cookid order by step_num ASC; 
    
    SELECT * FROM t_cook order by cook_collects DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_cookEdit` (IN `cookId` INT)  NO SQL
BEGIN
  DECLARE rowCount int;
  DECLARE i int DEFAULT 1;
  SELECT COUNT(*) INTO rowCount FROM t_cooktype_big;
  SELECT bigtype_name,bigtype_id FROM t_cooktype_big;
  WHILE i<=rowCount DO
    SELECT bigtype_name,smallType_name,bigtype_id,smalltype_id FROM t_cooktype_small,t_cooktype_big WHERE t_cooktype_big.bigtype_id=t_cooktype_small.t_cooktype_big_bigtype_id AND bigtype_id=i;
    SET i=i+1;
  END WHILE;
  SELECT * FROM t_cook WHERE cook_id=cookId;
  SELECT * FROM t_material WHERE t_cook_cook_id=cookId;
  SELECT * FROM t_submaterial WHERE t_cook_cook_id=cookId;
  SELECT * FROM t_step WHERE t_cook_cook_id=cookId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_cooklist` (IN `typeid` INT)  NO SQL
BEGIN
  DECLARE rowCount int;
  DECLARE i int DEFAULT 1;
  SELECT COUNT(*) INTO rowCount FROM t_cooktype_big;
  SELECT bigtype_name,bigtype_id FROM t_cooktype_big;
  WHILE i<=rowCount DO
    SELECT bigtype_name,smallType_name,bigtype_id,smalltype_id FROM t_cooktype_small,t_cooktype_big WHERE t_cooktype_big.bigtype_id=t_cooktype_small.t_cooktype_big_bigtype_id AND bigtype_id=i;
    SET i=i+1;
  END WHILE;
  SELECT cook_id,cook_images,cook_name,cook_likes,cook_collects,cook_date,user_id,user_name,user_portart,smalltype_id FROM t_cook,t_user,t_cooktype_small WHERE t_cook.t_user_id=t_user.user_id AND t_cooktype_small.smalltype_id=t_cook.t_cooktype_small_smalltype_id AND t_cook.t_cooktype_small_smalltype_id=typeid  ORDER BY cook_likes DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_deleteTopic` (IN `topic_id` INT)  NO SQL
BEGIN
DELETE FROM t_images WHERE t_images.topic_id=topic_id;
DELETE FROM t_collecttopic WHERE t_collecttopic.t_topoc_topic_id=topic_id;
DELETE FROM t_topic WHERE t_topic.topic_id=topic_id;  
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_deleteVideo` (IN `videoid` INT)  NO SQL
BEGIN

  DELETE FROM t_video WHERE t_video.video_id=videoid;
  

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_findpassword` (IN `tel` VARCHAR(11), IN `newpassword` VARCHAR(20))  NO SQL
BEGIN
	update t_user set user_password=newpassword where user_tele=tel; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_index` ()  NO SQL
BEGIN
  SELECT user_id,cook_id,cook_images,cook_name,user_name,cook_likes FROM t_cook,t_user WHERE t_cook.t_user_id=t_user.user_id ORDER BY cook_likes DESC LIMIT 5;
  SELECT user_id,user_portart,cook_id,cook_images,cook_name,cook_likes,cook_collects,user_name FROM t_cook,t_user WHERE t_cook.t_user_id=t_user.user_id ORDER BY cook_collects DESC LIMIT 3;
  SELECT user_id,user_portart,video_id,video_img,video_name,video_likes,video_collects,user_name FROM t_video,t_user WHERE t_video.t_user_user_id=t_user.user_id ORDER BY video_likes DESC LIMIT 1;
  SELECT t_topic.*,user_name FROM t_topic,t_user WHERE t_topic.t_user_user_id=t_user.user_id ORDER BY t_topic.topic_likecount DESC;
  SELECT * FROM t_images;
  SELECT user_id,user_name,user_portart,collect_count,topic_count FROM t_user ORDER BY collect_count DESC LIMIT 5; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_judge` (IN `cookid` INT, IN `user_id` INT, IN `userid` INT)  NO SQL
BEGIN
	select * from t_collectcook where t_cook_cook_id=cookid and t_user_user_id=userid;
   SELECT * from t_followuser where t_followuser.followuser_userid=userid and t_followuser.t_user_user_id=user_id;
   select * from t_likecook where t_cook_cook_id=cookid and t_user_user_id=userid;

end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_judgevideo` (IN `userid` INT, IN `videoid` INT)  NO SQL
BEGIN
	SELECT * FROM t_videocollect WHERE t_videocollect.t_user_user_id=userid AND t_videocollect.t_video_video_id=videoid;
 SELECT * FROM t_videolike WHERE t_videolike.t_user_user_id=userid AND t_videolike.t_video_video_id=videoid;
 END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_judgeVlist` (IN `userid` INT)  NO SQL
BEGIN
   SELECT * FROM t_videolike WHERE t_videolike.t_user_user_id=userid ORDER BY t_videolike.t_video_video_id; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_likecook` (IN `cookId` INT, IN `userId` INT)  NO SQL
    COMMENT '对菜谱的点赞和取消'
BEGIN
  DECLARE rowCount int;
  SELECT COUNT(*) INTO rowCount FROM t_likecook WHERE t_cook_cook_id=cookId AND t_user_user_id=userId;
  if rowCount=0 THEN
  INSERT INTO t_likecook VALUES(null,cookId,userId);
  UPDATE t_cook SET cook_likes = cook_likes+1 WHERE t_cook.cook_id=cookId;
  ELSE
  DELETE FROM t_likecook WHERE t_cook_cook_id=cookId AND t_user_user_id=userId;
  UPDATE t_cook SET cook_likes = cook_likes-1 WHERE t_cook.cook_id=cookId;
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_liketopic` (IN `userId` INT, IN `topicId` INT)  NO SQL
    COMMENT '对话题的点赞和取消'
BEGIN
  DECLARE rowCount int;
  SELECT COUNT(*) INTO rowCount FROM t_topiclike WHERE t_topic_topic_id=topicId AND t_user_user_id=userId;
  if rowCount=0 THEN
  INSERT INTO t_topiclike VALUES(null,topicId,userId);
  UPDATE t_topic SET topic_like=topic_like+1 WHERE t_topic.topic_id=topicId;
  ELSE
  DELETE FROM t_topiclike WHERE t_topic_topic_id=topicId AND t_user_user_id=userId;
  UPDATE t_topic SET topic_like=topic_like-1 WHERE t_topic.topic_id=topicId;
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_likevideo` (IN `userId` INT, IN `videoId` INT)  NO SQL
BEGIN
  DECLARE rowCount int;
  SELECT COUNT(*) INTO rowCount FROM t_videolike WHERE t_video_video_id=videoId AND t_user_user_id=userId;
  if rowCount=0 THEN
  INSERT INTO t_videolike VALUES(null,videoId,userId);
  UPDATE t_video SET video_likes = video_likes+1 WHERE t_video.video_id=videoId;
  ELSE
  DELETE FROM t_videolike WHERE t_video_video_id=videoId AND t_user_user_id=userId;
  UPDATE t_video SET video_likes = video_likes-1 WHERE t_video.video_id=videoId;
  END IF;
  SELECT t_video.video_likes,t_video.video_comments,t_video.video_collects FROM t_video WHERE t_video.video_id=videoId;
  SELECT t_videolike.* FROM t_videolike WHERE t_videolike.t_video_video_id=videoId AND t_videolike.t_user_user_id=userId;
  
 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_page` ()  NO SQL
BEGIN
 
  SELECT COUNT(*) FROM t_video;
  
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_perCollect` (IN `userId` INT)  NO SQL
BEGIN
  SELECT t_cook.*,t_collectcook.* FROM t_cook,t_user,t_collectcook WHERE t_collectcook.t_user_user_id=t_user.user_id AND t_collectcook.t_cook_cook_id=t_cook.cook_id AND t_user.user_id=userId;
  
  SELECT t_topic.*,t_collecttopic.* FROM t_topic,t_user,t_collecttopic WHERE t_collecttopic.t_user_user_id=t_user.user_id AND t_collecttopic.t_topoc_topic_id=t_topic.topic_id AND t_user.user_id=userId;
  
  SELECT t_video.*,t_videocollect.* FROM t_video,t_user,t_videocollect WHERE t_videocollect.t_user_user_id=t_user.user_id AND t_videocollect.t_video_video_id=t_video.video_id AND t_user.user_id=userId;

  SELECT t_images.* FROM t_images,t_topic WHERE t_images.topic_id=t_topic.topic_id;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_personal` (IN `userID` INT)  NO SQL
BEGIN
SELECT * FROM t_user WHERE user_id=userID;
SELECT t_video.*,user_id FROM t_video,t_user WHERE    t_video.t_user_user_id=t_user.user_id AND user_id=userID;
SELECT t_cook.*,user_id FROM t_cook,t_user WHERE t_user.user_id=t_user_id AND user_id=userID;

SELECT t_topic.*,user_id FROM t_topic,t_user WHERE  t_user.user_id=t_topic.t_user_user_id 
AND user_id=userID;
SELECT t_images.* FROM t_images;

SELECT t_followuser.*,t_user.* from t_followuser,t_user where  t_followuser.followuser_userid=userID and t_followuser.t_user_user_id=t_user.user_id;

SELECT t_cook.*,t_collectcook.* FROM t_cook,t_user,t_collectcook WHERE t_collectcook.t_user_user_id=t_user.user_id AND t_collectcook.t_cook_cook_id=t_cook.cook_id AND t_user.user_id=userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_personalCook` (IN `userID` INT)  NO SQL
BEGIN
SELECT t_cook.*,user_id FROM t_cook,t_user WHERE t_user.user_id=t_user_id AND user_id=userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_personalFocus` (IN `userid` INT)  NO SQL
BEGIN
   SELECT t_followuser.*,t_user.* from t_followuser,t_user where  t_followuser.followuser_userid=userid and t_followuser.t_user_user_id=t_user.user_id;

   SELECT t_followuser.*,t_user.* from t_followuser,t_user where  t_followuser.t_user_user_id=userid and t_followuser.t_user_user_id=t_user.user_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_personalVideo` (IN `userID` INT)  NO SQL
BEGIN
SELECT * FROM t_user WHERE user_id=userID;
SELECT t_video.*,user_id FROM t_video,t_user WHERE    t_video.t_user_user_id=t_user.user_id AND user_id=userID;
SELECT t_cook.*,user_id FROM t_cook,t_user WHERE t_user.user_id=t_user_id AND user_id=userID;

SELECT t_topic.*,user_id FROM t_topic,t_user WHERE  t_user.user_id=t_topic.t_user_user_id 
AND user_id=userID;
SELECT t_images.* FROM t_images;

SELECT t_followuser.*,t_user.* from t_followuser,t_user where  t_followuser.followuser_userid=userID and t_followuser.t_user_user_id=t_user.user_id;

SELECT t_cook.*,t_collectcook.* FROM t_cook,t_user,t_collectcook WHERE t_collectcook.t_user_user_id=t_user.user_id AND t_collectcook.t_cook_cook_id=t_cook.cook_id AND t_user.user_id=userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_public` ()  NO SQL
BEGIN
  DECLARE rowCount int;
  DECLARE i int DEFAULT 1;
  SELECT COUNT(*) INTO rowCount FROM t_cooktype_big;
  SELECT bigtype_name,bigtype_id FROM t_cooktype_big;
  WHILE i<=rowCount DO
    SELECT bigtype_name,smallType_name,bigtype_id,smalltype_id FROM t_cooktype_small,t_cooktype_big WHERE t_cooktype_big.bigtype_id=t_cooktype_small.t_cooktype_big_bigtype_id AND bigtype_id=i;
    SET i=i+1;
  END WHILE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_register` (IN `password` VARCHAR(100), IN `tel` VARCHAR(11))  NO SQL
BEGIN
  DECLARE rowCount int;
  SELECT COUNT(*) INTO rowCount FROM t_user WHERE user_tele=tel;
  if rowCount=0 THEN
    INSERT INTO t_user VALUES(null,null,password,null,null,tel,null,null,null,null,null);
  end if;
  SELECT * from t_user WHERE user_tele=tel;
 end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_topicdetail` (IN `topicid` INT)  NO SQL
BEGIN
  SELECT t_topic.* FROM t_topic WHERE topic_id=topicid; 
  select t_images.* from t_images where t_images.topic_id=topicid;
  select t_user.user_id,t_user.user_name,t_user.user_portart from t_topic,t_user where t_user.user_id=t_topic.t_user_user_id and t_topic.topic_id=topicid;
 SELECT t_commenttopic.* FROM t_topic,t_commenttopic WHERE t_topic.topic_id=t_commenttopic.t_topoc_topic_id AND t_topic.topic_id=topicid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_topiclist` (IN `n` INT)  NO SQL
    COMMENT '帖子列表页面的存储过程'
BEGIN
	SELECT t_topic.*,user_name FROM t_topic,t_user WHERE t_topic.t_user_user_id=t_user.user_id ORDER BY t_topic.topic_date DESC;
  	SELECT * FROM t_images;
   SELECT t_topic.*,user_name FROM t_topic,t_user WHERE t_topic.t_user_user_id=t_user.user_id ORDER BY t_topic.topic_date DESC LIMIT n,15;
  	SELECT * FROM t_images;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_topics` (IN `topicID` INT(20), IN `title` VARCHAR(50), IN `date` VARCHAR(25), IN `content` TEXT, IN `likecount` INT, IN `collectnum` INT, IN `userid` INT)  NO SQL
BEGIN
	INSERT INTO t_topic VALUES(null,title,date,content,likecount,collectnum,userid);
	SELECT * FROM t_topic WHERE topic_id=topicID;
	SELECT t_comment_topic.*,t_user.user_name,t_user.user_id,t_user.user_portart FROM t_comment_topic,t_user WHERE t_comment_topic.t_user_user_id=t_user.user_id and t_comment_topic.t_topic_cook_id=cookid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_userPortart` (IN `userID` INT)  NO SQL
BEGIN
	SELECT user_portart FROM t_user WHERE user_id=userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_videocomment` (IN `content` TEXT, IN `time` DATETIME, IN `userid` INT, IN `videoid` INT)  NO SQL
BEGIN

  INSERT INTO t_videocomment VALUES(null,content,time,userid,videoid);
  UPDATE t_video SET video_comments = video_comments+1 WHERE t_video.video_id=videoid;
 
  select t_videocomment.*,t_user.user_name,t_user.user_portart from t_videocomment,t_user where  t_videocomment.t_user_user_id = t_user.user_id and t_videocomment.t_video_video_id =videoid;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pro_videodetail` (IN `videoid` INT)  NO SQL
BEGIN
 
  
   SELECT t_video.*,t_user.user_portart,t_user.user_name FROM t_video,t_user WHERE video_id=videoid AND t_video.t_user_user_id=t_user.user_id;
  
  SELECT * FROM t_video ORDER BY video_likes DESC LIMIT 4;
  
  SELECT t_videocomment.*,t_user.user_name,t_user.user_portart FROM t_videocomment,t_user  WHERE t_videocomment.t_user_user_id=t_user.user_id AND t_videocomment.t_video_video_id=videoid ORDER BY t_videocomment.videocomment_time DESC;

  
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- 表的结构 `t_collectcook`
--

CREATE TABLE `t_collectcook` (
  `collectcook_id` int(11) NOT NULL,
  `t_user_user_id` int(11) NOT NULL,
  `t_cook_cook_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_collectcook`
--

INSERT INTO `t_collectcook` (`collectcook_id`, `t_user_user_id`, `t_cook_cook_id`) VALUES
(7, 4, 1),
(8, 13, 1),
(47, 12, 1),
(63, 17, 2),
(6, 3, 6),
(68, 13, 6),
(5, 2, 7),
(1, 2, 8),
(2, 4, 13),
(3, 3, 13),
(4, 1, 17),
(57, 17, 22),
(52, 17, 29),
(64, 17, 111);

-- --------------------------------------------------------

--
-- 表的结构 `t_collecttopic`
--

CREATE TABLE `t_collecttopic` (
  `collecttopic_id` int(11) NOT NULL,
  `t_user_user_id` int(11) NOT NULL,
  `t_topoc_topic_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_collecttopic`
--

INSERT INTO `t_collecttopic` (`collecttopic_id`, `t_user_user_id`, `t_topoc_topic_id`) VALUES
(1, 17, 1),
(2, 17, 2),
(3, 2, 3);

-- --------------------------------------------------------

--
-- 表的结构 `t_commenttopic`
--

CREATE TABLE `t_commenttopic` (
  `commenttopic_id` int(11) NOT NULL,
  `commenttopic_context` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `commenttopic_time` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `t_user_user_id` int(11) NOT NULL,
  `t_topoc_topic_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_commenttopic`
--

INSERT INTO `t_commenttopic` (`commenttopic_id`, `commenttopic_context`, `commenttopic_time`, `t_user_user_id`, `t_topoc_topic_id`) VALUES
(1, '问：程序猿最讨厌康熙的哪个儿子？答：胤禩，因为他是八阿哥(bug)。', '2017-01-12 00:00:00', 2, 2),
(2, '问：程序猿最讨厌康熙的哪个儿子？答：胤禩，因为他是八阿哥(bug)。', '2017-01-23 00:00:00', 1, 3),
(3, '问：程序猿最讨厌康熙的哪个儿子？答：胤禩，因为他是八阿哥(bug)。', '2017-01-11 09:38:12', 3, 4),
(4, '问：程序猿最讨厌康熙的哪个儿子？答：胤禩，因为他是八阿哥(bug)。', '2017-01-30 16:25:32', 5, 4),
(44, 'asdf', '2016/01/04', 1, 1),
(45, 'asdf', '2016/01/04', 1, 1),
(46, 'asdf', '2016/01/04', 1, 1),
(47, 'asdf', '2016/01/04', 1, 1),
(48, 'asdf', '2016/01/04', 1, 1),
(49, 'aaaa', 'Wed Jan 11 2017 15:02:45 GMT+0800 (中国标准时间)', 20, 4),
(50, 'aaaa', 'Wed Jan 11 2017 15:04:03 GMT+0800 (中国标准时间)', 20, 4),
(51, '', 'Wed Jan 11 2017 15:04:56 GMT+0800 (中国标准时间)', 20, 4),
(52, 'rrrr', 'Wed Jan 11 2017 15:07:01 GMT+0800 (中国标准时间)', 20, 4),
(53, 'aaa', 'Wed Jan 11 2017 15:08:46 GMT+0800 (中国标准时间)', 20, 4);

-- --------------------------------------------------------

--
-- 表的结构 `t_comment_cook`
--

CREATE TABLE `t_comment_cook` (
  `commentcook_id` int(11) NOT NULL,
  `commentcook_content` text COLLATE utf8_unicode_ci,
  `commentcook_time` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `t_user_user_id` int(11) NOT NULL,
  `t_cook_cook_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_comment_cook`
--

INSERT INTO `t_comment_cook` (`commentcook_id`, `commentcook_content`, `commentcook_time`, `t_user_user_id`, `t_cook_cook_id`) VALUES
(1, 'good', '2016-10-20 14:09:20', 1, 1),
(3, 'good', '2016-10-20 14:09:20', 1, 1),
(38, '踩踩踩踩踩踩踩踩', '2016-12-22 14:45:04', 4, 1),
(39, '滴滴答答地对地导弹', '2016-12-22 14:46:52', 4, 1),
(44, '呵呵呵呵呵呵呵呵', '2016-12-24 14:10:18', 12, 1),
(55, 'ffffffffffffff', '2016-12-28 14:42:14', 12, 1),
(56, 'vvvvv', '2016-12-28 14:43:04', 12, 1),
(57, 'cccccccccccc', '2016-12-28 14:45:27', 12, 1),
(58, 'fffffffffffff', '2016-12-29 18:33:20', 4, 29),
(59, 'ssssssssssss', '2016-12-30 14:49:00', 17, 2),
(60, 'rrr', '2016-12-30 15:43:14', 17, 29),
(61, 'uuuu', '2016-12-30 15:44:40', 17, 10),
(62, '5555555555555', '2016-12-30 16:42:07', 17, 2),
(63, 'trrrrrrrrrr', '2017-01-03 11:16:44', 17, 4),
(64, 'sssssssssssssssss', '2017-01-03 13:44:02', 12, 32),
(65, '水水水水水', '2017-01-03 13:51:04', 12, 5),
(66, '烦烦烦方法', '2017-01-03 13:52:36', 12, 32),
(67, '踩踩踩踩踩', '2017-01-03 13:54:50', 12, 32),
(68, '', '2017-01-04 15:50:00', 17, 10),
(69, '爆炸肉', '2017-01-04 15:50:09', 17, 10),
(70, '这个不知道怎么说，组长味嘎嘣脆', '2017-01-04 15:51:12', 17, 10),
(71, '阿斯顿发生', '2017-01-07 11:09:18', 17, 1),
(72, '阿斯顿发生', '2017-01-07 11:09:20', 17, 1),
(73, 'rrrrrrrrrrrrrr', '2017-01-08 15:22:40', 17, 2),
(74, '5555', '2017-01-08 15:35:32', 17, 111),
(75, 'nice', '2017-01-10 16:09:17', 13, 22),
(76, 'nice', '2017-01-10 16:46:26', 13, 8),
(77, 'nice', '2017-01-10 16:49:09', 13, 28),
(78, 'nice', '2017-01-10 18:56:52', 13, 7),
(79, 'ddddddd', '2017-02-13 13:11:54', 13, 10);

-- --------------------------------------------------------

--
-- 表的结构 `t_cook`
--

CREATE TABLE `t_cook` (
  `cook_id` int(11) NOT NULL,
  `cook_name` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cook_difficulty` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cook_content` text COLLATE utf8_unicode_ci,
  `cook_collects` int(11) DEFAULT '0',
  `cook_likes` int(11) DEFAULT '0',
  `cook_images` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cook_time` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cook_date` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `t_cooktype_small_smalltype_id` int(11) NOT NULL,
  `t_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_cook`
--

INSERT INTO `t_cook` (`cook_id`, `cook_name`, `cook_difficulty`, `cook_content`, `cook_collects`, `cook_likes`, `cook_images`, `cook_time`, `cook_date`, `t_cooktype_small_smalltype_id`, `t_user_id`) VALUES
(1, '蒜茄子', '初级入门', '这个蒜茄子做法很简单，确特别好吃，得到妈妈姐姐的好评', 3, 4, 'sxz0.jpg', '11分钟', '2016-12-20', 1, 1),
(2, '小抄木耳', '中级', '黑木耳是一种营养丰富，可素可荤，同时具有养血美容，防治缺铁性贫血等药用功效的食用菌。成不规则耳形，口感细嫩，风味特殊，质地柔软，味道鲜美。感谢豆果和男厨提供的这次木耳试用机会，这次的东北秋木耳没有根蒂，泡发洗净后可以直接用来进行烹饪，木耳肥厚，吃起来口感相当好。因为木耳中的胶质可把残留在人体消化系统内的灰尘、杂质吸附集中起来排出体外，从而一定程度上能起到防霾作用。洋葱可以软化血管，搭配青红椒，不但色泽好看，也更加美味了。', 10223, 8902, 'mexs0.jpg', '10-30分钟', '2016-12-08', 1, 2),
(3, '大酱烧鲈鱼', '初级入门', '估计是两个月前做的菜了，大酱是网购的，败了很久了，一直没有用，合着吧，买都买了，怎么着也得想办法吃掉。正好家里有鲈鱼，想着来点创新，用大酱来煮鱼，顺便加点老豆腐，因这家里人都不太喜欢豆制品，作为做菜的人，总得想办法，让家人营养均衡吸收。\n煎鱼，煎豆腐，再合着一起用大酱汤煮，味道非常的鲜美，不信的话，你也试试吧！', 66, 44, 'sly0.jpg', '30分钟', '2016-12-13', 1, 4),
(4, '肉末炒平菇', '初级入门', '瘦肉剁成肉末炒着吃特别香的哦，味道好美味，加些大蒜叶更是香极了哦，平菇也是嫩嫩的水水的，加上肉末更是美味哦', 16, 3, 'rm.jpeg', '15分钟', '2016-12-12', 1, 3),
(5, '木须肉', '初级入门', '木须肉又叫木樨肉，是典型的北方菜，（北京话称”鸡蛋”为“木犀”音，受前面“木”音的影响而变成了[xu]音，这样“木犀”也就被写成了“木须”，而鸡蛋、黄瓜炒肉也就变成了“木须肉”。', 35, 3, 'mxr0.jpg', '15分钟', '2016-12-11', 1, 1),
(6, '冬笋肉丝', '中级掌勺', '每每隆冬，家里总少不了冬笋菜，腌笃鲜、冬笋肉丝、雪菜笋丁包…冬笋肉丝最方便，也最能体现冬笋的鲜味。', 46, 3, 'dsrs0.jpg', '10分钟', '2016-12-22', 1, 2),
(7, '红烧肉', '初级入门', '在我们父母亲那一代而言，吃饭可能没有我们那么多时间去讲究，虽然我家美女在我们那一带烧菜已经很有名气了。 其实可能我那么喜欢折腾其实我家美女有绝对的关系吧，唯一不同的是我喜欢折腾一些新鲜的玩意儿，所以我们会经常交叉着烧菜给彼此吃，这种感觉其实真的挺好，传统的湖北菜和我的创意菜。。 今天这道菜之所以会做是因为前几天做了可乐鸡翅，家里人都很喜欢，所以果断又做了家里人都爱吃的红烧肉，这种方法做出来的红烧肉香浓的肉味里带着甜甜的味道，让人回味无穷哦。。。', 81, 1, 'hsr.jpg', '1小时', '2016-12-30', 1, 3),
(8, '油闷大虾', '初级入门', '作为一个土生土长的青岛人，海鲜是最常吃的食材。最常的做法就是水煮吃原味，今天改改口味吃个油闷大虾～', 81, 2100, 'ymdx0.jpg', '15分钟', '2016-12-15', 1, 4),
(9, '酸菜鱼', '初级水平', '鱼片鲜嫩爽滑，汤酸香鲜美~~开胃极了', 22, 1, 'jc9.jpg', '15分钟', '2016-12-20', 1, 2),
(10, '蜜汁叉烧肉', '初级入门', '这是一道超级美味的叉烧肉，好吃得根本停不下来。想做出满分蜜汁叉烧肉窍门通通在这里。从选料、腌制、烤制都有诀窍哟！赶快来学，提前预热年夜饭菜单！我只能说，饭店的叉烧肉都弱爆了~', 4566, 223, 'csr0.jpg', '60分钟', '2016-11-08', 1, 1),
(11, '猪头冻', '初级入门', '二月二，龙抬头，家家户户吃猪头。这是我们当地的风俗。我以往都是买猪头肉吃，头一次处理这么大的一个猪脑袋（多亏是半个猪头），不过，自己做的真实在呀，做出了好几盘，吃好几顿，哈哈，喜欢的看看：', 80, 645, 'nj1.jpg', '40分钟', '2016-10-12', 2, 4),
(12, '小鸡炖蘑菇', '中级掌勺', '小鸡炖蘑菇是属于东北菜，所取用的是野生榛蘑，在南方来说榛蘑比较难找，但又想尝尝，为有用普通的蘑菇代替。口味肯定是有区别的，尽管材料不一样，但同样的美味。', 785, 651, 'nj2.jpg', '30分钟', '2016-09-20', 2, 1),
(13, '海鲜面疙瘩', '初级入门', NULL, 55, 49, 'nj3.jpg', '10分钟', '2016-12-27', 2, 2),
(14, '农家土鸡', '中级掌勺', NULL, 16, 10, 'nj4.jpg', '15分钟', '2016-09-20', 2, 1),
(15, '辣子鸡', '中级掌勺', NULL, 45, 226, 'nj5.jpg', '20分钟', '2016-12-13', 2, 4),
(16, '韭菜包蛋', '初级入门', NULL, 11, 23, 'nj6.jpg', '10分钟', '2016-12-12', 2, 3),
(17, '农家芋丝', '初级入门', '小鱼干是经过熏制的小鱼干，非常香哦！而芋头性平，味甘、辛，有小毒。能益脾胃，调中气，化痰散结。可治少食乏力、痕疡结核、久痢便血、痈毒等病症，芋头所含的矿物质中，氟的含量较高，具有洁齿防龋、保护牙齿的作用。芋头中含有多种微量元素，能增强人体的免疫功能，可作为防治癌瘤的常用药膳主食。在癌症手术或术后放疗、化疗及其康复的过程中，有较好的辅助作用。', 458, 781, 'nj7.jpg', '5分钟', '2016-12-09', 2, 3),
(18, '炒农家肉', '初级入门', NULL, 45, 33, 'nj8.jpg', '10分钟', '2016-10-18', 2, 4),
(19, '农家烧黄鳝', '中级掌勺', NULL, 123, 457, 'nj9.jpg', '10分钟', '2016-08-22', 2, 2),
(20, '凉拌双丝', '初级入门', '冬季到了，有一句话这么说的：冬吃萝卜夏吃姜。那家里有白萝卜，白萝卜又是温补性的，红萝卜呢含有丰富的维生素，就想着凉拌他俩', 544, 578, 'kw1.jpg', '5分钟', '2016-12-14', 3, 1),
(21, '水果土豆泥沙拉', '初级水平', NULL, 445, 11, 'kw2.jpg', '45分钟', '2016-12-12', 3, 4),
(22, '凉拌海蜇', '初级入门', '海蜇含丰富的蛋白质，矿物质，维生素等，具有较高的营养价值。凉拌海蜇是我最喜欢的一道菜，我家的好先生也会做给我吃噢。这道菜用到了纯味鲜酱油，这个酱油可直接用于点蘸，佐餐，凉拌及各类烹调。可令菜肴更鲜美清甜。', 1575, 1224, 'lbhz0.jpg', '90分钟', '2016-12-14', 3, 1),
(23, '脆皮泡椒黄瓜', '初级水平', NULL, 45, 13, 'kw4.jpg', '30分钟', '2016-12-22', 3, 3),
(24, '蔬菜沙拉', '初级入门', NULL, 12, 14, 'kw5.jpg', '10分钟', '2016-12-20', 3, 2),
(25, '鱼鳞冻', '初中水平', NULL, 234, 45, 'kw6.jpg', '10分钟', '2016-11-08', 3, 2),
(26, '拌紫甘蓝', '初中水平', '经常关注多妈家的早餐的小伙伴，肯定能发现，多妈很喜欢吃紫甘蓝，时不时的就会拌一盘，早餐上那一盘紫色，也往往是比较抢眼的一份。夏天不爱动明火，凉拌菜无疑是最好的选择，洗一洗，切一切，很轻松就能上桌了。而紫甘蓝不仅颜色好看，夏天卖的也很便宜，一颗紫甘蓝两块钱，可以拌好几顿，超划算。而紫甘蓝的营养价值也不差啊', 507, 44, 'kw7.jpg', '10分钟', '2016-12-11', 3, 1),
(27, '尖椒拌猪耳朵', '初级入门', NULL, 445, 11, 'kw8.jpg', '10分钟', '2016-12-12', 3, 1),
(28, '皮蛋豆腐', '初中水平', '春节家宴是家家不可少的，我为家人制定了一桌春节家宴，有鸡有鱼，大吉大利、年年有余，有荤有素，吃出健康、吃出快乐！', 487, 415, 'pddf0.jpg', '20分钟', '2016-12-13', 3, 1),
(29, '麻婆豆腐', '初级入门', '豆腐是老幼皆宜的营养美食，豆腐的做法很多：或煮、或炖、或煎、或炸，如果论下饭的话，麻婆豆腐则当仁不让。软嫩的豆腐，搭配牛肉碎，既有植物蛋白又有动物蛋白，口感上随自家口味调节，一些些麻一些些辣，最是下饭。', 1112, 2222, 'mpdf0.jpg', '15分钟', '2016-12-06', 4, 4),
(30, '广式白切鸡', '中级掌勺', NULL, 333, 222, 'yc1.jpg', '15分钟', '2016-12-01', 5, 2),
(31, '热姜汁藕片', '新手尝试', NULL, 11, 22, 'xc1.jpg', '10分钟', '2016-12-14', 6, 3),
(32, '无锡排骨', '中级掌勺', '这道菜是中国典型的排骨菜肴之一，主要使用番茄酱和糖来调味，烹饪过程中让两种食材的味道融合，形成酸甜醇稠的味汁，再通过“自动收汁”程序收入肉中，在骨肉的鲜香中增添一种黏稠的酸甜香浓，让人欲罢不能。', 245, 3548, 'wxpg0.jpg', '1小时', '2016-12-23', 7, 1),
(33, '可可蛋糕卷', '初级入门', '一杯清茶，几个蛋卷，又是一个美妙的午后........巧克力的浓香诱人口鼻，面对如此美味，怎可残忍拒绝？', 690, 453, 'kkdg0.jpg', '30分钟', '2016-12-07', 8, 2),
(34, '绣球小面包', '中级掌勺', NULL, 456, 2435, 'mb1.jpg', '15分钟', '2016-12-13', 9, 4),
(35, '松鼠饼干', '中级掌勺', NULL, 34, 24, 'cookies1.jpg', '30分钟', '2016-12-18', 10, 3),
(36, '红焖猪脚黄豆', '中级掌勺', NULL, 456, 234, 'yf1.jpg', '30分钟', '2016-12-14', 11, 3),
(37, '杂蔬丸子', '初级入门', NULL, 345, 234, 'child1.jpg', '10分钟', '2016-12-20', 12, 1),
(38, '红烧日本豆腐', '初级入门', NULL, 344, 465, 'elder1.jpg', '10分钟', '2016-12-02', 13, 4),
(42, '荷兰豆炒腊肠', '切墩(初级)', '记得最早的时候，我们住一起，我过年时候从江苏带了一些我家灌的香肠，送了她一些。从那个时候，她就爱上了香肠，哈哈~每次见面都会提到这些往事，一晃已经十几年了。现在她每年冬天都会去灌好多香肠，但是味道和我家的差好多', 33, 22, 'clc0.jpg', '10分左右', '2014-05-15', 12, 2),
(43, 'b', '', NULL, 0, 0, '', '', NULL, 2, 3),
(44, 'a', '初级', '', 0, 0, '', '10分钟左右', NULL, 4, 2),
(49, 'xi', '切墩(初级)', '', 0, 0, NULL, '10分钟左右', '2016-12-27', 6, 4),
(50, 'xi', '切墩(初级)', '', 0, 0, NULL, '10分钟左右', '2016-12-27', 6, 4),
(51, 'xi', '切墩(初级)', '', 0, 0, NULL, '10分钟左右', '2016-12-27', 6, 4),
(52, 'mm', '配菜(中级)', '', 0, 0, '0.7986358044240982.jpeg', '10-30分钟', '2016-12-27 16:19:13.904', 5, 4),
(54, 'aaaa', '切墩(初级)', '', 0, 0, '0.24882187050532845.jpeg', '10分钟左右', '2016-12-27 16:24:10.048', 5, 4),
(55, 'aaa', '配菜(中级)', '', 0, 0, '0.5742771533139226.jpeg', '10分钟左右', '2016-12-27 16:59:19.103', 5, 4),
(56, '444', '切墩(初级)', '', 0, 0, '0.08082398759594978.jpeg', '10分钟左右', '2016-12-27 17:00:43.578', 9, 4),
(57, 'lll', '切墩(初级)', 'asssssssssss', 0, 0, '0.2720995988768218.jpeg', '10-30分钟', '2016-12-27 18:02:45.094', 6, 4),
(58, 'eee', '烹饪难度', '', 0, 0, '0.6275979455901792.jpeg', '烹饪时间', '2016-12-27 18:38:23.925', 5, 4),
(61, '地地道道的', '切墩(初级)', '哇哇哇哇哇哇哇', 0, 0, '0.8526951634323536.jpeg', '10分钟左右', '2016-12-27 18:45:17.199', 10, 4),
(63, 'ttttt', '切墩(初级)', '666666666', 0, 0, '0.08033677669146178.jpeg', '10分钟左右', '2016-12-27 18:54:14.106', 5, 1),
(69, 'yyyyyyyy', '切墩(初级)', '', 0, 0, '0.2829980806957577.jpeg', '10分钟左右', '2016-12-27 19:21:54.834', 1, 1),
(70, 'gg', '烹饪难度', '', 0, 0, '0.4557229762844217.jpeg', '烹饪时间', '2016-12-27 19:27:27.117', 1, 1),
(71, 'nnn', '切墩(初级)', '', 0, 0, '0.5756707595053698.jpeg', '10分钟左右', '2016-12-27 19:32:33.278', 1, 1),
(72, 'ppp', '切墩(初级)', '', 0, 0, '0.15347203789323904.jpeg', '10-30分钟', '2016-12-27 19:35:54.645', 1, 1),
(73, '', '烹饪难度', '', 0, 0, '0.8131902665248096.jpeg', '烹饪时间', '2016-12-27 19:38:10.056', 1, 1),
(74, '', '烹饪难度', '', 0, 0, '0.5011917400048238.jpeg', '烹饪时间', '2016-12-27 19:47:42.736', 1, 1),
(75, '', '烹饪难度', '', 0, 0, '0.5513125763811204.jpeg', '烹饪时间', '2016-12-27 19:55:52.502', 1, 1),
(76, '', '烹饪难度', '', 0, 0, '0.9332273188810731.jpeg', '烹饪时间', '2016-12-27 19:58:14.276', 1, 1),
(77, '', '烹饪难度', '', 0, 0, '0.9434972814091664.jpeg', '烹饪时间', '2016-12-27 20:04:03.367', 1, 1),
(78, '', '烹饪难度', '', 0, 0, '0.8606821160984093.jpeg', '烹饪时间', '2016-12-27 20:11:05.927', 1, 1),
(79, '', '烹饪难度', '', 0, 0, '0.12261770262013405.jpeg', '烹饪时间', '2016-12-27 20:14:08.284', 1, 1),
(80, '', '烹饪难度', '', 0, 0, '0.8042071281799621.jpeg', '烹饪时间', '2016-12-27 20:15:36.074', 1, 1),
(81, '', '烹饪难度', '', 0, 0, '0.5532178790315478.jpeg', '烹饪时间', '2016-12-27 20:16:53.796', 1, 1),
(82, '', '烹饪难度', '', 0, 0, '0.6460875950327933.jpeg', '烹饪时间', '2016-12-27 20:25:13.993', 1, 1),
(83, '', '烹饪难度', '', 0, 0, '0.6720763845054498.jpeg', '烹饪时间', '2016-12-27 20:26:03.786', 1, 1),
(84, '', '烹饪难度', '', 0, 0, '0.3576391488134236.jpeg', '烹饪时间', '2016-12-27 20:30:00.304', 1, 1),
(85, '555555', '烹饪难度', '', 0, 0, '0.5009157326767499.jpeg', '烹饪时间', '2016-12-29 15:46:00.263', 10, 4),
(86, 'ttttttttt', '烹饪难度', '', 0, 0, '0.6435413385064837.jpeg', '烹饪时间', '2016-12-29 15:46:26.684', 1, 4),
(87, '66666666', '烹饪难度', '', 0, 0, '0.36522741059128916.jpeg', '烹饪时间', '2016-12-29 15:46:43.976', 1, 4),
(88, '5555555', '烹饪难度', '', 0, 0, '0.03673447118261208.jpeg', '烹饪时间', '2016-12-29 15:48:05.751', 1, 4),
(89, 'ffffffffff', '烹饪难度', '', 0, 0, '0.9882352990135232.jpeg', '烹饪时间', '2016-12-29 15:48:52.097', 1, 4),
(90, '', '烹饪难度', '', 0, 0, '0.032898885790888066.jpeg', '烹饪时间', '2016-12-29 15:49:33.549', 1, 4),
(91, 'rrrrrrrr', '烹饪难度', '', 0, 0, '0.04310790249804919.jpeg', '烹饪时间', '2016-12-29 16:20:25.073', 1, 4),
(92, 'tttttt', '烹饪难度', '', 0, 0, '0.7194897166976213.jpeg', '烹饪时间', '2016-12-29 16:46:09.535', 1, 4),
(93, '', '烹饪难度', '', 0, 0, '0.6159412574365077.jpeg', '烹饪时间', '2016-12-29 19:59:01.386', 1, 12),
(95, '玉米花', '烹饪难度', '', 0, 0, '0.7543959974304508.jpeg', '烹饪时间', '2017-01-11 18:41:09', 1, 17),
(97, '香辣虾', '切墩(初级)', '', 0, 0, '0.023169367997496026.jpeg', '10分钟左右', '2017-01-11 18:30:08', 1, 17),
(100, '干锅包菜', '烹饪难度', '', 0, 0, '0.3393430411574032.jpeg', '烹饪时间', '2017-01-09 16:54:25', 1, 17),
(101, '西红柿鸡蛋', '烹饪难度', '', 0, 0, '0.7169171691542384.jpeg', '烹饪时间', '2017-01-04 21:20:49.457', 1, 17),
(103, '6666666', '烹饪难度', '', 0, 0, '0.348876465377455.jpeg', '烹饪时间', '2017-01-05 16:11:37.916', 1, 17),
(105, '西红柿', '烹饪难度', '', 0, 0, '0.7741374499016445.jpeg', '烹饪时间', '2017-01-05 16:12:38.203', 1, 17),
(106, '天天天天天', '烹饪难度', '', 0, 0, '0.46377528187163297.jpeg', '烹饪时间', '2017-01-05 16:13:39.753', 1, 17),
(107, 'wwww', '配菜(中级)', '', 0, 0, '0.29961549307488733.jpeg', '10-30分钟', 'Sat Jan 07 2017', 1, 17),
(108, '', '烹饪难度', '', 0, 0, '0.5806438005855241.jpeg', '烹饪时间', '2017-01-07 23:42:53', 1, 17),
(111, '666666666666666666666666', '烹饪难度', '', 1, 1, '0.6870994547144083.jpeg', '烹饪时间', '2017-01-07 23:44:39', 1, 17),
(112, '', '烹饪难度', '', 0, 0, '0.3160123245934292.jpeg', '烹饪时间', '2017-01-07 23:45:51', 1, 17),
(113, '', '烹饪难度', '', 0, 0, '0.5017890406318852.jpeg', '烹饪时间', '2017-01-08 15:44:10', 1, 17),
(114, '', '烹饪难度', '', 0, 0, '0.6638556497383039.jpeg', '烹饪时间', '2017-01-08 15:47:38', 1, 17),
(115, '', '烹饪难度', '', 0, 0, '0.8392860495507206.jpeg', '烹饪时间', '2017-01-08 15:48:13', 1, 17),
(116, '', '切墩(初级)', '', 0, 0, '0.47644234398707463.jpeg', '10分钟左右', '2017-01-08 15:49:09', 1, 17),
(117, '', '烹饪难度', '', 0, 0, '0.9526340120260846.jpeg', '烹饪时间', '2017-01-08 15:50:06', 1, 17),
(118, '', '烹饪难度', '', 0, 0, '0.511453794899787.jpeg', '烹饪时间', '2017-01-08 17:51:55', 1, 17),
(119, '', '烹饪难度', '', 0, 0, '0.40880443874697514.jpeg', '烹饪时间', '2017-01-08 17:53:28', 1, 17),
(120, '', '烹饪难度', '', 0, 0, '0.7651906350814113.jpeg', '烹饪时间', '2017-01-08 18:06:59', 1, 17),
(121, '', '烹饪难度', '', 0, 0, '0.5695971463352076.jpeg', '烹饪时间', '2017-01-08 18:07:40', 1, 17),
(122, '', '烹饪难度', '', 0, 0, '0.8675158760090729.jpeg', '烹饪时间', '2017-01-08 18:08:34', 1, 17),
(123, '', '烹饪难度', '', 0, 0, '0.8709756187940205.jpeg', '烹饪时间', '2017-01-08 18:13:17', 1, 17),
(125, '', '烹饪难度', '', 0, 0, '0.6225469243314228.jpeg', '烹饪时间', '2017-01-08 18:22:52', 1, 17),
(126, '', '烹饪难度', '', 0, 0, NULL, '烹饪时间', '2017-01-08 18:23:32', 1, 17),
(127, '', '烹饪难度', '', 0, 0, NULL, '烹饪时间', '2017-01-08 18:38:32', 1, 17),
(128, '', '烹饪难度', '', 0, 0, NULL, '烹饪时间', '2017-01-08 18:39:21', 1, 17),
(129, '', '烹饪难度', '', 0, 0, NULL, '烹饪时间', '2017-01-08 18:42:00', 1, 17),
(130, '', '烹饪难度', '', 0, 0, NULL, '烹饪时间', '2017-01-08 18:42:27', 1, 17),
(131, '', '烹饪难度', '', 0, 0, '0.7315759550721523.jpeg', '烹饪时间', '2017-01-08 18:42:37', 1, 17),
(132, '', '烹饪难度', '', 0, 0, '0.47443664420592424.jpeg', '烹饪时间', '2017-01-08 18:43:12', 1, 17),
(133, '', '烹饪难度', '', 0, 0, NULL, '烹饪时间', '2017-01-08 18:44:17', 1, 17),
(135, '', '烹饪难度', '', 0, 0, NULL, '烹饪时间', '2017-01-08 18:45:53', 1, 17),
(136, '', '烹饪难度', '', 0, 0, '0.35317508835304.jpeg', '烹饪时间', '2017-01-08 18:46:39', 1, 17),
(137, 'sss', '烹饪难度', '', 0, 0, '0.908257722968445.jpeg', '烹饪时间', '2017-01-08 18:46:59', 1, 17),
(138, '', '烹饪难度', '', 0, 0, '0.6321344822754884.jpeg', '烹饪时间', '2017-01-08 18:48:35', 1, 17),
(139, '4444', '烹饪难度', '', 0, 0, '0.08705688012090107.jpeg', '烹饪时间', '2017-01-09 11:18:22', 1, 17),
(140, '三鲜生煎包', '切墩(初级)', '', 0, 0, '0.31484252106384125.jpeg', '30-60分钟', '2017-01-11 13:46:20', 1, 13),
(141, 'aaa', '烹饪难度', '', 0, 0, '0.584403953412798.jpeg', '烹饪时间', '2017-01-11 14:31:39', 1, 17);

-- --------------------------------------------------------

--
-- 表的结构 `t_cooktype_big`
--

CREATE TABLE `t_cooktype_big` (
  `bigtype_id` int(11) NOT NULL,
  `bigtype_name` varchar(20) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_cooktype_big`
--

INSERT INTO `t_cooktype_big` (`bigtype_id`, `bigtype_name`) VALUES
(1, '菜式'),
(2, '菜系'),
(3, '烘焙'),
(4, '人群');

-- --------------------------------------------------------

--
-- 表的结构 `t_cooktype_small`
--

CREATE TABLE `t_cooktype_small` (
  `smalltype_id` int(11) NOT NULL,
  `smallType_name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `t_cooktype_big_bigtype_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_cooktype_small`
--

INSERT INTO `t_cooktype_small` (`smalltype_id`, `smallType_name`, `t_cooktype_big_bigtype_id`) VALUES
(1, '家常菜', 1),
(2, '农家菜', 1),
(3, '开胃菜', 1),
(4, '川菜', 2),
(5, '粤菜', 2),
(6, '湘菜', 2),
(7, '苏菜', 2),
(8, '蛋糕', 3),
(9, '面包', 3),
(10, '饼干', 3),
(11, '孕妇', 4),
(12, '儿童', 4),
(13, '老人', 4);

-- --------------------------------------------------------

--
-- 表的结构 `t_followuser`
--

CREATE TABLE `t_followuser` (
  `followuser_id` int(11) NOT NULL,
  `followuser_userid` int(11) NOT NULL COMMENT '关注人',
  `t_user_user_id` int(11) NOT NULL COMMENT '被关注人'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_followuser`
--

INSERT INTO `t_followuser` (`followuser_id`, `followuser_userid`, `t_user_user_id`) VALUES
(1, 1, 2),
(2, 3, 2),
(25, 16, 3),
(26, 17, 4),
(31, 12, 1),
(51, 4, 17),
(73, 13, 2),
(74, 13, 17),
(77, 13, 9),
(78, 17, 1),
(81, 13, 3);

-- --------------------------------------------------------

--
-- 表的结构 `t_images`
--

CREATE TABLE `t_images` (
  `img_id` int(11) NOT NULL,
  `img` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_images`
--

INSERT INTO `t_images` (`img_id`, `img`, `user_id`, `topic_id`) VALUES
(1, 'topic1.jpg', 4, 1),
(2, 'topic2.jpg', 4, 1),
(3, 'topic3.jpg', 4, 1),
(4, 'topic4.jpg', 14, 2),
(5, 'topic5.jpg', 14, 2),
(6, 'topic6.jpg', 14, 2),
(7, 'topic7.jpg', 17, 3),
(8, 'topic8.jpg', 17, 3),
(9, 'topic9.jpg', 17, 3),
(10, 'topic4.jpg', 12, 4),
(11, 'topic3.jpg', 12, 4),
(12, 'topic8.jpg', 12, 4),
(13, 'topic4.jpg', 14, 6),
(14, 'topic7.jpg', 12, 8),
(15, 'topic9.jpg', 9, 9),
(17, 'topic1.jpg', 14, 5);

-- --------------------------------------------------------

--
-- 表的结构 `t_likecook`
--

CREATE TABLE `t_likecook` (
  `likecook_id` int(11) NOT NULL,
  `t_cook_cook_id` int(11) NOT NULL,
  `t_user_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_likecook`
--

INSERT INTO `t_likecook` (`likecook_id`, `t_cook_cook_id`, `t_user_user_id`) VALUES
(3, 2, 1),
(4, 1, 1),
(6, 1, 4),
(7, 1, 13),
(43, 1, 12),
(59, 10, 17),
(65, 32, 12),
(66, 7, 12),
(68, 22, 17),
(72, 2, 17),
(73, 111, 17),
(77, 32, 13),
(78, 6, 13),
(80, 10, 13);

-- --------------------------------------------------------

--
-- 表的结构 `t_material`
--

CREATE TABLE `t_material` (
  `material_id` int(11) NOT NULL,
  `material_name` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `material_num` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `t_cook_cook_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_material`
--

INSERT INTO `t_material` (`material_id`, `material_name`, `material_num`, `t_cook_cook_id`) VALUES
(2, '长茄子', '2根', 1),
(3, '茄子', '1个', 43),
(4, '西红柿', '2个', 37),
(6, '五花肉', '250g', 44),
(21, '55', '1', 63),
(22, 'ttt', '5', 63),
(23, '555', '4', 63),
(24, 'm', '2', 69),
(25, 'j', '1', 69),
(26, 'b', '3', 69),
(115, '肉末', '100克', 4),
(116, '平菇', '300克', 4),
(117, '五花肉', '800g', 7),
(118, '可乐', '800g', 7),
(119, '大蒜', '5粒', 1),
(120, '尖椒', '2根', 1),
(295, '肉馅', '200克', 140),
(296, '冬笋', '1小块', 140),
(297, '面粉', '200克', 140),
(298, '香菇', '6-8朵', 140),
(299, '梅头肉（去骨肩胛骨位置的猪肉）', '700克', 10),
(300, '海蜇', '250克	', 22),
(301, '紫甘蓝', '适量', 22),
(302, '黄瓜', '半根', 22),
(303, '熟芝麻', '适量', 22),
(304, '大虾', '适量', 8),
(305, '腩排（小排）', '12块	', 32),
(306, '青江菜', '300g', 32),
(307, '葱', '4根', 32),
(308, '姜', '30g', 32),
(309, '低粉', '80g', 33),
(310, '鸡蛋', '5个', 33),
(311, '牛奶', '60g', 33),
(312, '可可粉', '10g', 33),
(313, '玉米油', '45g', 33),
(314, '嫩豆腐', '一块', 28),
(315, '皮蛋（松花蛋）', '一枚', 28),
(316, '新鲜鲈鱼', '400g', 3),
(317, '老豆腐', '300g', 3),
(318, '猪肉', '140g', 5),
(319, '鸡蛋', '十来朵', 5),
(320, '木耳', '2个', 5),
(321, '黄瓜', '半根', 5),
(322, '冬笋', '800g', 6),
(323, '前臀尖', '200g', 6),
(324, '嫩豆腐', '300g', 29),
(325, '牛肉碎', '50g', 29),
(326, '郫县豆瓣酱', '一大匙', 29),
(327, '花椒', '适量', 29),
(328, '干红辣椒', '适量', 29),
(329, '', '', 141),
(330, '', '', 141),
(331, '', '', 141),
(332, '', '', 141),
(333, '荷兰豆', '100克', 42),
(334, '香肠', '2根', 42),
(335, '青尖椒', '1根', 42),
(336, '红尖椒', '1根', 42);

-- --------------------------------------------------------

--
-- 表的结构 `t_step`
--

CREATE TABLE `t_step` (
  `step_id` int(11) NOT NULL,
  `step_num` int(11) DEFAULT NULL,
  `step_img` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `step_content` text COLLATE utf8_unicode_ci,
  `t_cook_cook_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_step`
--

INSERT INTO `t_step` (`step_id`, `step_num`, `step_img`, `step_content`, `t_cook_cook_id`) VALUES
(4, NULL, '0.9622725871861637.jpeg', NULL, 49),
(5, NULL, '0.36468956725048907.jpeg', NULL, 50),
(6, NULL, '0.9373863299170824.jpeg', NULL, 51),
(7, NULL, '0.6722681370449919.jpeg', NULL, 52),
(8, NULL, '0.8377017688053114.jpeg', NULL, 52),
(9, NULL, '0.22994415402228152.jpeg', NULL, 52),
(10, NULL, '0.8617444605271354.jpeg', NULL, 54),
(11, NULL, '0.768212852787074.png', NULL, 54),
(12, NULL, '0.5781531321688851.jpeg', NULL, 54),
(13, NULL, '0.23456783330477649.jpeg', NULL, 56),
(14, NULL, '0.8534995784725232.jpeg', NULL, 56),
(15, NULL, '0.7542588725321961.jpeg', NULL, 56),
(16, NULL, '0.07185703601051241.jpeg', NULL, 57),
(17, NULL, '0.8290712849256852.jpeg', NULL, 57),
(18, NULL, '0.3685393171557263.jpeg', NULL, 57),
(19, NULL, '0.7095557876163838.jpeg', NULL, 58),
(20, NULL, '0.5327346848402525.jpeg', NULL, 58),
(21, NULL, '0.466840382153741.jpeg', NULL, 58),
(22, NULL, '0.550459661341733.jpeg', NULL, 61),
(23, NULL, '0.09265418803851522.jpeg', NULL, 61),
(24, NULL, '0.1918475240545907.jpeg', NULL, 61),
(25, 3, '0.29988531291845466.jpeg', '55555555', 63),
(26, 3, '0.2888027675413132.jpeg', '55555555', 63),
(27, 3, '0.30607879404620153.jpeg', '55555555', 63),
(28, 3, '0.07348904278379909.jpeg', '222222', 69),
(29, 3, '0.1515071057030466.jpeg', '222222', 69),
(30, 3, '0.047157064529184334.jpeg', '222222', 69),
(31, 3, '0.3112460299057789.jpeg', '3333333', 71),
(32, 3, '0.6867313157338117.jpeg', '3333333', 71),
(33, 3, '0.9417216810857454.jpeg', '3333333', 71),
(34, 3, '0.7214809005808844.jpeg', '3333333', 72),
(35, 3, '0.6817859623219835.jpeg', '3333333', 72),
(36, 3, '0.42918098656584847.jpeg', '3333333', 72),
(37, 2, NULL, '2222222', 74),
(38, 1, NULL, '11111111111', 74),
(39, 3, NULL, '3333333', 74),
(40, 3, '0.8702244603501379.jpeg', '6666666666', 75),
(41, 3, '0.5491716703012028.jpeg', '6666666666', 75),
(42, 3, '0.5421590528356752.jpeg', '6666666666', 75),
(43, 3, '0.4164058608625023.jpeg', '666666666', 76),
(44, 3, '0.8796042247593647.jpeg', '666666666', 76),
(45, 3, '0.25865402530965764.jpeg', '666666666', 76),
(46, 3, '0.21291903381675614.jpeg', '5', 77),
(47, 3, '0.7151574321253849.jpeg', '5', 77),
(48, 3, '0.8567196117548515.jpeg', '5', 77),
(49, 3, '0.86615950744274.jpeg', '222', 78),
(50, 3, '0.28141062651916293.jpeg', '222', 78),
(51, 3, '0.5627131517197321.jpeg', '222', 78),
(52, 3, '0.39124428295997293.jpeg', '33', 79),
(53, 3, '0.5946820921416498.jpeg', '33', 79),
(54, 3, '0.9879203536475474.jpeg', '33', 79),
(55, 3, '0.19627979756785474.jpeg', '3', 81),
(56, 3, '0.08741063035683094.jpeg', '3', 81),
(57, 3, '0.7699749161697991.jpeg', '3', 81),
(58, 3, '0.569647547682435.jpeg', '', 82),
(59, 3, '0.8353845628796395.jpeg', '', 82),
(60, 3, '0.3653889265012267.jpeg', '', 82),
(61, 3, '0.07498844166667151.jpeg', '', 83),
(62, 3, '0.5911655455651701.jpeg', '', 83),
(63, 3, '0.1794458952604181.jpeg', '', 83),
(64, 1, '0.8233720724361115.jpeg', '5555555', 84),
(65, 3, '0.2606094196700588.jpeg', '55555', 84),
(66, 2, '0.9576618851123637.jpeg', '7777777777', 84),
(67, 3, '0.102334505315274.jpeg', '', 85),
(68, 1, '0.7195984169190144.jpeg', '333333333', 85),
(69, 2, '0.40975504236046434.jpeg', '', 85),
(70, 2, '0.3427637140451769.jpeg', '', 86),
(71, 1, '0.039436353722847706.jpeg', '', 86),
(72, 3, '0.1753012989114182.jpeg', '', 86),
(73, 1, '0.4679491837436234.jpeg', '', 87),
(74, 2, '0.9124539274847017.jpeg', '', 87),
(75, 3, '0.9854006395918629.jpeg', '', 87),
(76, 2, '0.4478810415293337.jpeg', '', 88),
(77, 1, '0.9770100049833013.jpeg', '', 88),
(78, 3, '0.4427466411369567.jpeg', '', 88),
(79, 1, '0.21945776061406197.jpeg', '', 89),
(80, 3, '0.3035300424560379.jpeg', '', 89),
(81, 2, '0.056231223858212775.jpeg', '', 89),
(82, 1, '0.18415709500513344.jpeg', '', 90),
(83, 2, '0.4699337887780566.jpeg', '', 90),
(84, 3, '0.07580699261829871.jpeg', '', 90),
(85, 1, '0.014484383572580528.jpeg', '', 91),
(86, 2, '0.1327218761187503.jpeg', '', 91),
(87, 3, '0.08074507404303755.jpeg', '', 91),
(88, 2, '0.9012002445500356.jpeg', '', 92),
(89, 3, '0.05659048443941006.jpeg', '', 92),
(90, 1, '0.44353696844683355.jpeg', '', 92),
(91, 2, '0.23133209870768234.jpeg', '', 93),
(92, 3, '0.46795417653206295.jpeg', '', 93),
(93, 1, '0.1309327978809185.jpeg', '', 93),
(102, 1, 'rm1.jpeg', '平菇准备好 待用', 4),
(103, 2, 'rm2.jpeg', '用手对半撕', 4),
(104, 3, 'rm3.jpeg', '肉末切好 待用', 4),
(105, 4, 'rm4.jpeg', '锅里放适量油', 4),
(106, 5, 'rm5.jpeg', '放肉末', 4),
(107, 6, 'rm6.jpeg', ' 炒变色放平菇', 4),
(108, 7, 'rm7.jpeg', ' 就放蒜米 小米辣 糖 盐 炒匀', 4),
(109, 8, 'rm8.jpeg', '起锅。完成', 4),
(113, 1, '0.9211345595242164.jpeg', '', 95),
(114, 2, '0.9034287919379274.jpeg', '', 95),
(115, 3, '0.021531662061227363.jpeg', '', 95),
(116, 1, 'hsr1.jpg', '某个人买了这么大一瓶可乐，我也醉了，他说既然是可乐红烧肉，应该喝着可乐吃着可乐红烧肉嘛。。。\r\n这个，这个。。。。', 7),
(117, 2, 'hsr2.jpg', '准备好五花肉一块。。。最好是方的好切一点的哦', 7),
(118, 3, 'hsr3.jpg', '锅内水烧开，放入准备好的五花肉焯下水，去掉浮沫', 7),
(119, 4, 'hsr4.jpg', '将五花肉切成两厘米厚的块，再切成均匀的小丁', 7),
(120, 5, 'hsr5.jpg', '这样的大小差不多，以前都是大块的，今天切小块的试试', 7),
(121, 6, 'hsr6.jpg', '大蒜生姜切末备用', 7),
(122, 7, 'hsr7.jpg', '用油起锅，倒入五花肉，翻炒至转色和出油', 7),
(123, 8, 'hsr8.jpg', '放入适量的白糖翻炒均匀', 7),
(124, 9, 'hsr9.jpg', '倒入姜片，蒜末继续翻炒', 7),
(125, 10, 'hsr10.jpg', ' 加入生抽和老抽炒匀上色。。。。', 7),
(126, 11, 'hsr11.jpg', ' 淋入料酒，加入盐，炒匀调味儿', 7),
(127, 12, 'hsr12.jpg', '加入准备好的可乐倒入锅中。。。，加盖用小火焖四十分钟左右。。', 7),
(128, 13, 'hsr13.jpg', '葱洗净切段备用', 7),
(129, 14, 'hsr14.jpg', '揭开锅盖，用大火收汁儿，加入准备好的水淀粉勾芡。。。。在加入葱段就可以出锅啦。。', 7),
(130, 15, 'hsr15.jpg', '看着这个色就觉得超级好吃的感觉，连老爸居然也买单哦，说这样搭配的也好吃。。。哈哈开心', 7),
(131, 16, 'hsr16.jpg', '一盘干掉觉得还美过瘾', 7),
(135, 1, '0.06880616047334298.jpeg', '', 97),
(144, 1, '0.054113151425844164.jpeg', '', 100),
(145, 2, '0.35379464987828224.jpeg', '', 100),
(146, 3, '0.7160982518867871.jpeg', '', 100),
(147, 1, '0.38431836913749207.jpeg', '', 101),
(148, 2, '0.7820575399401031.jpeg', '', 101),
(149, 3, '0.8460953307730996.jpeg', '', 101),
(153, 1, '0.06794598463137946.jpeg', '', 103),
(154, 2, '0.0063295792275230855.jpeg', '', 103),
(155, 3, '0.47463041081190926.jpeg', '', 103),
(159, 1, '0.7098088268371003.jpeg', '', 105),
(160, 2, '0.9744892126424587.jpeg', '', 105),
(161, 3, '0.4172007914368323.jpeg', '', 105),
(162, 2, '0.3403964465892926.jpeg', '', 106),
(163, 1, '0.42370800656228025.jpeg', '', 106),
(164, 3, '0.3949796534883925.jpeg', '', 106),
(165, 2, '0.022674042390206095.jpeg', '', 107),
(166, 3, '0.648547036889815.jpeg', '', 107),
(167, 1, '0.5982740830163176.jpeg', '', 107),
(168, 2, '0.7580728621123045.jpeg', '', 108),
(169, 3, '0.2093878950306407.jpeg', '', 108),
(170, 1, '0.5604805129942934.jpeg', '', 108),
(177, 2, '0.3359647685006657.jpeg', '', 111),
(178, 3, '0.1436109643514818.jpeg', '', 111),
(179, 1, '0.2723770373429022.jpeg', '', 111),
(180, 2, '0.27534732297374576.jpeg', '', 112),
(181, 3, '0.2824477383923478.jpeg', '', 112),
(182, 1, '0.36726369620234767.jpeg', '', 112),
(183, 2, '0.8459047260590513.jpeg', '', 113),
(184, 3, '0.4219702402050485.jpeg', '', 113),
(185, 1, '0.5038743088134214.jpeg', '', 113),
(186, 2, '0.7953813086338637.jpeg', '', 115),
(187, 1, '0.6362053453451613.jpeg', '', 115),
(188, 3, '0.454680298621422.jpeg', '', 115),
(189, 2, '0.8047118789465522.jpeg', '', 117),
(190, 3, '0.41035382129427966.jpeg', '', 117),
(191, 1, '0.22977622803396902.jpeg', '', 117),
(192, 1, '0.9817575798075189.jpeg', '', 118),
(193, 2, '0.08921175794372904.jpeg', '', 118),
(194, 3, '0.5623095680885881.jpeg', '', 118),
(195, 1, '0.5918204368819813.jpeg', '', 119),
(196, 2, '0.2983934734088798.jpeg', '', 119),
(197, 3, '0.7827030384834488.jpeg', '', 119),
(198, 2, '0.11715784060914647.jpeg', '', 120),
(199, 1, '0.035061362830413945.jpeg', '', 120),
(200, 3, '0.45200355280200966.jpeg', '', 120),
(201, 1, '0.5248133652324294.jpeg', '', 121),
(202, 2, '0.07085977075287642.jpeg', '', 121),
(203, 3, '0.33564641750917623.jpeg', '', 121),
(204, 2, '0.8082571381419328.jpeg', '', 122),
(205, 1, '0.061061084081974304.jpeg', '', 122),
(206, 3, '0.5813860435017908.jpeg', '', 122),
(207, 1, '0.07848152328791946.jpeg', '', 123),
(208, 2, '0.3912740574460887.jpeg', '', 123),
(209, 3, '0.7460232745783621.jpeg', '', 123),
(213, 2, '0.5450822439726615.jpeg', '', 125),
(214, 1, '0.8873192293660424.jpeg', '', 125),
(215, 3, '0.9110566062032825.jpeg', '', 125),
(216, 2, NULL, '', 126),
(217, 1, NULL, '', 126),
(218, 3, NULL, '', 126),
(219, 2, NULL, '', 127),
(220, 3, NULL, '', 127),
(221, 1, NULL, '', 127),
(222, 2, NULL, '', 128),
(223, 1, NULL, '', 128),
(224, 3, NULL, '', 128),
(225, 2, NULL, '', 129),
(226, 3, NULL, '', 129),
(227, 1, NULL, '', 129),
(228, 2, NULL, '', 130),
(229, 3, NULL, '', 130),
(230, 1, NULL, '', 130),
(231, 2, '0.24927368957371399.jpeg', '', 131),
(232, 1, '0.7555736498484471.jpeg', '', 131),
(233, 3, '0.7531098427792549.jpeg', '', 131),
(234, 2, '0.12380658235839359.jpeg', '', 132),
(235, 1, '0.46255984874049916.jpeg', '', 132),
(236, 3, '0.005262541871241533.jpeg', '', 132),
(237, 2, NULL, '', 133),
(238, 3, NULL, '', 133),
(239, 1, NULL, '', 133),
(243, 2, NULL, '', 135),
(244, 1, NULL, '', 135),
(245, 3, NULL, '', 135),
(246, 2, '0.7388926098575648.jpeg', '', 136),
(247, 3, '0.955287050213355.jpeg', '', 136),
(248, 1, '0.6766923908490248.jpeg', '', 136),
(249, 2, '0.9118943650261284.jpeg', '', 137),
(250, 3, '0.14531662110132126.jpeg', '', 137),
(251, 1, '0.435440871925425.jpeg', '', 137),
(252, 1, '0.5929372526789878.jpeg', '', 138),
(253, 3, '0.8236757638319274.jpeg', '', 138),
(254, 2, '0.8009179729540663.jpeg', '', 138),
(255, 2, '0.21737639858709024.jpeg', '', 139),
(256, 3, '0.06363883375377455.jpeg', '', 139),
(257, 1, '0.40539979872773935.jpeg', '', 139),
(258, 1, '0.31484252106384125.jpeg', '将它们揉成光滑的面团， 饧上20分钟；', 140),
(259, 2, '0.31484252106384125.jpeg', '肉馅加入盐、生粉、生姜粉、蚝油、料酒等调味料， 沿着一个方向搅拌上劲；', 140),
(260, 3, '0.31484252106384125.jpeg', '准备包时再加入小葱末拌均匀；', 140),
(261, 4, '0.31484252106384125.jpeg', '包入馅料；', 140),
(262, 5, '0.31484252106384125.jpeg', '面团擀成长条后分割成小剂子擀成圆片；', 140),
(263, 6, '0.31484252106384125.jpeg', '加入香菇丁和笋丁，再顺着刚才的方向搅拌，中间可以打入点泡香菇的水；', 140),
(264, 7, '0.31484252106384125.jpeg', ' 这样小煎包就完成了， 码放在平底锅中，倒入适量的水和油；', 140),
(265, 8, '0.31484252106384125.jpeg', '盖上盖， 先大火煎，看到包子慢慢的膨胀， 待里面的水分完时， 转为小火煎；', 140),
(266, 9, '0.31484252106384125.jpeg', '当底面煎至金黄时，放入小葱末；', 140),
(267, 10, '0.31484252106384125.jpeg', '开动了', 140),
(268, 11, '0.31484252106384125.jpeg', '直接端上桌了；', 140),
(269, 1, '0.7577021913261994.jpeg', '发酵粉温水调和， 面粉放入容器中；', 140),
(270, 1, 'sxz1.jpg', '材料', 1),
(271, 2, 'sxz2.jpg', '茄子切开，从中间再切一刀不要断开，如图', 1),
(272, 3, 'sxz3.jpg', '香菜切碎，蒜捣成泥，加盐加味精调在一起，一会等茄子熟了凉凉摸茄子上', 1),
(273, 4, 'sxz4.jpg', ' 戴一次性手套摸上蒜泥', 1),
(274, 5, 'sxz5.jpg', '做了不少哈', 1),
(275, 6, 'sxz6.jpg', '覆盖保鲜膜入味，哈哈，明天可以吃喽。一次吃不完放保鲜随吃随取。吃时改刀，特别下饭', 1),
(287, 1, 'csr1.jpg', ' 准备食材：', 10),
(288, 2, 'csr2.jpg', '将肉清洗干净，控干水份。切成厚约1.5寸的片，用牙签在上面扎满小眼儿以便入味。', 10),
(289, 3, 'csr3.jpg', '葱姜切丝，蒜拍扁。将所有酱料倒入给肉进行按摩。盖保鲜膜冷藏半天。这个工作可以前一天晚上来做，转天取出。如果您有时间中途可以再翻拌一次，这样入味着色更均匀。葱腌制的时间不宜过长，所以翻面的时间可将葱挑出来丢掉。', 10),
(290, 4, 'csr4.jpg', ' 开始预热烤箱，180度。烤箱下层放加盖锡纸的烤盘。我用的是PE5359WT烤箱，该烤箱有食物探针功能，此时需将食物探针圆头端金属针插入烤箱内壁右侧上方连接插座，将食物探针安装到位。如您的烤箱没有食物探针，请省略。', 10),
(291, 5, 'csr5.jpg', '烤网上垫双层锡纸。将腌制好的肉片码放在烤网上', 10),
(292, 6, 'csr6.jpg', '预热结束后，将烤网放入中层。将食物探针尖端部分插入肉内部中心位置。需注意的是食物探针不要接触到发热管。', 10),
(293, 7, 'csr7.jpg', ' 选择热风功能进行烤制180度25分钟', 10),
(294, 8, 'csr8.jpg', '经过25分钟后，将肉取出翻面，在两面都均匀地刷上叉烧酱和蜂蜜继续烤制180度25分钟。', 10),
(295, 9, 'csr9.jpg', '超级美味的叉烧肉，好吃得根本停不下来。', 10),
(296, 10, 'csr10.jpg', '赶快来学，提前预热年夜菜！', 10),
(297, 11, 'csr11.jpg', '我只能说，饭店的叉烧肉都弱爆了~', 10),
(298, 1, 'mexs1.jpg', '收到的男厨东北秋木耳，包装精美，有特色', 2),
(299, 2, 'mexs2.jpg', '打开有相关的书签和两小袋木耳', 2),
(300, 3, 'mexs3.jpg', ' 取10g泡发', 2),
(301, 4, 'mexs4.jpg', '泡发的时间把鸡蛋加盐打散', 2),
(302, 5, 'mexs5.jpg', '洋葱洗净切碎条，青红椒切片', 2),
(303, 6, 'mexs6.jpg', ' 泡发好的木耳很肥厚哦，没有根蒂，洗干净就可以直接烹饪', 2),
(304, 7, 'mexs7.jpg', ' 把洗净的木耳焯水', 2),
(305, 8, 'mexs8.jpg', '起油锅炒鸡蛋，滑散炒好后盛出备用', 2),
(306, 9, 'mexs9.jpg', '重起油锅炒洋葱和辣椒，加少许盐调味', 2),
(307, 10, 'mexs10.jpg', '翻炒片刻后加入焯过水的木耳一起翻炒，淋入少许生抽', 2),
(308, 11, 'mexs11.jpg', '加入之前炒好的鸡蛋均匀即可出锅', 2),
(309, 12, 'mexs12.jpg', '木耳肥厚，加上鸡蛋和洋葱的入味，吃起来口感超级 赞', 2),
(310, 1, 'lbhz1.jpg', '海蜇凉水浸泡，多换几次水去咸味。', 22),
(311, 2, 'lbhz2.jpg', '紫甘蓝，黄瓜切丝。', 22),
(312, 3, 'lbhz3.jpg', ' 蒜蓉备好。', 22),
(313, 4, 'lbhz4.jpg', '白糖，陈醋，纯味鲜酱油，盐，香油调匀。', 22),
(314, 5, 'lbhz5.jpg', '水烧开，海蜇焯水5秒钟立刻捞出。', 22),
(315, 6, 'lbhz6.jpg', '海蜇，紫甘蓝，黄瓜放入大碗里。', 22),
(316, 7, 'lbhz7.jpg', '料汁倒进去。', 22),
(317, 8, 'lbhz8.jpg', ' 熟白芝麻拌匀即可。', 22),
(318, 9, 'lbhz9.jpg', '成品图', 22),
(319, 1, 'ymdx1.jpg', '去除虾线', 8),
(320, 2, 'ymdx2.jpg', '倒入料酒腌虾（10分钟左右）', 8),
(321, 3, 'ymdx3.jpg', '把海鲜生抽，醋，白糖，水，淀粉做成调味汁', 8),
(322, 4, 'ymdx4.jpg', '葱，姜切丝', 8),
(323, 5, 'ymdx5.jpg', '锅中倒入比炒菜多一点的花生油，把大虾倒入炒至红油出来，虾炒至红色', 8),
(324, 6, 'ymdx6.jpg', '炒成这样，盛出来', 8),
(325, 7, 'ymdx7.jpg', '锅中留底油（有虾的红油）', 8),
(326, 8, 'ymdx8.jpg', '把葱姜倒入煸炒出香味，倒入大虾，倒入调味汁，翻炒一下，盖上锅盖，小火两分钟，大火收汤汁。', 8),
(327, 9, 'ymdx9.jpg', '装盘', 8),
(328, 1, 'wxpg1.jpg', '将猪小排用水烫过后洗干净沥干备用', 32),
(329, 2, 'wxpg2.jpg', '油锅下少许橄榄油，小火爆香葱、姜，加入所有调味料A、猪小排', 32),
(330, 3, 'wxpg3.jpg', '煮开后关小火，小火煮约30分钟把水收干', 32),
(331, 4, 'wxpg4.jpg', '将青江菜烫熟后铺在盘底，把排骨放在盘子中,剩余汤汁煮开加入太白粉水勾芡，洒上香油后淋到排骨上即可。', 32),
(332, 1, 'kkdg1.jpg', '把蛋白和蛋黄分离到两个无油无水的容器中', 33),
(333, 2, 'kkdg2.jpg', '蛋黄中加入牛奶和玉米油搅拌均匀，充分乳化', 33),
(334, 3, 'kkdg3.jpg', '筛入低粉，可可粉，z字形搅拌均匀，', 33),
(335, 4, 'kkdg4.jpg', '搅拌好的蛋黄糊', 33),
(336, 5, 'kkdg5.jpg', '蛋白中加入柠檬汁，用打蛋器低速打出鱼眼泡，加入三分之一的细砂糖，然后继续打发到细腻状态，加入第二次白砂糖，然后继续打发至明显纹路，加入第三次细砂糖，打至提起打蛋器有尖角', 33),
(337, 6, 'kkdg6.jpg', '取三分之一蛋白加入蛋黄糊中翻拌均匀，然后在倒入蛋白中翻拌均匀', 33),
(338, 7, 'kkdg7.jpg', '倒入烤盘中，用刮板刮平，轻震几下，振出大气泡，烤箱160度预热6分钟，中层烤20分钟', 33),
(339, 8, 'kkdg8.jpg', '出炉后倒扣在烤网上，撕去油纸，放至温热，重新取一张干净的油纸，把蛋糕放在油纸上卷起，定型15分钟，放凉后切段', 33),
(340, 1, 'pddf1.jpg', '豆腐焯水备用。', 28),
(341, 2, 'pddf2.jpg', '皮蛋，葱，辣椒切碎备用。', 28),
(342, 3, 'pddf3.jpg', '将生抽适量放入碗中，加入少量糖，色拉油，切好的葱，皮蛋，辣椒调成味汁，浇在豆腐上即可。', 28),
(357, 1, 'sly1.jpg', '清除内脏，鱼鳞的鲈鱼一条，老豆腐一块。', 3),
(358, 2, 'sly2.jpg', '鲈鱼两面切花刀，放入姜丝，料酒，盐，腌制20分钟。', 3),
(359, 3, 'sly3.jpg', '老豆腐切1CM左右的厚块，用淡盐水浸泡备用', 3),
(360, 4, 'sly4.jpg', '香菜，生姜，小米椒洗净。香菜切段，生姜切片，小米椒切碎。大酱备用。', 3),
(361, 5, 'sly5.jpg', '坐锅点火，倒入适量油，七成热时入腌好的鱼，小火慢煎。', 3),
(362, 6, 'sly6.jpg', '两面煎黄后盛出备用。', 3),
(363, 7, 'sly7.jpg', '下豆腐，两面煎黄后盛出。', 3),
(364, 8, 'sly8.jpg', '锅中留油，入姜片，小米椒炝锅。', 3),
(365, 9, 'sly9.jpg', '倒入适量水，烧开后倒入煎好的鱼和大酱。', 3),
(366, 10, 'sly10.jpg', '汤水再次沸腾后转小火慢炖20分钟。', 3),
(367, 11, 'sly11.jpg', '加入提前煎好的老豆腐。', 3),
(368, 12, 'sly12.jpg', '15分钟后，加入1/2盐。', 3),
(369, 13, 'sly13.jpg', '5分钟后，加入香菜，略煮后关火即可出锅享用了。', 3),
(370, 1, 'mxr1.jpg', '黑木耳提前泡发好，肉切片，加生粉、少量盐、料酒及少量色拉油腌制一下，姜切丝，葱切段。', 5),
(371, 2, 'mxr2.jpg', '黑木耳提前泡发好，肉切片，加生粉、少量盐、料酒及少量色拉油腌制一下，姜切丝，葱切段。', 5),
(372, 3, 'mxr3.jpg', '最后将黄瓜、木耳、鸡蛋倒入，加少量盐、生抽炒制几下，蔬菜断生即可。', 5),
(373, 1, 'dsrs1.jpg', '冬笋去皮削根，切丝备用', 6),
(374, 2, 'dsrs2.jpg', '前臀尖或里脊切丝，加葱花、料酒、淀粉，抓匀上浆', 6),
(375, 3, 'dsrs3.jpg', '热锅凉油滑炒肉丝至变色备用，不可时间太长，肉丝老了就不好吃了', 6),
(376, 4, 'dsrs4.jpg', '重新起油锅，放少许油，中火煸炒笋丝，中间可以加一两次水，一定要少，主要因为冬笋炒时不出水，一是防止干锅糊锅，二是可以加快笋丝的熟软', 6),
(377, 5, 'dsrs5.jpg', ' 放入事先煸好的肉丝，一起翻炒均匀', 6),
(378, 6, 'dsrs6.jpg', '翻炒均匀后放入盐调味即可出锅', 6),
(379, 1, 'mpdf1.jpg', ' 嫩豆腐切成1cm见方的小块，放入加了食盐的沸水中浸泡片刻。', 29),
(380, 2, 'mpdf2.jpg', '花椒放入锅中，中火干焙出香味后晾凉，放在案板上用擀面棍把花椒粒碾碎。', 29),
(381, 3, 'mpdf3.jpg', ' 锅中放油，待油温升高放入牛肉碎翻炒至牛肉变色散开，放入郫县豆瓣酱，然后撒上干红辣椒碎，慢慢地炒出红油。', 29),
(382, 4, 'mpdf4.jpg', '将豆腐块放入，加适量温水烹煮片刻，然后用水淀粉勾上薄芡，关火盛出。', 29),
(383, 5, 'mpdf5.jpg', ' 将花椒碎和辣椒碎撒在表面，淋入适量烧开的芝麻油，最后再撒少许花椒末和香葱碎。', 29),
(385, 2, '0.767048447600645.jpeg', '', 141),
(386, 1, '0.10822373797726814.jpeg', '', 141),
(387, 3, '0.385155770151802.jpeg', '', 141),
(388, 4, '0.5439301221392603.jpeg', 'weec', 95),
(389, 1, 'clc1.jpg', '荷兰豆洗净去掉两头老丝。香肠斜切片。小青红尖椒切小段，去掉籽。', 42),
(390, 2, 'clc2.jpg', ' 油烧热，放入葱末、姜丝、小青红尖椒爆香。', 42),
(391, 3, 'clc3.jpg', '放入香肠，煸炒至香肠变的透明，边缘开始变软。', 42),
(392, 4, 'clc4.jpg', '倒入荷兰豆翻炒。', 42),
(393, 5, 'clc5.jpg', '滴入美极鲜、盐、十三香、白胡椒粉、鸡粉', 42),
(394, 6, 'clc6.jpg', ' 翻炒均匀。', 42);

-- --------------------------------------------------------

--
-- 表的结构 `t_submaterial`
--

CREATE TABLE `t_submaterial` (
  `submaterial_id` int(11) NOT NULL,
  `submaterial_name` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `submaterial_num` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `t_cook_cook_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_submaterial`
--

INSERT INTO `t_submaterial` (`submaterial_id`, `submaterial_name`, `submaterial_num`, `t_cook_cook_id`) VALUES
(1, '盐', '1勺', 1),
(2, '酱油', '2勺', 43),
(3, '醋', '2勺', 37),
(5, '盐', '1勺', 44),
(113, '姜', '4片', 4),
(114, '盐', '2小勺', 4),
(115, '蒜', '4瓣', 4),
(116, '糖', '1勺', 4),
(117, '姜片', '3g', 7),
(118, '葱段', '2g', 7),
(119, '盐', '3g', 7),
(120, '白糖', '4g', 7),
(121, '生抽', '4ml', 7),
(122, '老抽', '2ml', 7),
(123, '料酒', '4ml', 7),
(124, '水淀粉', '3ml', 7),
(301, '发酵粉', '3克', 140),
(302, '油盐', '适量', 140),
(303, '生粉', '1勺', 140),
(304, '生姜粉', '1小勺', 140),
(305, '大葱', '1根', 10),
(306, '蒜', '4瓣', 10),
(307, '甜面酱', '3勺', 10),
(308, '料酒', '3勺', 10),
(309, '盐', '1克', 10),
(310, '蜂蜜', '适量	', 10),
(311, '姜', '1块', 10),
(312, '叉烧酱', '5勺', 10),
(313, '蚝油', '3勺', 10),
(314, '酱油', '3勺', 10),
(315, '红曲粉', '少许', 10),
(316, '陈醋', '2勺', 22),
(317, '盐', '适量', 22),
(318, '大蒜', '3瓣', 22),
(319, '白糖', '半勺', 22),
(320, '味事达纯味鲜酱油', '1勺', 22),
(321, '芝麻油', '几滴', 22),
(322, '姜', '适量', 8),
(323, '大葱', '小段', 8),
(324, '醋', '5g', 8),
(325, '清水', '适量', 8),
(326, '花生油', '适量', 8),
(327, '海鲜生抽', '15g', 8),
(328, '白糖', '15g', 8),
(329, '淀粉', '2g', 8),
(330, '料酒', '适量', 8),
(331, '绍兴酒', '200cc', 32),
(332, '豆油伯苹果淳', '60cc', 32),
(333, '八角', '5颗', 32),
(334, '太白粉水', '适量', 32),
(335, '豆油伯红曲酱油', '90cc', 32),
(336, '水', '400cc', 32),
(337, '肉桂', '1片', 32),
(338, '香油', '1大匙', 32),
(339, '柠檬汁', '几滴', 33),
(340, '细砂糖', '60g', 33),
(341, '红辣椒', '少许', 28),
(342, '盐', '适量', 28),
(343, '生抽或美极鲜酱油', '适量', 28),
(344, '葱', '适量', 28),
(345, '色拉油', '少许', 28),
(346, '糖', '少许', 28),
(347, '油', '适量', 3),
(348, '大酱', '1勺', 3),
(349, '香菜', '3根', 3),
(350, '料酒', '1/2勺', 3),
(351, '盐', '1/2勺', 3),
(352, '生姜', '3片', 3),
(353, '小米椒', '2个', 3),
(354, '生抽', '适量', 5),
(355, '生粉', '适量', 5),
(356, '盐', '适量', 5),
(357, '料酒', '适量', 5),
(358, '姜丝', '适量', 5),
(359, '葱段', '适量', 5),
(360, '色拉油', '适量', 5),
(361, '葱', '少许', 6),
(362, '盐', '少许', 6),
(363, '淀粉', '少许', 6),
(364, '料酒', '少许', 6),
(365, '白糖', '适量', 29),
(366, '食盐', '适量', 29),
(367, '葵花籽油', '适量', 29),
(368, '', '', 141),
(369, '', '', 141),
(370, '', '', 141),
(371, '', '', 141),
(372, '葱末', '适量', 42),
(373, '姜丝', '适量', 42),
(374, '美极鲜', '几滴', 42),
(375, '十三香', '1/4小勺', 42),
(376, '白胡椒粉', '1/4小勺', 42),
(377, '鸡粉', '1/4小勺', 42);

-- --------------------------------------------------------

--
-- 表的结构 `t_topic`
--

CREATE TABLE `t_topic` (
  `topic_id` int(11) NOT NULL,
  `topic_title` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `topic_date` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `topic_content` text COLLATE utf8_unicode_ci,
  `topic_likecount` varchar(45) COLLATE utf8_unicode_ci DEFAULT '0',
  `topic_collectNum` int(11) DEFAULT '0',
  `t_user_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_topic`
--

INSERT INTO `t_topic` (`topic_id`, `topic_title`, `topic_date`, `topic_content`, `topic_likecount`, `topic_collectNum`, `t_user_user_id`) VALUES
(1, '瞎捣鼓', '2016-12-16 00:00:00', '下厨的乐趣就在于瞎捣鼓呀。只要不是没熟、糊掉或者味道太过逆天，哪有什么成功失败。', '2345', 234, 4),
(2, 'ruier喵的欧包练习簿', '2016-12-04 00:00:00', '全美11家蒸馏酒品牌强势来袭 美国蒸馏酒协会将于11月14日在1515酒吧举办美国威士忌品鉴会，邀请媒体朋友和酒业同仁把酒言欢，共品“美”酒，感受美国威士忌的丰富口感和多元搭配。美国是全球威士忌生产大国之一，对中国市场特别看好。此次品鉴会与美国农业部合作，属于其市场准入项目的活动之一。品鉴会上将分享品尝两大美国蒸馏酒业泰斗的威士忌，更有对中国市场来说相对尚属“新面孔”的9家品牌产品。嘿嘿嘿嘿哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', '231', 23, 14),
(3, 'chubbylens', '2016-12-28 00:00:00', '黄教煮专属标签', '223', 123, 17),
(4, '24小时流行作品', '2016-12-16 00:00:00', '每张照片背后都有故事，几句寒暄传递生活的力量。', '4523', 234, 12),
(5, '九华山论厨', '1997-03-14 00:00:00', '啊的事发生', '525', 12, 1),
(6, 'aaaaaaaaaaaaaaa', '2016-12-15 00:00:00', '555555555555', '345', 234, 17),
(8, 'sssssssssss', '2017-01-03 14:16:42', 'wwwwwwwwww', '0', 0, 17),
(9, 'qqqqqqq', '2017-01-03 14:17:51', 'wwwwwwwwww', '0', 0, 17);

-- --------------------------------------------------------

--
-- 表的结构 `t_topiclike`
--

CREATE TABLE `t_topiclike` (
  `topiclike_id` int(11) NOT NULL,
  `t_topic_topic_id` int(11) NOT NULL,
  `t_user_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `t_user`
--

CREATE TABLE `t_user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `user_sex` varchar(4) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_portart` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_tele` varchar(11) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_birth` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_email` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `topic_count` varchar(45) COLLATE utf8_unicode_ci DEFAULT '0',
  `collect_count` varchar(45) COLLATE utf8_unicode_ci DEFAULT '0',
  `user_sign` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_user`
--

INSERT INTO `t_user` (`user_id`, `user_name`, `user_password`, `user_sex`, `user_portart`, `user_tele`, `user_birth`, `user_email`, `topic_count`, `collect_count`, `user_sign`) VALUES
(1, 'ZJM', '1585823', '女', 'girl1.jpg', '1010731225', '1994-3-28', '1010731225@qq.com', '0', '0', '请叫我女王大人'),
(2, 'asknon', '112233', '男', 'boy1.jpg', '17751110131', '1993-11-4', '324123s5157@163.com', '5', '0', '我会弹一闪'),
(3, 'cyl', '123', '女', 'girl2.jpg', '18009647683', '1994-6-8', 'klasdfjaslk@qq.com', '7', '0', '冷小莫o'),
(4, 'xueliang', 'MTIzNDU2Nzg=', '男', 'longmao.jpg', '15858234412', '1994-10-7', 'jkhfvjsa@qq.com', '4', '0', '大神的沉默'),
(5, 'xiaohua', 'MTIzNDU2Nzg=', '女', 'user1.png', '13322334455', '1990-12-12', NULL, '0', '123', ''),
(9, 'jack', 'MTIzNDU2Nzg=', '男', 'user5.jpg', '13322334428', NULL, NULL, '0', '343', ''),
(12, 'anna', 'MTIzNDU2Nzg=', '女', 'girl2.jpg', '17655667788', NULL, NULL, '0', '0', NULL),
(13, 'Tom', 'MTIzNDU2Nzg=', '男', 'longmao.jpg', '15666778899', '1989-5-26', NULL, '0', '0', 'sssssss'),
(14, '风凌天下', 'MTIzNDU2Nzg=', '男', 'longmao.jpg', '13333333333', '1984-7-14', NULL, '0', '0', NULL),
(15, '风', 'MTIzNDU2', '男', 'longmao.jpg', '18705543365', NULL, NULL, '0', '0', NULL),
(16, 'Hebe', 'Nzc3Nzc3Nzc=', '女', NULL, '18888888888', '1982-10-09', NULL, '0', '0', NULL),
(17, 'He', 'MTIzNDU2Nw==', '男', '0.7467942824073999.jpeg', '18700000000', '1993-04-14 00:00:00', '1010731225@qq.com', '0', '13', 'rrrr'),
(18, 'BadBlood', 'MTIzNDU2', '女', 'girl2.jpg', '12311112222', NULL, NULL, '0', '0', NULL),
(19, 'Elle', 'MTIzNDU2Nw==', '女', NULL, '18200000000', NULL, NULL, '0', '0', NULL),
(20, NULL, 'MTIzNDU2Nzg=', NULL, NULL, '13466666666', NULL, NULL, NULL, NULL, NULL),
(21, NULL, 'MTIzNDU2Nzg5MA==', NULL, NULL, '13400000000', NULL, NULL, NULL, NULL, NULL),
(22, 'rose', '12345678', '女', NULL, '18100000000', '1995-03-03 00:00:00', NULL, NULL, NULL, NULL),
(23, NULL, '12345678', NULL, NULL, '13430569737', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `t_video`
--

CREATE TABLE `t_video` (
  `video_id` int(11) NOT NULL,
  `video_name` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `video_collects` int(11) DEFAULT '0',
  `video_likes` int(11) DEFAULT '0',
  `video_comments` int(11) DEFAULT '0' COMMENT '视频评论数',
  `t_user_user_id` int(11) NOT NULL,
  `video_img` varchar(225) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '播放缩略图',
  `video_src` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '视频链接地址',
  `video_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_video`
--

INSERT INTO `t_video` (`video_id`, `video_name`, `video_collects`, `video_likes`, `video_comments`, `t_user_user_id`, `video_img`, `video_src`, `video_time`) VALUES
(3, '黑椒肥牛卷', 346, 124, 0, 2, '黑椒肥牛卷.jpg', '0.9207678941138084.mp4', '2016-12-30 00:00:00'),
(4, '美式风味烤肉饼', 0, 1, 0, 2, 'pic2.jpg', '0.9207678941138084.mp4', '2016-12-31 00:00:00'),
(5, '赛百味披萨', 0, 0, 0, 2, 'pic3.jpg', '0.9207678941138084.mp4', '2016-12-31 00:00:00'),
(9, '多汁牛排', 0, 0, 0, 4, '多汁牛排.jpg', '0.9207678941138084.mp4', '2017-01-01 13:15:00'),
(10, '蔬菜沙拉', 0, 0, 0, 4, '蔬菜沙拉.jpg', '0.9207678941138084.mp4', '2017-01-01 17:24:00'),
(28, '酱爆鱿鱼', 0, 0, 0, 3, '酱爆鱿鱼.jpg', 'video1.mp4', '2017-01-07 07:09:00'),
(29, '萝卜烧豆包', 0, 0, 0, 3, '萝卜烧豆泡.jpg', 'video1.mp4', '2017-01-07 09:31:18'),
(34, '辣子鸡', 0, 0, 0, 3, '辣子鸡.jpg', 'video1.mp4', '2017-01-09 05:22:31'),
(35, '黑森林蛋糕', 0, 0, 0, 3, '黑森林蛋糕.jpg', 'video1.jpg', '2017-01-09 13:20:30'),
(37, '草莓奶油蛋糕', 0, 0, 0, 2, '草莓奶油蛋糕.jpg', 'video1.jpg', '2017-01-09 14:45:51'),
(38, '鲜香牛排', 0, 0, 0, 4, '鲜香牛排.jpg', 'video1.jpg', '2017-01-09 16:23:42'),
(39, '赛百味披萨', 0, 0, 0, 4, 'pic3.jpg', 'video1.mp4', '2017-01-09 17:40:31'),
(40, '锅包肉', 0, 1, 0, 1, '锅包肉.jpg', 'video1.mp4', '2017-01-09 19:33:26'),
(41, '蛋黄酱', 56, 130, 0, 3, 'm1.jpg', 'video1.mp4', '2017-01-09 19:23:45'),
(42, '西冷牛排', 43, 87, 0, 2, 'm2.jpg', 'video1.mp4', '2017-01-09 20:27:30');

-- --------------------------------------------------------

--
-- 表的结构 `t_videocollect`
--

CREATE TABLE `t_videocollect` (
  `videocollect_id` int(11) NOT NULL,
  `t_user_user_id` int(11) NOT NULL,
  `t_video_video_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_videocollect`
--

INSERT INTO `t_videocollect` (`videocollect_id`, `t_user_user_id`, `t_video_video_id`) VALUES
(1, 17, 5),
(2, 17, 4),
(6, 18, 3);

-- --------------------------------------------------------

--
-- 表的结构 `t_videocomment`
--

CREATE TABLE `t_videocomment` (
  `videocomment_id` int(11) NOT NULL,
  `videocomment_content` text COLLATE utf8_unicode_ci,
  `videocomment_time` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `t_user_user_id` int(11) NOT NULL,
  `t_video_video_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_videocomment`
--

INSERT INTO `t_videocomment` (`videocomment_id`, `videocomment_content`, `videocomment_time`, `t_user_user_id`, `t_video_video_id`) VALUES
(1, 'rrrrrrrr', '2017-01-08 15:23:24', 17, 4),
(2, '555', '2017-01-08 15:36:01', 17, 4),
(4, 'oo..love asparagus, its a great late spring vege, great addition to any pasta or stir-fries. Your picture looks great, that and your recipe, of course, cheers !:)', '2017-01-10 16:43:15', 18, 42),
(5, 'this looks really refreshing for a summer lunch. will try when asparagus are in season!', '2017-01-10 16:45:30', 18, 10),
(9, 'Awesome!This is actually a very good recipe I have made it before and loved it.. I did one thing different I didn\'t use the puff pastry and instead I used Italian bread crumbs to roll it in', '2017-01-10 16:56:55', 18, 3),
(10, 'i wanted to cook this tomorrow but central market in adelaide doesnt open on wednesday. maybe next time', '2017-01-10 17:09:27', 18, 35),
(12, 'i wanted to cook this tomorrow but central market in adelaide doesnt open on wednesday. maybe next time', '2017-01-10 18:55:54', 18, 3),
(13, '( ⊙o⊙ )哇，看上去好好吃啊！喜欢次肉', '2017-01-10 18:58:49', 18, 9),
(14, 'i see asparragus, prosciutto, butter, cream and LEMON! dubow, why must you make me love you so??????', '2017-01-10 19:02:14', 18, 5),
(15, 'This looks easy and delicious! :) I like bananas in everything! :) curtain cleaning', '2017-01-10 19:04:00', 18, 10),
(16, 'Looks very tasty and with mangoes it is just mouth watering dish.', '2017-01-10 19:05:55', 18, 35),
(17, 'That looks delicious very tasty !! go to college', '2017-01-10 19:08:40', 18, 37),
(18, 'nice', '2017-02-16 16:35:36', 13, 40);

-- --------------------------------------------------------

--
-- 表的结构 `t_videolike`
--

CREATE TABLE `t_videolike` (
  `videolike_id` int(11) NOT NULL,
  `t_video_video_id` int(11) NOT NULL,
  `t_user_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `t_videolike`
--

INSERT INTO `t_videolike` (`videolike_id`, `t_video_video_id`, `t_user_user_id`) VALUES
(36, 3, 18),
(37, 4, 17),
(38, 40, 13),
(39, 41, 13);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `t_collectcook`
--
ALTER TABLE `t_collectcook`
  ADD PRIMARY KEY (`collectcook_id`,`t_user_user_id`,`t_cook_cook_id`),
  ADD KEY `fk_t_user_has_t_cook_t_cook1_idx` (`t_cook_cook_id`),
  ADD KEY `fk_t_user_has_t_cook_t_user1_idx` (`t_user_user_id`);

--
-- Indexes for table `t_collecttopic`
--
ALTER TABLE `t_collecttopic`
  ADD PRIMARY KEY (`collecttopic_id`),
  ADD KEY `fk_t_collecttopic_t_user1_idx` (`t_user_user_id`),
  ADD KEY `fk_t_collecttopic_t_topoc1_idx` (`t_topoc_topic_id`);

--
-- Indexes for table `t_commenttopic`
--
ALTER TABLE `t_commenttopic`
  ADD PRIMARY KEY (`commenttopic_id`),
  ADD KEY `fk_t_commenttopic_t_user1_idx` (`t_user_user_id`),
  ADD KEY `fk_t_commenttopic_t_topoc1_idx` (`t_topoc_topic_id`);

--
-- Indexes for table `t_comment_cook`
--
ALTER TABLE `t_comment_cook`
  ADD PRIMARY KEY (`commentcook_id`),
  ADD KEY `fk_t_comment_cook_t_user1_idx` (`t_user_user_id`),
  ADD KEY `fk_t_comment_cook_t_cook1_idx` (`t_cook_cook_id`);

--
-- Indexes for table `t_cook`
--
ALTER TABLE `t_cook`
  ADD PRIMARY KEY (`cook_id`),
  ADD KEY `fk_t_cook_t_cooktype_small1_idx` (`t_cooktype_small_smalltype_id`),
  ADD KEY `t_user_id` (`t_user_id`);

--
-- Indexes for table `t_cooktype_big`
--
ALTER TABLE `t_cooktype_big`
  ADD PRIMARY KEY (`bigtype_id`);

--
-- Indexes for table `t_cooktype_small`
--
ALTER TABLE `t_cooktype_small`
  ADD PRIMARY KEY (`smalltype_id`),
  ADD KEY `fk_t_cooktype_small_t_cooktype_big_idx` (`t_cooktype_big_bigtype_id`);

--
-- Indexes for table `t_followuser`
--
ALTER TABLE `t_followuser`
  ADD PRIMARY KEY (`followuser_id`),
  ADD KEY `followuser_user_id` (`followuser_userid`),
  ADD KEY `t_user_user_id` (`t_user_user_id`);

--
-- Indexes for table `t_images`
--
ALTER TABLE `t_images`
  ADD PRIMARY KEY (`img_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `topic_id` (`topic_id`);

--
-- Indexes for table `t_likecook`
--
ALTER TABLE `t_likecook`
  ADD PRIMARY KEY (`likecook_id`),
  ADD KEY `t_cook_cook_id` (`t_cook_cook_id`),
  ADD KEY `t_user_user_id` (`t_user_user_id`);

--
-- Indexes for table `t_material`
--
ALTER TABLE `t_material`
  ADD PRIMARY KEY (`material_id`),
  ADD KEY `fk_t_material_t_cook1_idx` (`t_cook_cook_id`);

--
-- Indexes for table `t_step`
--
ALTER TABLE `t_step`
  ADD PRIMARY KEY (`step_id`),
  ADD KEY `fk_t_step_t_cook1_idx` (`t_cook_cook_id`);

--
-- Indexes for table `t_submaterial`
--
ALTER TABLE `t_submaterial`
  ADD PRIMARY KEY (`submaterial_id`),
  ADD KEY `fk_t_submaterial_t_cook1_idx` (`t_cook_cook_id`);

--
-- Indexes for table `t_topic`
--
ALTER TABLE `t_topic`
  ADD PRIMARY KEY (`topic_id`),
  ADD KEY `fk_t_topoc_t_user1_idx` (`t_user_user_id`);

--
-- Indexes for table `t_topiclike`
--
ALTER TABLE `t_topiclike`
  ADD PRIMARY KEY (`topiclike_id`),
  ADD KEY `t_topic_topic_id` (`t_topic_topic_id`),
  ADD KEY `t_user_user_id` (`t_user_user_id`);

--
-- Indexes for table `t_user`
--
ALTER TABLE `t_user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `t_video`
--
ALTER TABLE `t_video`
  ADD PRIMARY KEY (`video_id`),
  ADD KEY `fk_t_video_t_user1_idx` (`t_user_user_id`);

--
-- Indexes for table `t_videocollect`
--
ALTER TABLE `t_videocollect`
  ADD PRIMARY KEY (`videocollect_id`),
  ADD KEY `fk_t_videocollect_t_user1_idx` (`t_user_user_id`),
  ADD KEY `fk_t_videocollect_t_video1_idx` (`t_video_video_id`);

--
-- Indexes for table `t_videocomment`
--
ALTER TABLE `t_videocomment`
  ADD PRIMARY KEY (`videocomment_id`),
  ADD KEY `fk_t_videocomment_t_user1_idx` (`t_user_user_id`),
  ADD KEY `fk_t_videocomment_t_video1_idx` (`t_video_video_id`);

--
-- Indexes for table `t_videolike`
--
ALTER TABLE `t_videolike`
  ADD PRIMARY KEY (`videolike_id`),
  ADD KEY `t_video_video_id` (`t_video_video_id`),
  ADD KEY `t_user_user_id` (`t_user_user_id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `t_collectcook`
--
ALTER TABLE `t_collectcook`
  MODIFY `collectcook_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;
--
-- 使用表AUTO_INCREMENT `t_collecttopic`
--
ALTER TABLE `t_collecttopic`
  MODIFY `collecttopic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- 使用表AUTO_INCREMENT `t_commenttopic`
--
ALTER TABLE `t_commenttopic`
  MODIFY `commenttopic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
--
-- 使用表AUTO_INCREMENT `t_comment_cook`
--
ALTER TABLE `t_comment_cook`
  MODIFY `commentcook_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;
--
-- 使用表AUTO_INCREMENT `t_cook`
--
ALTER TABLE `t_cook`
  MODIFY `cook_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;
--
-- 使用表AUTO_INCREMENT `t_cooktype_big`
--
ALTER TABLE `t_cooktype_big`
  MODIFY `bigtype_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- 使用表AUTO_INCREMENT `t_cooktype_small`
--
ALTER TABLE `t_cooktype_small`
  MODIFY `smalltype_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- 使用表AUTO_INCREMENT `t_followuser`
--
ALTER TABLE `t_followuser`
  MODIFY `followuser_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;
--
-- 使用表AUTO_INCREMENT `t_images`
--
ALTER TABLE `t_images`
  MODIFY `img_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- 使用表AUTO_INCREMENT `t_likecook`
--
ALTER TABLE `t_likecook`
  MODIFY `likecook_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;
--
-- 使用表AUTO_INCREMENT `t_material`
--
ALTER TABLE `t_material`
  MODIFY `material_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=337;
--
-- 使用表AUTO_INCREMENT `t_step`
--
ALTER TABLE `t_step`
  MODIFY `step_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=395;
--
-- 使用表AUTO_INCREMENT `t_submaterial`
--
ALTER TABLE `t_submaterial`
  MODIFY `submaterial_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=378;
--
-- 使用表AUTO_INCREMENT `t_topic`
--
ALTER TABLE `t_topic`
  MODIFY `topic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- 使用表AUTO_INCREMENT `t_topiclike`
--
ALTER TABLE `t_topiclike`
  MODIFY `topiclike_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `t_user`
--
ALTER TABLE `t_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- 使用表AUTO_INCREMENT `t_video`
--
ALTER TABLE `t_video`
  MODIFY `video_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- 使用表AUTO_INCREMENT `t_videocollect`
--
ALTER TABLE `t_videocollect`
  MODIFY `videocollect_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- 使用表AUTO_INCREMENT `t_videocomment`
--
ALTER TABLE `t_videocomment`
  MODIFY `videocomment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- 使用表AUTO_INCREMENT `t_videolike`
--
ALTER TABLE `t_videolike`
  MODIFY `videolike_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
--
-- 限制导出的表
--

--
-- 限制表 `t_collectcook`
--
ALTER TABLE `t_collectcook`
  ADD CONSTRAINT `fk_t_user_has_t_cook_t_cook1` FOREIGN KEY (`t_cook_cook_id`) REFERENCES `t_cook` (`cook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_t_user_has_t_cook_t_user1` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_collecttopic`
--
ALTER TABLE `t_collecttopic`
  ADD CONSTRAINT `fk_t_collecttopic_t_topoc1` FOREIGN KEY (`t_topoc_topic_id`) REFERENCES `t_topic` (`topic_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_t_collecttopic_t_user1` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_commenttopic`
--
ALTER TABLE `t_commenttopic`
  ADD CONSTRAINT `fk_t_commenttopic_t_topoc1` FOREIGN KEY (`t_topoc_topic_id`) REFERENCES `t_topic` (`topic_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_t_commenttopic_t_user1` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_comment_cook`
--
ALTER TABLE `t_comment_cook`
  ADD CONSTRAINT `fk_t_comment_cook_t_cook1` FOREIGN KEY (`t_cook_cook_id`) REFERENCES `t_cook` (`cook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_t_comment_cook_t_user1` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_cook`
--
ALTER TABLE `t_cook`
  ADD CONSTRAINT `fk_ct_user_id` FOREIGN KEY (`t_user_id`) REFERENCES `t_user` (`user_id`),
  ADD CONSTRAINT `fk_t_cook_t_cooktype_small1` FOREIGN KEY (`t_cooktype_small_smalltype_id`) REFERENCES `t_cooktype_small` (`smalltype_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `t_cooktype_small`
--
ALTER TABLE `t_cooktype_small`
  ADD CONSTRAINT `fk_t_cooktype_small_t_cooktype_big` FOREIGN KEY (`t_cooktype_big_bigtype_id`) REFERENCES `t_cooktype_big` (`bigtype_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_followuser`
--
ALTER TABLE `t_followuser`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`),
  ADD CONSTRAINT `fk_userid` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`);

--
-- 限制表 `t_images`
--
ALTER TABLE `t_images`
  ADD CONSTRAINT `fk_img_topic_id` FOREIGN KEY (`topic_id`) REFERENCES `t_topic` (`topic_id`),
  ADD CONSTRAINT `fk_img_user_id` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`);

--
-- 限制表 `t_likecook`
--
ALTER TABLE `t_likecook`
  ADD CONSTRAINT `fk_likecook_cook_id` FOREIGN KEY (`t_cook_cook_id`) REFERENCES `t_cook` (`cook_id`),
  ADD CONSTRAINT `fk_likecook_user_id` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`);

--
-- 限制表 `t_material`
--
ALTER TABLE `t_material`
  ADD CONSTRAINT `fk_t_material_t_cook1` FOREIGN KEY (`t_cook_cook_id`) REFERENCES `t_cook` (`cook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_step`
--
ALTER TABLE `t_step`
  ADD CONSTRAINT `fk_t_step_t_cook1` FOREIGN KEY (`t_cook_cook_id`) REFERENCES `t_cook` (`cook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_submaterial`
--
ALTER TABLE `t_submaterial`
  ADD CONSTRAINT `fk_t_submaterial_t_cook1` FOREIGN KEY (`t_cook_cook_id`) REFERENCES `t_cook` (`cook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_topic`
--
ALTER TABLE `t_topic`
  ADD CONSTRAINT `fk_t_topoc_t_user1` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_topiclike`
--
ALTER TABLE `t_topiclike`
  ADD CONSTRAINT `fk_t_topic_id` FOREIGN KEY (`t_topic_topic_id`) REFERENCES `t_topic` (`topic_id`),
  ADD CONSTRAINT `fk_t_user_id` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`);

--
-- 限制表 `t_video`
--
ALTER TABLE `t_video`
  ADD CONSTRAINT `fk_t_video_t_user1` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `t_videocollect`
--
ALTER TABLE `t_videocollect`
  ADD CONSTRAINT `fk_t_videocollect_t_user1` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_t_videocollect_t_video1` FOREIGN KEY (`t_video_video_id`) REFERENCES `t_video` (`video_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `t_videocomment`
--
ALTER TABLE `t_videocomment`
  ADD CONSTRAINT `fk_t_videocomment_t_user1` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_t_videocomment_t_video1` FOREIGN KEY (`t_video_video_id`) REFERENCES `t_video` (`video_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `t_videolike`
--
ALTER TABLE `t_videolike`
  ADD CONSTRAINT `fk_v_user_id` FOREIGN KEY (`t_user_user_id`) REFERENCES `t_user` (`user_id`),
  ADD CONSTRAINT `fk_v_video_id` FOREIGN KEY (`t_video_video_id`) REFERENCES `t_video` (`video_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
