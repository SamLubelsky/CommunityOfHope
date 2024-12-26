import db from '../config/database';
import { executeQuery } from '../config/setupDatabase';
import { HelpRequest } from '../types/helpRequest';

export const getAllHelpRequests = async(): Promise<HelpRequest[]> => {
  const rows = await executeQuery('SELECT id, mom_id, volunteer_id, description FROM help_requests', []);
  return rows;
  return new Promise((resolve, reject) => {
    db.all('SELECT id, mom_id, volunteer_id, description FROM help_requests', (err, rows) => {
      if (err) reject(err);
      resolve(rows as HelpRequest[]);
    });
  });
};

export const getAllActiveHelpRequests = async(): Promise<HelpRequest[]> => {
  const rows = await executeQuery('SELECT * FROM help_requests WHERE active = 1',[])
  return rows;
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM help_requests WHERE active = 1', (err, rows) => {
      if (err) reject(err);
      resolve(rows as HelpRequest[]);
    });
  });
};
export const getHelpRequest = async(id: string): Promise<HelpRequest> => {
  const rows = await executeQuery('SELECT * FROM help_requests WHERE id=$1', [id]);
  if(rows){
    return rows[0];
  } else{
    return Promise.reject(new Error('Help Request not found'));
  }
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM help_requests WHERE id=?', (err, rows) => {
      if (err) reject(err);
      resolve(rows[0] as HelpRequest);
    });
  });
};


export const deactivateHelpRequest = async(id: string): Promise<void> => {
  await executeQuery('UPDATE help_requests SET active = FALSE WHERE id = $1', [id]);
  return;
  return new Promise((resolve, reject) => {
    db.run('UPDATE help_requests SET active = 0 WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};
export const createHelpRequest = async (data: HelpRequest): Promise<any> => {
  const { mom_id, description } = data;
  await executeQuery('INSERT INTO help_requests (mom_id, description, active) VALUES ($1, $2, TRUE)', [mom_id, description]);
  return;
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO help_requests (mom_id, description, active) VALUES (?, ?, 1)',
      [mom_id, description],
      function(err) {
        if (err) {
          reject(err);
        }
        else{
          resolve(this.lastID);
        }
      }
    );
  });
};

// Add other model functions (getById, update, delete)...