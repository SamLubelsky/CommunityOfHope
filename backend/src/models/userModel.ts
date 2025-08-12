import { validateUserInput } from '../utils/functions'
import { User } from '../utils/definitions'
import { executeQuery } from '../config/database'
const bcrypt = require('bcrypt')

export const getAllUsers = async () => {
  const rows = await executeQuery(
    'SELECT id, username, firstName AS "firstName", lastName AS "lastName", role, profileLink AS "profileLink" FROM users',
    [],
  )
  return rows
}
export const getAllVolunteers = async (): Promise<User[]> => {
  const rows = await executeQuery(
    'SELECT id, username, firstName AS "firstName", lastName AS "lastName", role, profileLink AS "profileLink" FROM users WHERE role=$1',
    ['Volunteer'],
  )
  return rows
}
export const getUserData = async (id: string): Promise<User> => {
  const row = await executeQuery(
    'SELECT id, password, username, firstName AS "firstName", lastName AS "lastName", role, profileLink AS "profileLink" FROM users where id=$1',
    [id],
  )
  if (row) {
    return row[0]
  } else {
    return Promise.reject(new Error('User not found'))
  }
}

export const findUserByUsername = async (username: string): Promise<User> => {
  const row = await executeQuery(
    'SELECT id, password, username, firstName AS "firstName", lastName AS "lastName", role FROM users where username=$1',
    [username],
  )
  if (row) {
    return row[0]
  } else {
    return Promise.reject(new Error('User not found'))
  }
}
export const editUserInfo = async (
  username: string,
  hashedPass: string,
  firstName: string,
  lastName: string,
  role: string,
  id: string,
  profileLink: string,
) => {
  return await executeQuery(
    'UPDATE users SET username=$1, password=$2, firstName=$3, lastName=$4, role=$5, profileLink=$6 WHERE id=$7',
    [username, hashedPass, firstName, lastName, role, profileLink, id],
  )
}
export const createUser = async (
  username: string,
  hashedPass: string,
  firstName: string,
  lastName: string,
  role: string,
  profileLink: string,
) => {
  const result = await executeQuery(
    'INSERT INTO users (username, password, firstName, lastName, role, profileLink) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, firstName, lastName, role, profileLink',
    [username, hashedPass, firstName, lastName, role, profileLink],
  )
  return result[0]
}

export const deleteUserByUsername = (username: string) => {
  executeQuery('DELETE FROM users WHERE username=$1', [username])
  return
}
export const deleteUserById = (id: string) => {
  executeQuery('DELETE FROM users WHERE id=$1', [id])
  return
}
