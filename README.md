# Sunday School Attendance System

## Setup Steps

### 1. Database
- Open phpMyAdmin → import `backend/setup.sql`

### 2. Backend (PHP)
- Copy `backend/` folder → `C:/xampp/htdocs/sunday-school-api/`
- Start XAMPP → Apache + MySQL

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
- Open: http://localhost:5173

## API URL
Edit `frontend/.env` if your XAMPP port is different:
```
VITE_API_URL=https://sundayschool.rf.gd/api
```
