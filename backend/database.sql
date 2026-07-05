CREATE DATABASE IF NOT EXISTS sunday_school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sunday_school_db;

CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_name VARCHAR(100) NOT NULL,
  teacher_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  class_id INT NOT NULL,
  dob DATE,
  phone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present','absent') DEFAULT 'absent',
  notes VARCHAR(255),
  UNIQUE KEY unique_attendance (student_id, date),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

INSERT INTO classes (class_name, teacher_name) VALUES
('Nursery', 'Sister Mary'),('Primary', 'Brother John'),
('Junior', 'Sister Grace'),('Senior', 'Brother Paul');

INSERT INTO students (name, class_id, dob, phone) VALUES
('Aarav Kumar', 1, '2019-03-10', '9876543210'),
('Priya Raj', 2, '2016-07-22', '9876543211'),
('David Samuel', 3, '2013-01-15', '9876543212'),
('Ruth Thomas', 4, '2010-11-05', '9876543213'),
('Joel Peter', 2, '2015-05-30', '9876543214');
