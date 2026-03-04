import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("internship.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    chinese_name TEXT,
    student_id_num TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('Internship Coordinator', 'Supervisor', 'Student', 'Pending')) DEFAULT 'Pending',
    status TEXT CHECK(status IN ('Pending', 'Active', 'Rejected')) DEFAULT 'Active',
    profile_picture TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    supervisor_id INTEGER,
    slots INTEGER DEFAULT 0,
    status TEXT CHECK(status IN ('Open for Enrollment', 'Enrollment Closed', 'Completed', 'Cancelled')) DEFAULT 'Open for Enrollment',
    FOREIGN KEY (supervisor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS event_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location TEXT,
    hours REAL NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('Pending', 'Accepted', 'Waitlisted', 'Rejected', 'Withdrawal')) DEFAULT 'Pending',
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    UNIQUE(student_id, event_id)
  );

  CREATE TABLE IF NOT EXISTS attendance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('Not Marked', 'Present', 'Late', 'Sick Leave', 'No Show')) DEFAULT 'Not Marked',
    planning_score INTEGER DEFAULT 0,
    executing_score INTEGER DEFAULT 0,
    grade TEXT CHECK(grade IN ('Excellent', 'Good', 'Satisfactory', 'Needs Improvement')),
    notes TEXT,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES event_sessions(id) ON DELETE CASCADE,
    UNIQUE(enrollment_id, session_id)
  );
