import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.resolve('srl_internship.db'), { verbose: console.log });

function initializeDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      profilePicture TEXT,
      role TEXT NOT NULL CHECK(role IN ('Internship Coordinator', 'Supervisor', 'Student')),
      totalEnrolledHours REAL DEFAULT 0,
      totalCompletedHours REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      dateTime TEXT NOT NULL,
      location TEXT NOT NULL,
      hoursAwarded REAL NOT NULL,
      slotsAvailable INTEGER NOT NULL,
      assignedSupervisorId INTEGER,
      status TEXT NOT NULL CHECK(status IN ('Open for Enrollment', 'Enrollment Closed', 'Completed', 'Cancelled')),
      FOREIGN KEY (assignedSupervisorId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      eventId INTEGER NOT NULL,
      enrollmentStatus TEXT NOT NULL CHECK(enrollmentStatus IN ('Pending', 'Accepted', 'Waitlisted', 'Rejected')),
      attendance TEXT NOT NULL DEFAULT 'Not Marked' CHECK(attendance IN ('Not Marked', 'Present', 'Late', 'Sick Leave', 'No Show')),
      performanceGrade TEXT DEFAULT 'N/A' CHECK(performanceGrade IN ('N/A', 'Excellent', 'Good', 'Satisfactory', 'Needs Improvement')),
      supervisorNotes TEXT,
      FOREIGN KEY (studentId) REFERENCES users(id),
      FOREIGN KEY (eventId) REFERENCES events(id),
      UNIQUE(studentId, eventId)
    );
  `);

  console.log('Database initialized.');
}

initializeDB();

export default db;
