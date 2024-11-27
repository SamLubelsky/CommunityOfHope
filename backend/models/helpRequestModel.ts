import db from '../config/database';

interface HelpRequest {
  id?: number;
  mom_id: number;
  title: string; 
  description: string;
  status: string;
  created_at?: string;
}

// Get all help requests
export const getAllHelpRequests = (): Promise<HelpRequest[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM help_requests', [], (err, rows) => {
      if (err) reject(err);
      resolve(rows as HelpRequest[]);
    });
  });
};

// Get help request by ID
export const getHelpRequestById = (id: number): Promise<HelpRequest> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM help_requests WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row as HelpRequest);
    });
  });
};

// Create new help request
export const createHelpRequest = (request: HelpRequest): Promise<number> => {
  return new Promise((resolve, reject) => {
    const { mom_id, title, description } = request;
    db.run(
      'INSERT INTO help_requests (mom_id, title, description, status) VALUES (?, ?, ?, ?)',
      [mom_id, title, description, 'pending'],
      function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};

// Update help request
export const updateHelpRequest = (id: number, updates: Partial<HelpRequest>): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { title, description, status } = updates;
    db.run(
      'UPDATE help_requests SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status) WHERE id = ?',
      [title, description, status, id],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

// Delete help request
export const deleteHelpRequest = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM help_requests WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};