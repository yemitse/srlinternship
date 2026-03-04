import { Router } from 'express';
import db from '../../database';
import bcrypt from 'bcrypt'; // We'll need to install this

const router = Router();

// GET all users
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, fullName, email, profilePicture, role, totalEnrolledHours, totalCompletedHours FROM users');
    const users = stmt.all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  const { fullName, email, role, password = 'password123' } = req.body;
  if (!fullName || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)');
    const info = stmt.run(fullName, email, hashedPassword, role);
    res.status(201).json({ id: info.lastInsertRowid, fullName, email, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT to update a user
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { fullName, email, role } = req.body;
  if (!fullName || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const stmt = db.prepare('UPDATE users SET fullName = ?, email = ?, role = ? WHERE id = ?');
    const info = stmt.run(fullName, email, role, id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id, fullName, email, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a user
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    // First, delete related enrollments
    const deleteEnrollmentsStmt = db.prepare('DELETE FROM enrollments WHERE studentId = ?');
    deleteEnrollmentsStmt.run(id);

    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
