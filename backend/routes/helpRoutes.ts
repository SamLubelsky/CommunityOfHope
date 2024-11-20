import express, { Router } from 'express';
import db from '../config/database';

const router = Router();

// Route to get all help requests
router.get('/help_requests', (req, res) => {
  db.all('SELECT mom_name, category FROM help_requests', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const formattedResponse = {
        Requests: rows.map(row => ({
          Name: row.mom_name,
          Category: row.category
        }))
      };
      res.json(formattedResponse);
    }
  });
});

// Route to create a new help request
router.post('/help_requests', (req, res) => {
  const { mom_id, mom_name, category, request } = req.body;
  db.run(
    'INSERT INTO help_requests (mom_id, mom_name, category, request) VALUES (?, ?, ?, ?)', 
    [mom_id, mom_name, category, request], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

export default router;