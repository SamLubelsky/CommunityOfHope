import db from '../config/database';
import { HelpRequest } from '../types/helpRequest';

export const getAllHelpRequests = (): Promise<HelpRequest[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, mom_id, volunteer_id, description FROM help_requests', (err, rows) => {
      if (err) reject(err);
      resolve(rows as HelpRequest[]);
    });
  });
};

export const getAllActiveHelpRequests = (): Promise<HelpRequest[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM help_requests WHERE active = 1', (err, rows) => {
      if (err) reject(err);
      resolve(rows as HelpRequest[]);
    });
  });
};

export const deactivateHelpRequest = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE help_requests SET active = 0 WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

export const createHelpRequest = (data: Partial<HelpRequest>): Promise<number> => {
  const { mom_id, description, request } = data;
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO help_requests (mom_id, description, request, active) VALUES (?, ?, ?, 1)',
      [mom_id, description, request],
      function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};

// Add other model functions (getById, update, delete)...