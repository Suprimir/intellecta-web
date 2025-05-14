-- Active: 1742011190350@@127.0.0.1@3306@intellecta_database
CREATE DATABASE intellecta_database;
USE intellecta_database;

CREATE TABLE users (
 uuid VARCHAR(100) PRIMARY KEY NOT NULL, 
 username VARCHAR(60) NOT NULL UNIQUE,
 email VARCHAR(70) NOT NULL UNIQUE,
 password VARCHAR(200) NOT NULL,
 role ENUM ('student', 'instructor', 'admin') NOT NULL, 
 profilePicture TEXT,
 verified BOOLEAN NOT NULL
);

CREATE TABLE emailToken (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    expired_At DATE NOT NULL,
    token VARCHAR(100) NOT NULL,
    uuid VARCHAR(100) NOT NULL REFERENCES users(uuid)
)

CREATE TABLE categories (
 id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
 description VARCHAR(25)
);

CREATE TABLE courses (
 id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
 name VARCHAR(50) NOT NULL,
 description TEXT,
 image TEXT,
 date DATE NOT NULL,
 duration DOUBLE,
 instructor_ID VARCHAR(100) NOT NULL,
 category_ID INT NOT NULL,
 foreign key (instructor_ID) references users (uuid) on delete cascade,
 foreign key (category_ID) references categories (id) on delete cascade
);

CREATE TABLE shoppingCarts (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    uuid VARCHAR(100) NOT NULL,
    FOREIGN KEY (uuid) REFERENCES users (uuid) ON DELETE CASCADE
);

CREATE TABLE shoppingCarts_details (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    shoppingCart_ID INT NOT NULL,
    course_ID INT NOT NULL,
    FOREIGN KEY (shoppingCart_ID) REFERENCES shoppingCarts (id) ON DELETE CASCADE,
    FOREIGN KEY (course_ID) REFERENCES courses (id) ON DELETE CASCADE
);

CREATE TABLE contents (
 id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
 course_ID INT NOT NULL,
 title VARCHAR(100),
 description TEXT,
 document_Path TEXT, 
 foreign key (course_ID) references courses (id) on delete cascade
);
 
CREATE TABLE messages ( 
 id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
 receiver_User_ID VARCHAR(100) NOT NULL, 
 sender_User_ID VARCHAR(100) NOT NULL, 
 timestamp DATETIME NOT NULL,
 message_Content TEXT,
 foreign key (receiver_User_ID) references users (uuid) on delete cascade,
 foreign key (sender_User_ID) references users (uuid) on delete cascade
);
 
CREATE TABLE support_Tickets (
 id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 user_R_ID VARCHAR(100) NOT NULL,
 problem_Category ENUM ('technical', 'functional', 'bug', 'other category'), 
 proof_Files TEXT,
 status ENUM ('open', 'closed', 'in process', 'unknown'),
 resolution TEXT,
 foreign key (user_R_ID) references users (uuid) on delete cascade
);

DROP DATABASE intellecta_database;

USE intellecta_database;


SELECT * FROM categories WHERE category_ID = 1;
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM courses;
SELECT 1 FROM users WHERE uuid = "8ecd4836-bd8f-4bc3-a7ca-b54424e0ba2d" AND role = 'admin' OR role = 'instructor';
SELECT 1 FROM categories WHERE category_Description = "Skibidi";
SELECT * FROM shoppingcarts;

DROP TABLE shoppingcarts_details;
DROP TABLE shoppingcarts;

SELECT * FROM shoppingcarts_details WHERE shoppingCart_ID = 1;

SELECT * FROM courses c JOIN shoppingcarts_details sd ON sd.course_ID = c.id WHERE sd.shoppingCart_ID = 1;