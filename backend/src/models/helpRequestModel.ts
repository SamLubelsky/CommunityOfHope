import db from '../config/database';
import { executeQuery } from '../config/setupDatabase';
import { HelpRequest } from '../types/helpRequest';

export const getAllHelpRequests = async(): Promise<HelpRequest[]> => {
  const rows = await executeQuery(`SELECT help.id, help.mom_id, help.volunteer_id, help.description,
                                   vol.firstName || ' ' || vol.lastName as volunteer_name,
                                   mom.firstName || ' ' || mom.lastName as mom_name
                                    FROM help_requests help
                                      LEFT JOIN users vol
                                        ON vol.id = help.volunteer_id
                                      LEFT JOIN users mom
                                        ON mom.id = help.mom_id
                                    ORDER BY help.dateCreated DESC`, []);
  return rows;
};

export const getAllActiveHelpRequests = async(): Promise<HelpRequest[]> => {
  const rows = await executeQuery(`SELECT help.id, help.mom_id, help.volunteer_id, help.description,
    vol.firstName || ' ' || vol.lastName as volunteer_name,
    mom.firstName || ' ' || mom.lastName as mom_name
     FROM help_requests help
       LEFT JOIN users vol
         ON vol.id = help.volunteer_id
       LEFT JOIN users mom
         ON mom.id = help.mom_id
      WHERE help.active = TRUE
     ORDER BY help.dateCreated DESC`, []);
  return rows;
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