-- Active: 1742011190350@@127.0.0.1@3306@intellecta_database
USE intellecta_database;

CREATE TABLE users (
 uuid VARCHAR(100) PRIMARY KEY NOT NULL,
 name VARCHAR(100) NOT NULL,
 last_name VARCHAR(100) NOT NULL,
 username VARCHAR(60) NOT NULL UNIQUE,
 email VARCHAR(70) NOT NULL UNIQUE,
 password VARCHAR(200) NOT NULL,
 role ENUM ('student', 'instructor', 'admin') NOT NULL, 
 profilePicture TEXT,
 verified BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE emailToken (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    expired_At DATE NOT NULL,
    token VARCHAR(100) NOT NULL,
    uuid VARCHAR(100) NOT NULL REFERENCES users(uuid)
)

CREATE TABLE resetPassTokens (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    expired_At DATE NOT NULL,
    token VARCHAR(100) NOT NULL,
    uuid VARCHAR(100) NOT NULL REFERENCES users(uuid)
);

CREATE TABLE categories (
 id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
 description VARCHAR(25)
);


CREATE TABLE courses (
 id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
 name VARCHAR(50) NOT NULL,
 description TEXT,
 price DECIMAL(10, 2) DEFAULT 0,
 image TEXT,
 date DATE NOT NULL,
 duration DOUBLE,
 rating TINYINT NOT NULL CHECK (rating BETWEEN 0 AND 10) DEFAULT 0,
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

CREATE TABLE orders (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    uuid VARCHAR(100) NOT NULL,
    status ENUM("completed", "failed") NOT NULL DEFAULT "failed",
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uuid) REFERENCES users (uuid) ON DELETE CASCADE
);

CREATE TABLE orders_details (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    order_ID INT NOT NULL,
    course_ID INT NOT NULL,
    FOREIGN KEY (order_ID) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (course_ID) REFERENCES courses (id) ON DELETE CASCADE
);

CREATE TABLE purchased_courses (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_ID VARCHAR(100) NOT NULL,
    course_ID INT NOT NULL,
    purchase_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES users(uuid) ON DELETE CASCADE,
    FOREIGN KEY (course_ID) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE (user_ID, course_ID)
);

CREATE TABLE payments (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    payment_intent VARCHAR(255) NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR(8) NOT NULL,
    status ENUM("succeded", "pending", "incomplete", "expired", "failed") NOT NULL,
    user_ID VARCHAR(100) NOT NULL
);

CREATE TABLE units_courses (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    unit_number INT NOT NULL,
    course_ID INT NOT NULL,
    title VARCHAR(128) NOT NULL,
    UNIQUE(unit_number, course_ID)
);

CREATE TABLE contents (
 id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 unit_ID INT NOT NULL,
    order_number INT NOT NULL,
 description TEXT NOT NULL,
 media_Path TEXT,
 document_Path TEXT, 
 foreign key (unit_ID) references units_courses (id) on delete cascade
);

CREATE TABLE contents_completed (
    content_ID INT NOT NULL,
    user_ID VARCHAR(100) NOT NULL,
    UNIQUE (content_ID, user_ID),
    FOREIGN KEY (content_ID) REFERENCES contents (id) ON DELETE CASCADE,
    FOREIGN KEY (user_ID) REFERENCES users (uuid) ON DELETE CASCADE
);

CREATE TABLE certificates (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_ID VARCHAR(100) NOT NULL,
    course_ID INT NOT NULL,
    FOREIGN KEY (user_ID) REFERENCES users(uuid),
    FOREIGN KEY (course_ID) REFERENCES courses(id),
    UNIQUE (user_ID, course_ID)
);

SELECT * FROM certificates;

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

SELECT * FROM contents_completed;
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


SELECT c.id, c.name, c.description, c.price, c.image, c.date, c.duration, c.instructor_ID, c.category_ID FROM courses c JOIN shoppingcarts_details sd ON sd.course_ID = c.id WHERE sd.shoppingCart_ID = 1;

USE intellecta_database;

CREATE VIEW coursesFrontend AS
SELECT c.id, c.name, c.description, c.image, c.`date`, c.duration, c.`instructor_ID`, CONCAT_WS(" ", u.name, u.last_name) AS instructor, c.`category_ID`, cat.description AS category_name, c.price 
FROM courses c 
JOIN users u ON u.uuid = c.`instructor_ID`
JOIN categories cat ON c.`category_ID` = cat.id;

CREATE VIEW coursesCartFrontend AS
SELECT c.id, c.name, c.description, c.price, c.image, c.date, c.duration, c.instructor_ID, c.instructor, c.category_ID, c.category_name, sd.`shoppingCart_ID`
FROM coursesfrontend c 
JOIN shoppingcarts_details sd ON sd.course_ID = c.id;


SELECT c.id, c.name, c.description, c.price, c.image, c.date, c.duration, c.instructor_ID, c.instructor, c.category_ID, c.category_name, sd.`shoppingCart_ID`
FROM coursesfrontend c 
JOIN shoppingcarts_details sd ON sd.course_ID = c.id;
SELECT * FROM coursesfrontend;

SELECT * FROM courses;

select * from shoppingcarts_details;

SELECT * FROM users;
SELECT * from coursescartfrontend where `shoppingCart_ID` =1;
SELECT * FROM purchased_courses;

SELECT c.id,
        pc.user_ID,
     c.name, 
     c.description, 
     c.image, 
     c.date, 
     c.duration, 
     c.instructor_ID, 
     CONCAT_WS(" ", u.name, u.last_name) AS instructor, 
     c.category_ID, 
     cat.description AS category_name, 
    c.price
FROM courses c 
JOIN users u ON u.uuid = c.instructor_ID
JOIN categories cat ON c.category_ID = cat.id
JOIN purchased_courses pc ON pc.course_ID = c.id
WHERE pc.user_ID = ?;

SELECT * FROM shoppingcarts_details;


DELETE FROM shoppingcarts_details 
WHERE id IN (8) 
AND shoppingCart_ID = 1;

CREATE VIEW contentsFrontend AS
SELECT uc.id AS unit_ID, 
uc.course_ID, uc.title as unit_Title, 
uc.unit_number as unit_Number, 
c.id as content_ID, 
c.title, c.description, 
c.media_Path, c.document_Path
FROM units_courses uc
JOIN contents c ON c.unit_ID = uc.id;

use intellecta_database;
SELECT * FROM contentsfrontend;


SELECT c.id, c.name, c.description, c.image, c.`date`, c.duration, c.`instructor_ID`, CONCAT_WS(" ", u.name, u.last_name) AS instructor, c.`category_ID`, cat.description AS category_name, c.price 
FROM courses c 
JOIN users u ON u.uuid = c.`instructor_ID`
JOIN categories cat ON c.`category_ID` = cat.id
WHERE c.`instructor_ID` = "2e176783-2564-43f2-90d6-b16ecc3fc3bc";


SELECT * FROM coursesfrontend;

SELECT * from contents;