import express from 'express';
import db from '../config/database';

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Route to get all help requests
router.get('/help_requests', (req, res) => {
  db.all('SELECT * FROM help_requests', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ help_requests: rows });
    }
  });
});

// Route to create a new help request
router.post('/help_requests', (req, res) => {
  const { mom_id, request } = req.body;
  db.run('INSERT INTO help_requests (mom_id, request) VALUES (?, ?)', [mom_id, request], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

export default router;