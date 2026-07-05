CREATE DATABASE IF NOT EXISTS sunday_school_db;
USE sunday_school_db;

CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_name VARCHAR(100) NOT NULL,
  teacher_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  class_id INT,
  dob DATE,
  phone VARCHAR(15),
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  date DATE NOT NULL,
  status ENUM('present','absent') DEFAULT 'absent',
  notes VARCHAR(255),
  UNIQUE KEY uniq_att (student_id, date),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

INSERT INTO classes (class_name, teacher_name) VALUES
('Primary','Teacher Mary'),('Junior','Teacher John'),('Senior','Teacher Grace');

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  role ENUM('admin','teacher') DEFAULT 'teacher'
);

INSERT INTO users (name, username, password, role) VALUES
('Admin', 'admin', MD5('admin123'), 'admin'),
('Teacher', 'teacher', MD5('teacher123'), 'teacher');
