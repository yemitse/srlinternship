import { Router } from 'express';
import db from '../../database';

const router = Router();

// GET all enrollments
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM enrollments');
    const enrollments = stmt.all();
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT to update an enrollment's attendance and grade
router.put('/:id/attendance', (req, res) => {
  const { id } = req.params;
  const { attendance, performanceGrade } = req.body;

  try {
    const enrollmentStmt = db.prepare('SELECT * FROM enrollments WHERE id = ?');
    const enrollment = enrollmentStmt.get(id);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Update the enrollment
    const updateStmt = db.prepare('UPDATE enrollments SET attendance = ?, performanceGrade = ? WHERE id = ?');
    updateStmt.run(attendance, performanceGrade, id);

    // Recalculate student's hours
    const studentStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const student = studentStmt.get(enrollment.studentId);

    const eventStmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = eventStmt.get(enrollment.eventId);

    let hoursChange = 0;
    if (attendance === 'No Show') {
      hoursChange = -10;
    } else if (enrollment.attendance !== 'Present' && attendance === 'Present') {
      hoursChange = event.hoursAwarded;
    } else if (enrollment.attendance === 'Present' && attendance !== 'Present') {
      hoursChange = -event.hoursAwarded;
    }

    const newTotalHours = student.totalCompletedHours + hoursChange;
    const updateUserStmt = db.prepare('UPDATE users SET totalCompletedHours = ? WHERE id = ?');
    updateUserStmt.run(newTotalHours, student.id);

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT to update an enrollment status
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { enrollmentStatus } = req.body;
  if (!enrollmentStatus) {
    return res.status(400).json({ error: 'Missing enrollmentStatus' });
  }

  try {
    const stmt = db.prepare('UPDATE enrollments SET enrollmentStatus = ? WHERE id = ?');
    const info = stmt.run(enrollmentStatus, id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.json({ id, enrollmentStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
