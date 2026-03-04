import { Router } from 'express';
import db from '../../database';

const router = Router();

// GET all events
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM events');
    const events = stmt.all();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new event
router.post('/', (req, res) => {
  const { title, description, dateTime, location, hoursAwarded, slotsAvailable, assignedSupervisorId, status } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO events (title, description, dateTime, location, hoursAwarded, slotsAvailable, assignedSupervisorId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(title, description, dateTime, location, hoursAwarded, slotsAvailable, assignedSupervisorId, status);
    res.status(201).json({ id: info.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT to update an event
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dateTime, location, hoursAwarded, slotsAvailable, assignedSupervisorId, status } = req.body;
  try {
    const stmt = db.prepare('UPDATE events SET title = ?, description = ?, dateTime = ?, location = ?, hoursAwarded = ?, slotsAvailable = ?, assignedSupervisorId = ?, status = ? WHERE id = ?');
    const info = stmt.run(title, description, dateTime, location, hoursAwarded, slotsAvailable, assignedSupervisorId, status, id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an event
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    // Also delete related enrollments
    const deleteEnrollmentsStmt = db.prepare('DELETE FROM enrollments WHERE eventId = ?');
    deleteEnrollmentsStmt.run(id);

    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a single event by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = stmt.get(id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
