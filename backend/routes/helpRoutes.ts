import express, { Router } from 'express';
import db from '../config/database';

const router = Router();

// Route to get all help requests
type HelpRequest = {
  mom_name: string
  category: string
  id: number
}
router.get('/help_requests', (req, res) => {
  db.all('SELECT id, mom_name, category FROM help_requests', (err, rows: HelpRequest[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const formattedResponse = {
        Requests: rows.map(row => ({
          mom_name: row.mom_name,
          category: row.category,
          id: row.id,
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