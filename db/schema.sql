-- schema.sql

CREATE DATABASE IF NOT EXISTS admission_portal;
USE admission_portal;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('admin', 'student') NOT NULL
);
show tables;
select * from admission_portal;