`);

// Migration: Add new user columns if they don't exist
const userTableInfo = db.prepare("PRAGMA table_info(users)").all();
const hasChineseName = userTableInfo.some((col: any) => col.name === 'chinese_name');
const hasStudentIdNum = userTableInfo.some((col: any) => col.name === 'student_id_num');
const hasStatus = userTableInfo.some((col: any) => col.name === 'status');

if (!hasChineseName) db.exec("ALTER TABLE users ADD COLUMN chinese_name TEXT");
if (!hasStudentIdNum) db.exec("ALTER TABLE users ADD COLUMN student_id_num TEXT");
if (!hasStatus) db.exec("ALTER TABLE users ADD COLUMN status TEXT CHECK(status IN ('Pending', 'Active', 'Rejected')) DEFAULT 'Active'");

// Migration: Add planning_score and executing_score if they don't exist
const tableInfo = db.prepare("PRAGMA table_info(attendance_records)").all();
const hasPlanningScore = tableInfo.some((col: any) => col.name === 'planning_score');
const hasExecutingScore = tableInfo.some((col: any) => col.name === 'executing_score');

if (!hasPlanningScore) {
  db.exec("ALTER TABLE attendance_records ADD COLUMN planning_score INTEGER DEFAULT 0");
}
if (!hasExecutingScore) {
  db.exec("ALTER TABLE attendance_records ADD COLUMN executing_score INTEGER DEFAULT 0");
}

// Seed Admin if not exists
const adminExists = db.prepare("SELECT id FROM users WHERE role = 'Internship Coordinator'").get();
if (!adminExists) {
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin Coordinator",
    "admin@srl.com",
    "admin123",
    "Internship Coordinator"
  );
  // Seed some initial data for demo
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "John Supervisor",
    "supervisor@srl.com",
    "sup123",
    "Supervisor"
  );
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Alice Student",
    "student@srl.com",
    "stu123",
    "Student"
  );

  // Seed Events
  const event1 = db.prepare("INSERT INTO events (title, description, supervisor_id, slots, status) VALUES (?, ?, ?, ?, ?)").run(
    "Annual Tech Conference 2026",
    "A massive gathering of tech enthusiasts. Students will help with setup, registration, and session management.",
    2, // John Supervisor
    20,
    "Open for Enrollment"
  );

  const event2 = db.prepare("INSERT INTO events (title, description, supervisor_id, slots, status) VALUES (?, ?, ?, ?, ?)").run(
    "Community Outreach Program",
    "Helping local schools set up their computer labs.",
    2,
    10,
    "Open for Enrollment"
  );

  // Seed Sessions
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  db.prepare("INSERT INTO event_sessions (event_id, title, start_time, end_time, location, hours) VALUES (?, ?, ?, ?, ?, ?)").run(
    event1.lastInsertRowid,
    "Day 1: Setup & Briefing",
    tomorrow.toISOString(),
    new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000).toISOString(),
    "Main Hall, Convention Center",
    4
  );

  db.prepare("INSERT INTO event_sessions (event_id, title, start_time, end_time, location, hours) VALUES (?, ?, ?, ?, ?, ?)").run(
    event1.lastInsertRowid,
    "Day 2: Main Event",
    new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    new Date(tomorrow.getTime() + 32 * 60 * 60 * 1000).toISOString(),
    "Main Hall, Convention Center",
    8
  );

  db.prepare("INSERT INTO event_sessions (event_id, title, start_time, end_time, location, hours) VALUES (?, ?, ?, ?, ?, ?)").run(
    event2.lastInsertRowid,
    "Lab Setup Session",
    nextWeek.toISOString(),
    new Date(nextWeek.getTime() + 6 * 60 * 60 * 1000).toISOString(),
    "Lincoln High School",
    6
  );

  // Seed Enrollment for Alice Student (id: 3) to Event 1 (id: 1)
  db.prepare("INSERT INTO enrollments (student_id, event_id, status) VALUES (?, ?, ?)").run(3, 1, 'Accepted');
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Auth Routes
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT id, name, chinese_name, student_id_num, email, role, status, profile_picture FROM users WHERE email = ? AND password = ?").get(email, password);
  if (user) {
    if (user.status !== 'Active') {
      return res.status(403).json({ error: "Account pending approval or rejected" });
    }
    res.json(user);
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/api/register", (req, res) => {
  const { name, chinese_name, student_id_num, email, password } = req.body;
  try {
    const result = db.prepare("INSERT INTO users (name, chinese_name, student_id_num, email, password, role, status) VALUES (?, ?, ?, ?, ?, 'Pending', 'Pending')").run(
      name, chinese_name, student_id_num, email, password
    );
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;
  const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (user) {
    // In a real app, send email. Here we just return success.
    res.json({ success: true, message: "If an account exists with this email, a reset link has been sent." });
  } else {
    res.json({ success: true, message: "If an account exists with this email, a reset link has been sent." });
  }
});

app.post("/api/reset-password", (req, res) => {
  const { email, newPassword } = req.body;
  // Simple reset for demo purposes
  const result = db.prepare("UPDATE users SET password = ? WHERE email = ?").run(newPassword, email);
  if (result.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.patch("/api/users/me/password", (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  const user = db.prepare("SELECT id FROM users WHERE id = ? AND password = ?").get(userId, currentPassword);
  if (user) {
    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newPassword, userId);
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Incorrect current password" });
  }
});

// Admin Approval
app.get("/api/applications", (req, res) => {
  const apps = db.prepare("SELECT id, name, chinese_name, student_id_num, email, role, status FROM users WHERE status = 'Pending'").all();
  res.json(apps);
});

app.patch("/api/users/:id/approve", (req, res) => {
  const { role } = req.body;
  db.prepare("UPDATE users SET role = ?, status = 'Active' WHERE id = ?").run(role, req.params.id);
  res.json({ success: true });
});

app.patch("/api/users/:id/reject", (req, res) => {
  db.prepare("UPDATE users SET status = 'Rejected' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Users
app.get("/api/users", (req, res) => {
  const users = db.prepare("SELECT id, name, email, role FROM users").all();
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const result = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(name, email, password, role);
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Events
app.get("/api/events", (req, res) => {
  const events = db.prepare(`
    SELECT e.*, u.name as supervisor_name 
    FROM events e 
    LEFT JOIN users u ON e.supervisor_id = u.id
  `).all();
  res.json(events);
});

app.post("/api/events", (req, res) => {
  const { title, description, supervisor_id, slots, status } = req.body;
  const result = db.prepare("INSERT INTO events (title, description, supervisor_id, slots, status) VALUES (?, ?, ?, ?, ?)").run(
    title, description, supervisor_id, slots, status
  );
  res.json({ id: result.lastInsertRowid });
});

app.patch("/api/events/:id", (req, res) => {
  const { title, description, supervisor_id, slots, status, sessions } = req.body;
  const eventId = req.params.id;

  db.transaction(() => {
    // Update event details
    db.prepare(`
      UPDATE events 
      SET title = ?, description = ?, supervisor_id = ?, slots = ?, status = ?
      WHERE id = ?
    `).run(title, description, supervisor_id, slots, status, eventId);

    if (sessions && Array.isArray(sessions)) {
      // Get current session IDs
      const currentSessions = db.prepare("SELECT id FROM event_sessions WHERE event_id = ?").all(eventId);
      const currentSessionIds = currentSessions.map((s: any) => s.id);
      const incomingSessionIds = sessions.filter(s => s.id).map(s => Number(s.id));

      // Delete sessions that are not in the incoming list
      const sessionsToDelete = currentSessionIds.filter(id => !incomingSessionIds.includes(id));
      for (const id of sessionsToDelete) {
        db.prepare("DELETE FROM event_sessions WHERE id = ?").run(id);
      }

      // Update or Insert sessions
      for (const session of sessions) {
        if (session.id) {
          // Update existing
          db.prepare(`
            UPDATE event_sessions 
            SET title = ?, start_time = ?, end_time = ?, location = ?, hours = ?
            WHERE id = ? AND event_id = ?
          `).run(session.title, session.start_time, session.end_time, session.location, session.hours, session.id, eventId);
        } else {
          // Insert new
          db.prepare(`
            INSERT INTO event_sessions (event_id, title, start_time, end_time, location, hours)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(eventId, session.title, session.start_time, session.end_time, session.location, session.hours);
        }
      }
    }
  })();

  res.json({ success: true });
});

