CREATE TABLE IF NOT EXISTS `service` (
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NULL,
  `isValid` TINYINT(1) NOT NULL DEFAULT 0,
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT "",
  `desc` TEXT NULL,
  `isPackage` TINYINT(1) NOT NULL,
  `version` VARCHAR(10) NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` TINYINT(1) NOT NULL,
  `category` VARCHAR(20) NOT NULL DEFAULT "",
  `supplier` INT NOT NULL,
  `parentService` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`name`)
) AUTO_INCREMENT=10002;

CREATE TABLE IF NOT EXISTS `serviceCategory` (
  `code` VARCHAR(20) NOT NULL DEFAULT "",
  `name` VARCHAR(100) NOT NULL DEFAULT "",
  `desc` TEXT NULL,
  `isDeleted` TINYINT(1) NOT NULL,
  PRIMARY KEY (`code`),
  UNIQUE KEY (`name`)
);

CREATE TABLE IF NOT EXISTS `servicePrice` (
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NULL,
  `isValid` TINYINT(1) NOT NULL DEFAULT 0,
  `id` INT NOT NULL AUTO_INCREMENT,
  `unit` VARCHAR(20) NOT NULL DEFAULT "",
  `quantity` INT NOT NULL DEFAULT 0,
  `amount` FLOAT NOT NULL DEFAULT 0,
  `desc` TEXT NULL,
  `service` INT NOT NULL,
  `servicePackage` INT NULL,
  `serviceLevel` VARCHAR(20) NOT NULL DEFAULT "",
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `servicePromotion` (
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NULL,
  `isValid` TINYINT(1) NOT NULL DEFAULT 0,
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL DEFAULT "",
  `desc` TEXT NULL,
  `discountAmount` FLOAT NULL,
  `price` INT NOT NULL,
  `discountType` VARCHAR(20) NOT NULL DEFAULT "",
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `serviceLevel` (
  `code` VARCHAR(20) NOT NULL DEFAULT "",
  `name` VARCHAR(40) NOT NULL DEFAULT "",
  `desc` TEXT NULL,
  `isDeleted` TINYINT(1) NOT NULL,
  PRIMARY KEY (`code`)
);

CREATE TABLE IF NOT EXISTS `serviceReview` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rating` TINYINT(1) NULL,
  `comment` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `service` INT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `discountType` (
  `code` VARCHAR(20) NOT NULL DEFAULT "",
  `name` VARCHAR(40) NOT NULL DEFAULT "",
  `desc` TEXT NULL,
  `isDeleted` TINYINT(1) NOT NULL,
  PRIMARY KEY (`code`)
);

CREATE TABLE IF NOT EXISTS `reviewReply` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `replyContent` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewTopic` INT NOT NULL,
  `parentReply` INT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `robot` (
  `code` VARCHAR(20) NOT NULL DEFAULT "",
  `introduction` TEXT NOT NULL,
  `voiceScript` TEXT NOT NULL,
  `avatar` VARCHAR(2000) NOT NULL DEFAULT "",
  `images` TEXT NULL,
  `video` VARCHAR(2000) NULL,
  `voice` VARCHAR(2000) NULL,
  `email` VARCHAR(200) NOT NULL DEFAULT "",
  `firstname` VARCHAR(40) NOT NULL DEFAULT "",
  `lastname` VARCHAR(40) NOT NULL DEFAULT "",
  `nickname` VARCHAR(40) NOT NULL DEFAULT "",
  `expertTitle` VARCHAR(40) NOT NULL DEFAULT "",
  `address` VARCHAR(200) NOT NULL DEFAULT "",
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` TINYINT(1) NOT NULL,
  `service` INT NOT NULL,
  `gender` VARCHAR(20) NOT NULL DEFAULT "",
  PRIMARY KEY (`code`)
);

CREATE TABLE IF NOT EXISTS `gender` (
  `code` VARCHAR(20) NOT NULL DEFAULT "",
  `name` VARCHAR(40) NOT NULL DEFAULT "",
  `desc` TEXT NULL,
  `isDeleted` TINYINT(1) NOT NULL,
  PRIMARY KEY (`code`)
);

CREATE TABLE IF NOT EXISTS `robotContact` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `info` VARCHAR(200) NOT NULL DEFAULT "",
  `visible` TINYINT(1) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` TINYINT(1) NOT NULL,
  `robot` VARCHAR(20) NOT NULL DEFAULT "",
  `type` VARCHAR(20) NOT NULL DEFAULT "",
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `contactType` (
  `code` VARCHAR(20) NOT NULL DEFAULT "",
  `name` VARCHAR(40) NOT NULL DEFAULT "",
  `desc` TEXT NULL,
  `isDeleted` TINYINT(1) NOT NULL,
  PRIMARY KEY (`code`)
);

CREATE TABLE IF NOT EXISTS `supplier` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL DEFAULT "",
  `legalName` VARCHAR(100) NOT NULL DEFAULT "",
  `isDeleted` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1001;

