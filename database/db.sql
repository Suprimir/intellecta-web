-- Active: 1742011190350@@127.0.0.1@3306@intellecta_database
CREATE DATABASE intellecta_database;
USE intellecta_database;

CREATE TABLE users (
 user_ID VARCHAR(100) PRIMARY KEY NOT NULL, 
 username VARCHAR(60) NOT NULL UNIQUE,
 email VARCHAR(70) NOT NULL UNIQUE,
 password VARCHAR(200) NOT NULL,
 role ENUM ('student', 'instructor', 'admin') NOT NULL, 
 profilePicture TEXT,
 verified BOOLEAN NOT NULL
);

CREATE TABLE emailToken (
    token_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    expired_At DATE NOT NULL,
    token VARCHAR(100) NOT NULL,
    user_ID VARCHAR(100) NOT NULL REFERENCES users(user_ID)
)

CREATE TABLE categories (
 category_ID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
 category_Description VARCHAR(25)
);

CREATE TABLE courses (
 course_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
 course_Name VARCHAR(50) NOT NULL,
 course_Description TEXT,
 course_Date TIMESTAMP NOT NULL,
 course_Duration DATE,
 instructor_ID VARCHAR(100) NOT NULL,
 category_ID INT NOT NULL,
 material TEXT, 
 foreign key (instructor_ID) references users (user_ID) on delete cascade,
 foreign key (category_ID) references categories (category_ID) on delete cascade
);
 
CREATE TABLE contents (
 content_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
 course_ID INT NOT NULL,
 content_Description TEXT,
 document_Path TEXT, 
 content_Rating DECIMAL(5,2),
 foreign key (course_ID) references courses (course_ID) on delete cascade
);
 
CREATE TABLE messages ( 
 message_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
 receiver_User_ID VARCHAR(100) NOT NULL, 
 sender_User_ID VARCHAR(100) NOT NULL, 
 timestamp DATETIME NOT NULL,
 message_Content TEXT,
 foreign key (receiver_User_ID) references users (user_ID) on delete cascade,
 foreign key (sender_User_ID) references users (user_ID) on delete cascade
);
 
CREATE TABLE support_Tickets (
 ticket_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 user_R_ID VARCHAR(100) NOT NULL,
 problem_Category ENUM ('technical', 'functional', 'bug', 'other category'), 
 proof_Files TEXT,
 ticket_Status ENUM ('open', 'closed', 'in process', 'unknown'),
 ticket_Resolution TEXT,
 foreign key (user_R_ID) references users (user_ID) on delete cascade
);

DROP DATABASE intellecta_database;

SELECT * FROM categories WHERE category_ID = 1;
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM courses;

SELECT 1 FROM categories WHERE category_Description = "Skibidi";
