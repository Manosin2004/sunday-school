const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.text({ type: '*/*' })); // handle text/plain bodies too

function getBody(req) {
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body || {};
}

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

// ---------- SETUP (run once, then remove) ----------
app.get('/api/run-setup-xyz123', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const sql = `
    CREATE TABLE IF NOT EXISTS classes (id INT AUTO_INCREMENT PRIMARY KEY, class_name VARCHAR(100) NOT NULL, teacher_name VARCHAR(100));
    CREATE TABLE IF NOT EXISTS students (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, class_id INT, dob DATE, phone VARCHAR(15), FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL);
    CREATE TABLE IF NOT EXISTS attendance (id INT AUTO_INCREMENT PRIMARY KEY, student_id INT, date DATE NOT NULL, status ENUM('present','absent') DEFAULT 'absent', notes VARCHAR(255), UNIQUE KEY uniq_att (student_id, date), FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(50) NOT NULL, role ENUM('admin','teacher') DEFAULT 'teacher');
    `;
    const statements = sql.split(';').filter(s => s.trim());
    for (const stmt of statements) await conn.query(stmt);

    const [[{ c: classCount }]] = await conn.query('SELECT COUNT(*) c FROM classes');
    if (classCount === 0) {
      await conn.query(`INSERT INTO classes (class_name, teacher_name) VALUES ('Nursery','Sister Mary'),('Primary','Brother John'),('Junior','Sister Grace'),('Senior','Brother Paul')`);
    }

    const [[{ c: studentCount }]] = await conn.query('SELECT COUNT(*) c FROM students');
    if (studentCount === 0) {
      const [classRows] = await conn.query('SELECT id FROM classes ORDER BY id LIMIT 4');
      const ids = classRows.map(r => r.id);
      if (ids.length >= 4) {
        await conn.query(
          `INSERT INTO students (name, class_id, dob, phone) VALUES
           ('Aarav Kumar',?,'2019-03-10','9876543210'),
           ('Priya Raj',?,'2016-07-22','9876543211'),
           ('David Samuel',?,'2013-01-15','9876543212'),
           ('Ruth Thomas',?,'2010-11-05','9876543213'),
           ('Joel Peter',?,'2015-05-30','9876543214')`,
          [ids[0], ids[1], ids[2], ids[3], ids[1]]
        );
      }
    }

    const [[{ c: userCount }]] = await conn.query('SELECT COUNT(*) c FROM users');
    if (userCount === 0) {
      await conn.query(`INSERT INTO users (name, username, password, role) VALUES ('Admin','admin',MD5('admin123'),'admin'),('Teacher','teacher',MD5('teacher123'),'teacher')`);
    }

    conn.release();
    res.send('Setup done! classes:' + classCount + ' students:' + studentCount + ' users:' + userCount);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
});

