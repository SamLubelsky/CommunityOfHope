import { get } from 'http'
import { executeQuery } from '../config/database'
import { HelpRequest } from '../types/helpRequest'

export const getAllHelpRequests = async (): Promise<HelpRequest[]> => {
  const rows = await executeQuery(
    `SELECT help.active, help.id, help.mom_id, help.volunteer_id, help.description, help.emergency, help.placeId as "placeId",
                                   help.placeName as "placeName",
                                   vol.firstName || ' ' || vol.lastName as volunteer_name,
                                   mom.firstName || ' ' || mom.lastName as mom_name
                                    FROM help_requests help
                                      LEFT JOIN users vol
                                        ON vol.id = help.volunteer_id
                                      LEFT JOIN users mom
                                        ON mom.id = help.mom_id
                                    ORDER BY help.dateCreated DESC`,
    [],
  )
  return rows
}

export const getAllActiveHelpRequests = async (): Promise<HelpRequest[]> => {
  const rows = await executeQuery(
    `SELECT help.id, help.mom_id, help.volunteer_id, help.description, help.emergency, help.placeId as "placeId",
    help.placeName as "placeName",
    vol.firstName || ' ' || vol.lastName as volunteer_name,
    mom.firstName || ' ' || mom.lastName as mom_name
     FROM help_requests help
       LEFT JOIN users vol
         ON vol.id = help.volunteer_id
       LEFT JOIN users mom
         ON mom.id = help.mom_id
      WHERE help.active = TRUE
     ORDER BY help.dateCreated ASC`,
    [],
  )
  return rows
}

export const getUnclaimedHelpRequests = async (
  userId: string,
): Promise<HelpRequest[]> => {
  //get all help requests that are active and have no volunteer assigned yet, put longest waiting first, put all emergency requests first
  //if a user has already unclaimed a request, don't show it to them
  const rows = await executeQuery(
    `SELECT help.id, help.mom_id, help.volunteer_id, help.description, help.emergency, help.placeId as "placeId",
    help.placeName as "placeName",
    vol.firstName || ' ' || vol.lastName as volunteer_name,
    mom.firstName || ' ' || mom.lastName as mom_name
     FROM help_requests help
      LEFT JOIN users vol
        ON vol.id = help.volunteer_id
      LEFT JOIN users mom
        ON mom.id = help.mom_id
      LEFT JOIN unclaimedHistory unc
        ON unc.helpID = help.id AND unc.userId = $1
      WHERE 
        help.active = TRUE 
        AND help.volunteer_id IS NULL
        AND unc.helpId is NULL   
      ORDER BY 
        help.emergency DESC,
        help.dateCreated ASC`,
    [userId],
  )
  return rows
}

export const getHelpRequest = async (
  helpRequestId: string,
): Promise<HelpRequest> => {
  const rows = await executeQuery('SELECT * FROM help_requests WHERE id=$1', [
    helpRequestId,
  ])
  if (rows) {
    return rows[0]
  } else {
    return Promise.reject(new Error('Help Request not found'))
  }
}

export const acceptHelpRequest = async (
  helpRequestId: string,
  volunteerId: string,
): Promise<void> => {
  await executeQuery(
    'UPDATE help_requests SET volunteer_id = $1 WHERE id = $2',
    [volunteerId, helpRequestId],
  )
  return
}

export const deactivateHelpRequest = async (
  helpRequestId: string,
): Promise<void> => {
  await executeQuery('UPDATE help_requests SET active = FALSE WHERE id = $1', [
    helpRequestId,
  ])
  return
}

export const unclaimHelpRequest = async (
  helpRequestId: string,
  volunteerId: string,
): Promise<void> => {
  await executeQuery(
    'UPDATE help_requests SET volunteer_id = NULL WHERE id = $1',
    [helpRequestId],
  )
  await executeQuery(
    'INSERT INTO unclaimedHistory (helpId, userId) VALUES ($1, $2)',
    [helpRequestId, volunteerId],
  )
  return
}

export const createHelpRequest = async (data: HelpRequest): Promise<any> => {
  const { mom_id, description, emergency, placeId, placeName } = data
  const activeHelpRequests = await executeQuery(
    'SELECT * FROM help_requests WHERE mom_id = $1 AND active = TRUE',
    [mom_id],
  )
  if (activeHelpRequests.length > 0) {
    return Promise.reject(new Error('Mom already has an active help request'))
  }
  const rows = await executeQuery(
    'INSERT INTO help_requests (mom_id, description, emergency, placeId, placeName, active) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING id',
    [mom_id, description, emergency, placeId, placeName],
  )
  return rows[0].id
}