app.get("/api/events/:id", (req, res) => {
  const event = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  const sessions = db.prepare("SELECT * FROM event_sessions WHERE event_id = ?").all(req.params.id);
  const enrollments = db.prepare(`
    SELECT en.*, u.name as student_name, u.email as student_email
    FROM enrollments en
    JOIN users u ON en.student_id = u.id
    WHERE en.event_id = ?
  `).all(req.params.id);
  res.json({ ...event, sessions, enrollments });
});

// Sessions
app.post("/api/sessions", (req, res) => {
  const { event_id, title, start_time, end_time, location, hours } = req.body;
  const result = db.prepare("INSERT INTO event_sessions (event_id, title, start_time, end_time, location, hours) VALUES (?, ?, ?, ?, ?, ?)").run(
    event_id, title, start_time, end_time, location, hours
  );
  res.json({ id: result.lastInsertRowid });
});

// Enrollments
app.post("/api/enroll", (req, res) => {
  const { student_id, event_id } = req.body;
  try {
    const result = db.prepare("INSERT INTO enrollments (student_id, event_id, status) VALUES (?, ?, 'Pending')").run(student_id, event_id);
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: "Already enrolled" });
  }
});

app.post("/api/admin/enroll", (req, res) => {
  const { student_id, event_id, status } = req.body;
  try {
    const result = db.prepare("INSERT INTO enrollments (student_id, event_id, status) VALUES (?, ?, ?)").run(student_id, event_id, status || 'Accepted');
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    // If already enrolled, update the status instead
    try {
      db.prepare("UPDATE enrollments SET status = ? WHERE student_id = ? AND event_id = ?").run(status || 'Accepted', student_id, event_id);
      res.json({ success: true, updated: true });
    } catch (err) {
      res.status(400).json({ error: "Failed to enroll student" });
    }
  }
});

app.patch("/api/enrollments/:id", (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE enrollments SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ success: true });
});

// Attendance & Grading
app.get("/api/sessions/:id/attendance", (req, res) => {
  const session = db.prepare("SELECT * FROM event_sessions WHERE id = ?").get(req.params.id);
  const records = db.prepare(`
    SELECT ar.*, u.name as student_name, en.id as enrollment_id
    FROM enrollments en
    JOIN users u ON en.student_id = u.id
    LEFT JOIN attendance_records ar ON ar.enrollment_id = en.id AND ar.session_id = ?
    WHERE en.event_id = ? AND en.status = 'Accepted'
  `).all(req.params.id, session.event_id);
  res.json(records);
});

app.post("/api/attendance", (req, res) => {
  const { enrollment_id, session_id, status, planning_score, executing_score, grade, notes } = req.body;
  db.prepare(`
    INSERT INTO attendance_records (enrollment_id, session_id, status, planning_score, executing_score, grade, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(enrollment_id, session_id) DO UPDATE SET
      status = excluded.status,
      planning_score = excluded.planning_score,
      executing_score = excluded.executing_score,
      grade = excluded.grade,
      notes = excluded.notes
  `).run(enrollment_id, session_id, status, planning_score, executing_score, grade, notes);
  res.json({ success: true });
});

// Student Stats
app.get("/api/students/:id/stats", (req, res) => {
  const enrolledHours = db.prepare(`
    SELECT SUM(s.hours) as total
    FROM enrollments en
    JOIN event_sessions s ON en.event_id = s.event_id
    WHERE en.student_id = ? AND en.status = 'Accepted'
  `).get(req.params.id).total || 0;

  const completedHoursResult = db.prepare(`
    SELECT 
      SUM(CASE WHEN ar.status IN ('Present', 'Late') THEN s.hours ELSE 0 END) as completed,
      SUM(CASE WHEN ar.status = 'No Show' THEN 10 ELSE 0 END) as penalty
    FROM enrollments en
    JOIN event_sessions s ON en.event_id = s.event_id
    LEFT JOIN attendance_records ar ON ar.enrollment_id = en.id AND ar.session_id = s.id
    WHERE en.student_id = ? AND en.status = 'Accepted'
  `).get(req.params.id);

  const completedHours = (completedHoursResult.completed || 0) - (completedHoursResult.penalty || 0);

  res.json({ enrolledHours, completedHours });
});

// Student History
app.get("/api/students/:id/history", (req, res) => {
  const history = db.prepare(`
    SELECT s.*, ar.status as attendance_status, ar.planning_score, ar.executing_score, ar.grade, ar.notes, e.title as event_title
    FROM enrollments en
    JOIN events e ON en.event_id = e.id
    JOIN event_sessions s ON e.id = s.event_id
    LEFT JOIN attendance_records ar ON ar.enrollment_id = en.id AND ar.session_id = s.id
    WHERE en.student_id = ? AND en.status = 'Accepted'
    ORDER BY s.start_time DESC
  `).all(req.params.id);
  res.json(history);
});

// Supervisor Schedule
app.get("/api/supervisors/:id/sessions", (req, res) => {
  const sessions = db.prepare(`
    SELECT s.*, e.title as event_title
    FROM event_sessions s
    JOIN events e ON s.event_id = e.id
    WHERE e.supervisor_id = ?
    ORDER BY s.start_time ASC
  `).all(req.params.id);
  res.json(sessions);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