// ---------- DB VIEWER (simple, no install needed) ----------
app.get('/api/view-db-xyz123', async (req, res) => {
  try {
    const tables = ['classes', 'students', 'attendance', 'users'];
    let html = '<html><body style="font-family:sans-serif">';
    for (const t of tables) {
      const [rows] = await pool.query(`SELECT * FROM ${t}`);
      html += `<h2>${t}</h2><table border="1" cellpadding="6"><tr>`;
      if (rows.length) {
        html += Object.keys(rows[0]).map(k => `<th>${k}</th>`).join('');
        html += '</tr>';
        for (const r of rows) {
          html += '<tr>' + Object.values(r).map(v => `<td>${v}</td>`).join('') + '</tr>';
        }
      }
      html += '</table><br>';
    }
    html += '</body></html>';
    res.send(html);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
});

// ---------- DB VIEWER ----------
app.get('/api/view-db-xyz123', async (req, res) => {
  try {
    const tables = ['classes', 'students', 'attendance', 'users'];
    let html = '<html><body style="font-family:sans-serif">';
    for (const t of tables) {
      const [rows] = await pool.query(`SELECT * FROM ${t}`);
      html += `<h2>${t}</h2><table border="1" cellpadding="6"><tr>`;
      if (rows.length) {
        html += Object.keys(rows[0]).map(k => `<th>${k}</th>`).join('');
        html += '</tr>';
        for (const r of rows) {
          html += '<tr>' + Object.values(r).map(v => `<td>${v}</td>`).join('') + '</tr>';
        }
      }
      html += '</table><br>';
    }
    html += '</body></html>';
    res.send(html);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
});

// ---------- LOGIN ----------
app.post('/api/login.php', async (req, res) => {
  const d = getBody(req);
  if (!d.username || !d.password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [d.username, md5(d.password)]
    );
    const user = rows[0];
    if (user) {
      res.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ---------- DASHBOARD ----------
app.get('/api/dashboard.php', async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [[{ c: total }]] = await pool.query('SELECT COUNT(*) c FROM students');
    const [[{ c: present }]] = await pool.query(
      'SELECT COUNT(*) c FROM attendance WHERE date=? AND status="present"', [today]
    );
    const [[{ c: classes }]] = await pool.query('SELECT COUNT(*) c FROM classes');
    res.json({ total_students: total, present_today: present, total_classes: classes, date: today });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- CLASSES ----------
app.get('/api/classes.php', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM classes ORDER BY id DESC');
  res.json(rows);
});
app.post('/api/classes.php', async (req, res) => {
  const d = getBody(req);
  const [result] = await pool.execute(
    'INSERT INTO classes (class_name, teacher_name) VALUES (?, ?)',
    [d.class_name, d.teacher_name]
  );
  res.json({ id: result.insertId, message: 'Class created' });
});
app.delete('/api/classes.php', async (req, res) => {
  await pool.execute('DELETE FROM classes WHERE id=?', [req.query.id]);
  res.json({ message: 'Deleted' });
});

// ---------- STUDENTS ----------
app.get('/api/students.php', async (req, res) => {
  let rows;
  if (req.query.class_id) {
    [rows] = await pool.execute(
      'SELECT s.*, c.class_name FROM students s JOIN classes c ON s.class_id=c.id WHERE s.class_id=? ORDER BY s.name',
      [req.query.class_id]
    );
  } else {
    [rows] = await pool.query(
      'SELECT s.*, c.class_name FROM students s JOIN classes c ON s.class_id=c.id ORDER BY s.name'
    );
  }
  res.json(rows);
});
app.post('/api/students.php', async (req, res) => {
  const d = getBody(req);
  const [result] = await pool.execute(
    'INSERT INTO students (name, class_id, dob, phone) VALUES (?,?,?,?)',
    [d.name, d.class_id, d.dob, d.phone]
  );
  res.json({ id: result.insertId, message: 'Student added' });
});
app.put('/api/students.php', async (req, res) => {
  const d = getBody(req);
  await pool.execute(
    'UPDATE students SET name=?, class_id=?, dob=?, phone=? WHERE id=?',
    [d.name, d.class_id, d.dob, d.phone, req.query.id]
  );
  res.json({ message: 'Updated' });
});
app.delete('/api/students.php', async (req, res) => {
  await pool.execute('DELETE FROM students WHERE id=?', [req.query.id]);
  res.json({ message: 'Deleted' });
});

// ---------- ATTENDANCE ----------
app.get('/api/attendance.php', async (req, res) => {
  let rows;
  if (req.query.report) {
    [rows] = await pool.execute(
      `SELECT s.name, a.date, a.status FROM attendance a JOIN students s ON a.student_id=s.id
       WHERE s.class_id=? AND MONTH(a.date)=? ORDER BY a.date, s.name`,
      [req.query.class_id, req.query.month]
    );
  } else {
    [rows] = await pool.execute(
      `SELECT a.*, s.name FROM attendance a JOIN students s ON a.student_id=s.id
       WHERE a.date=? AND s.class_id=?`,
      [req.query.date, req.query.class_id]
    );
  }
  res.json(rows);
});
app.put('/api/attendance.php', async (req, res) => {
  const d = getBody(req);
  if (req.query.id) {
    await pool.execute(
      `UPDATE attendance SET status=?, notes=? WHERE id=?`,
      [d.status, d.notes || '', req.query.id]
    );
    return res.json({ message: 'Attendance updated' });
  }
  await pool.execute(
    `INSERT INTO attendance (student_id, date, status, notes) VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE status=VALUES(status), notes=VALUES(notes)`,
    [d.student_id, d.date, d.status, d.notes || '']
  );
  res.json({ message: 'Attendance updated' });
});

app.put('/api/attendance.php', async (req, res) => {
  const d = getBody(req);
  if (req.query.id) {
    await pool.execute(
      `UPDATE attendance SET status=?, notes=? WHERE id=?`,
      [d.status, d.notes || '', req.query.id]
    );
    return res.json({ message: 'Attendance updated' });
  }
  await pool.execute(
    `INSERT INTO attendance (student_id, date, status, notes) VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE status=VALUES(status), notes=VALUES(notes)`,
    [d.student_id, d.date, d.status, d.notes || '']
  );
  res.json({ message: 'Attendance updated' });
});

app.post('/api/attendance.php', async (req, res) => {
  const records = getBody(req);
  const list = Array.isArray(records) ? records : [];
  for (const r of list) {
    await pool.execute(
      `INSERT INTO attendance (student_id, date, status, notes) VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE status=VALUES(status), notes=VALUES(notes)`,
      [r.student_id, r.date, r.status, r.notes || '']
    );
  }
  res.json({ message: 'Attendance saved' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
