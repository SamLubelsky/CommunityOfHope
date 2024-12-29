import { validateUserInput } from '../utils/functions'
import {User} from "../utils/definitions"
import {executeQuery} from '../config/setupDatabase'
const bcrypt = require('bcrypt')

export const getAllUsers = async() => {
  const rows = await executeQuery('SELECT id, username, firstName AS "firstName", lastName AS "lastName", role FROM users', []);
  return rows;
};
export const getUserData = async (id: string): Promise<User> => {
  const row = await executeQuery('SELECT id, password, username, firstName AS "firstName", lastName AS "lastName", role FROM users where id=$1', [id]);
  if(row){
    return row[0];
  } else{
    return Promise.reject(new Error('User not found'));
  }
};

export const findUserByUsername = async (username: string): Promise<User> => {
  const row =  await executeQuery('SELECT id, password, username, firstName AS "firstName", lastName AS "lastName", role FROM users where username=$1', [username]); 
  if(row){
    return row[0];
  } else{
    return Promise.reject(new Error('User not found'));
  }
};
export const editUserInfo = async(username: string, password: string, firstName: string, lastName: string, role: string, id:string) => {
  const validationError = validateUserInput({ user: username, password, firstName, lastName, role });
  if(validationError){
    return Promise.reject(new Error(validationError));
  }
  const existingUser = await getUserData(id);
  if(!existingUser){
    return Promise.reject(new Error('User not found in database, try adding a user instead'));
  }
  const hashedPass = bcrypt.hashSync(password, 10);
  const query = 'UPDATE users SET username=$1, password=$2, firstName=$3, lastName=$4, role=$5 WHERE id=$6'
  const values = [username, hashedPass, firstName, lastName, role, id]
  return await executeQuery(query, values);
}
export const createUser = async (username: string, password: string, firstName: string, lastName: string, role: string) => {
  const validationError = validateUserInput({ user: username, password, firstName, lastName, role });
  if (validationError) {
    return Promise.reject(new Error(validationError));
  }

  const existingUser = await findUserByUsername(username); 
  if (existingUser) {
    return Promise.reject(new Error('Username already exists'));
  }
  
  const hashedPass = bcrypt.hashSync(password, 10);
  const query = 'INSERT INTO users (username, password, firstName, lastName, role) VALUES ($1, $2, $3, $4, $5)'
  const values = [username, hashedPass, firstName, lastName, role]
  executeQuery(query, values);
  return;
};

export const deleteUserByUsername = (username: string) => {
  executeQuery('DELETE FROM users WHERE username=$1', [username]);
  return;
};
export const deleteUserById = (id: string) => {
  executeQuery('DELETE FROM users WHERE id=$1', [id]);
  return;
};