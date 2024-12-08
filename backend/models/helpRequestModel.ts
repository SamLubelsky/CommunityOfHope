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
// export const createUser = async (username: string, password: string, firstName: string, lastName: string, role: string) => {
//   const validationError = validateUserInput({ user: username, password, firstName, lastName, role });
//   if (validationError) {
//     return Promise.reject(new Error(validationError));
//   }

//   const existingUser = await findUserByUsername(username); 
//   if (existingUser) {
//     return Promise.reject(new Error('Username already exists'));
//   }
  
//   const hashedPass = bcrypt.hashSync(password, 10);
//   return new Promise((resolve, reject) => {
//     db.run(
//       'INSERT INTO users (username, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
//       [username, hashedPass, firstName, lastName, role],
//       function (err) {
//         if (err) {
//           reject(err);
//         } else {
//           resolve({ id: this.lastID });
//         }
//       }
//     );
//   });
// };
export const createHelpRequest = async (data: Partial<HelpRequest>): Promise<number> => {
  const { mom_id, description } = data;
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