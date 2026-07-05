const pool = require('./db');

const sql = `
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
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  role ENUM('admin','teacher') DEFAULT 'teacher'
);
`;

async function run() {
  const conn = await pool.getConnection();
  const statements = sql.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    await conn.query(stmt);
  }
  await conn.query(`INSERT INTO classes (class_name, teacher_name) VALUES
    ('Nursery','Sister Mary'),('Primary','Brother John'),
    ('Junior','Sister Grace'),('Senior','Brother Paul')`);
  await conn.query(`INSERT INTO students (name, class_id, dob, phone) VALUES
    ('Aarav Kumar',1,'2019-03-10','9876543210'),
    ('Priya Raj',2,'2016-07-22','9876543211'),
    ('David Samuel',3,'2013-01-15','9876543212'),
    ('Ruth Thomas',4,'2010-11-05','9876543213'),
    ('Joel Peter',2,'2015-05-30','9876543214')`);
  await conn.query(`INSERT INTO users (name, username, password, role) VALUES
    ('Admin','admin',MD5('admin123'),'admin'),
    ('Teacher','teacher',MD5('teacher123'),'teacher')`);
  console.log('Setup done!');
  conn.release();
  process.exit();
}

run().catch(e => { console.error(e); process.exit(1); });