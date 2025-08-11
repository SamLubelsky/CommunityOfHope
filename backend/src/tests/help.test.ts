import { recreateTables } from '../config/database'
import { createUser } from '../models/userModel'
import {
  createHelpRequest,
  getAllActiveHelpRequests,
  acceptHelpRequest,
  unclaimHelpRequest,
} from '../models/helpRequestModel'
import { app, httpServer } from '../index'
import request from 'supertest'
import { interval } from '../notifications/notifications'
import {
  createMomUser,
  loginAsAdmin,
  loginAsMom,
  loginAsVolunteer,
} from './utils'
import { log, error } from 'console'
beforeEach(async () => {
  await recreateTables()
})

afterAll(async () => {
  await httpServer.close()
  clearInterval(interval)
})

// Helper function to create a test volunteer

// Helper function to create a test help request
async function createTestHelpRequest(momId: string) {
  const helpRequestData = {
    mom_id: momId,
    description: 'Test help request',
    emergency: false,
    placeId: 'ChIJ-Y7t-qm02IcRW-C7IsrqOb4',
    placeName: 'Test Location',
  } as any
  const id = await createHelpRequest(helpRequestData)
  return id
}
async function createHelpRequests() {
  const momData = await createMomUser('mom1')
  await createTestHelpRequest(momData.id)
  const momData2 = await createMomUser('mom2')
  await createTestHelpRequest(momData2.id)
  const momData3 = await createMomUser('mom3')
  await createTestHelpRequest(momData3.id)
}

describe('Help Requests API', () => {
  describe('Test getting all help requests', () => {
    test('Admin can get all help requests', async () => {
      await createHelpRequests()
      const adminData = await loginAsAdmin('Admin')
      const response = await request(app)
        .get('/api/help_requests')
        .set('Cookie', adminData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.Requests.length).toBe(3)
    })

    test('Non-admin access denied', async () => {
      const momData = await loginAsMom('Mom')
      const response = await request(app)
        .get('/api/help_requests')
        .set('Cookie', momData.cookie)
      expect(response.status).toBe(401)
    })
  })

  describe('Test getting unclaimed help requests', () => {
    test('Authenticated user can get unclaimed requests', async () => {
      const volunteerData = await loginAsVolunteer('Volunteer')
      await createHelpRequests()
      const response = await request(app)
        .get('/api/help_requests/unclaimed')
        .set('Cookie', volunteerData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.Requests.length).toBe(3)
    })

    test('Help requests that is unclaimed not shown to the user who has already unclaimed them', async () => {
      const volunteerData = await loginAsVolunteer('Volunteer')
      await createHelpRequests()

      await acceptHelpRequest('1', volunteerData.id)
      await unclaimHelpRequest('1', volunteerData.id)

      const response = await request(app)
        .get('/api/help_requests/unclaimed')
        .set('Cookie', volunteerData.cookie)
      expect(response.status).toBe(200)

      expect(response.body.Requests.length).toBe(2)
      expect(response.body.Requests[0].id).toBe(2)
      expect(response.body.Requests[1].id).toBe(3)

      const volunteerData2 = await loginAsVolunteer('Volunteer2')
      const response2 = await request(app)
        .get('/api/help_requests/unclaimed')
        .set('Cookie', volunteerData2.cookie)
      expect(response2.status).toBe(200)
      expect(response2.body.Requests.length).toBe(3)
    })
  })

  describe('Test creating help request', () => {
    test('Mom can create help request', async () => {
      const momData = await loginAsMom('Mom')
      const helpRequestData = {
        description: 'Test help request',
        emergency: false,
        placeId: 'ChIJ-Y7t-qm02IcRW-C7IsrqOb4',
        placeName: 'Test Location',
      }

      const response = await request(app)
        .post('/api/help_requests')
        .set('Cookie', momData.cookie)
        .send(helpRequestData)

      expect(response.status).toBe(201)
      console.log(response.body)
      expect(response.body).toHaveProperty('id')
    })

    test('Cannot create help request if you already have an active help request', async () => {
      const momData = await loginAsMom('Mom')
      const helpRequestData = {
        mom_id: momData.id,
        description: 'Test help request',
        emergency: false,
        placeId: 'ChIJ-Y7t-qm02IcRW-C7IsrqOb4',
        placeName: 'Test Location',
      }
      const response = await request(app)
        .post('/api/help_requests')
        .set('Cookie', momData.cookie)
        .send(helpRequestData)
      expect(response.status).toBe(201)
      const response2 = await request(app)
        .post('/api/help_requests')
        .set('Cookie', momData.cookie)
        .send(helpRequestData)
      expect(response2.status).toBe(400)
      expect(response2.body.error).toBe(
        'You already have an active help request',
      )
    })

    test('Non-mom role cannot create help request', async () => {
      const volunteerData = await loginAsVolunteer('Volunteer')
      const helpRequestData = {
        description: 'Test help request',
        emergency: false,
        placeId: 'ChIJ-Y7t-qm02IcRW-C7IsrqOb4',
        placeName: 'Test Location',
      }

      const response = await request(app)
        .post('/api/help_requests')
        .set('Cookie', volunteerData.cookie)
        .send(helpRequestData)

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Only moms can create help requests')
    })
  })

  describe('Test accepting help request', () => {
    test('Volunteer can accept help request', async () => {
      // Create mom and help request
      const momData = await createMomUser('mom1')
      const helpRequestId = await createTestHelpRequest(momData.id)
      // Volunteer accepts request
      const volunteerData = await loginAsVolunteer('Volunteer')

      const response = await request(app)
        .post(`/api/help_requests/${helpRequestId}`)
        .set('Cookie', volunteerData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Help request accepted successfully')
    })

    test('Cannot accept help request if you already have an accepted help request', async () => {
      const momData = await createMomUser('mom1')
      const helpRequestId = await createTestHelpRequest(momData.id)
      const volunteerData = await loginAsVolunteer('Volunteer')
      const response = await request(app)
        .post(`/api/help_requests/${helpRequestId}`)
        .set('Cookie', volunteerData.cookie)
      expect(response.status).toBe(200)
      const response2 = await request(app)
        .post(`/api/help_requests/${helpRequestId}`)
        .set('Cookie', volunteerData.cookie)
      expect(response2.status).toBe(400)
      expect(response2.body.error).toBe(
        'You have already accepted a help request',
      )
    })

    test('Mom cannot accept help request', async () => {
      const momData = await loginAsMom('Mom')
      const helpRequestId = await createTestHelpRequest(momData.id)
      const momData2 = await loginAsMom('Mom2')
      const response = await request(app)
        .post(`/api/help_requests/${helpRequestId}`)
        .set('Cookie', momData.cookie)
      expect(response.status).toBe(401)
    })
  })

  describe('Test deactivating help request', () => {
    test('Mom can deactivate her help request before it is accepted', async () => {
      const momData = await loginAsMom('Mom')
      await createTestHelpRequest(momData.id)
      const deactivateResponse = await request(app)
        .post('/api/help_requests/deactivate')
        .set('Cookie', momData.cookie)
      expect(deactivateResponse.status).toBe(200)
      expect(deactivateResponse.body.message).toBe(
        'Help request deactivated successfully',
      )
    })

    test('Mom can deactivate her help request after it is accepted', async () => {
      const momData = await loginAsMom('Mom')
      const helpRequestId = await createTestHelpRequest(momData.id)

      const volunteerData = await loginAsVolunteer('Volunteer')
      const acceptResponse = await request(app)
        .post(`/api/help_requests/${helpRequestId}`)
        .set('Cookie', volunteerData.cookie)
      expect(acceptResponse.status).toBe(200)

      const deactivateResponse = await request(app)
        .post('/api/help_requests/deactivate')
        .set('Cookie', momData.cookie)
      expect(deactivateResponse.status).toBe(200)
      expect(deactivateResponse.body.message).toBe(
        'Help request deactivated successfully',
      )
    })

    test('Volunteer can deactivate accepted help request', async () => {
      const momData = await createMomUser('mom1')
      const helpRequestId = await createTestHelpRequest(momData.id)

      const volunteerData = await loginAsVolunteer('Volunteer')
      const acceptResponse = await request(app)
        .post(`/api/help_requests/${helpRequestId}`)
        .set('Cookie', volunteerData.cookie)
      expect(acceptResponse.status).toBe(200)

      const deactivateResponse = await request(app)
        .post('/api/help_requests/deactivate')
        .set('Cookie', volunteerData.cookie)
      expect(deactivateResponse.status).toBe(200)
      expect(deactivateResponse.body.message).toBe(
        'Help request deactivated successfully',
      )
    })

    test('Volunteer cannot deactivate help request if they have not accepted it', async () => {
      const momData = await createMomUser('mom1')
      const helpRequestId = await createTestHelpRequest(momData.id)
      const volunteerData = await loginAsVolunteer('Volunteer')
      const deactivateResponse = await request(app)
        .post('/api/help_requests/deactivate')
        .set('Cookie', volunteerData.cookie)
      expect(deactivateResponse.status).toBe(400)
      expect(deactivateResponse.body.error).toBe(
        'You have not accepted any help requests',
      )
    })

    test('Mom cannot deactivate help request if they have not posted it', async () => {
      const momData = await loginAsMom('Mom')
      const deactivateResponse = await request(app)
        .post('/api/help_requests/deactivate')
        .set('Cookie', momData.cookie)
      expect(deactivateResponse.status).toBe(400)
      expect(deactivateResponse.body.error).toBe(
        'You have not posted any help requests',
      )
    })
  })

  describe('Test deactivating help request by ID', () => {
    test('Admin can deactivate help request by ID', async () => {
      const adminData = await loginAsAdmin('Admin')
      const momData = await createMomUser('mom1')
      const helpRequestId = await createTestHelpRequest(momData.id)

      const response = await request(app)
        .post(`/api/help_requests/deactivate/${helpRequestId}`)
        .set('Cookie', adminData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        'Help request deactivated successfully',
      )
    })

    test('Non-admin cannot deactivate by ID', async () => {
      const momData = await loginAsMom('Mom')
      const response = await request(app)
        .post('/api/help_requests/deactivate/1')
        .set('Cookie', momData.cookie)
      expect(response.status).toBe(401)
      expect(response.body.error).toBe(
        'Only admins can deactivate help requests',
      )
    })
  })

  describe('Test unclaiming help request', () => {
    test('Volunteer can unclaim accepted request', async () => {
      const momData = await createMomUser('mom1')
      const helpRequestId = await createTestHelpRequest(momData.id)

      const volunteerData = await loginAsVolunteer('Volunteer')
      await acceptHelpRequest(helpRequestId, volunteerData.id)

      const response = await request(app)
        .post('/api/help_requests/unclaim')
        .set('Cookie', volunteerData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Help request unclaimed successfully')
    })
  })

  describe('Test getting help status', () => {
    test('Volunteer gets status when no request accepted', async () => {
      const volunteerData = await loginAsVolunteer('Volunteer')

      const response = await request(app)
        .get('/api/help_status')
        .set('Cookie', volunteerData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.status).toBe('Not Accepted')
    })

    test('Mom gets status when no request posted', async () => {
      const momData = await loginAsMom('Mom')
      const response = await request(app)
        .get('/api/help_status')
        .set('Cookie', momData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.status).toBe('Not Requested')
    })

    test('Volunteer gets status when request accepted', async () => {
      const momData = await createMomUser('mom1')
      const helpRequestId = await createTestHelpRequest(momData.id)
      const volunteerData = await loginAsVolunteer('Volunteer')
      const acceptResponse = await request(app)
        .post(`/api/help_requests/${helpRequestId}`)
        .set('Cookie', volunteerData.cookie)
      expect(acceptResponse.status).toBe(200)
      const response = await request(app)
        .get('/api/help_status')
        .set('Cookie', volunteerData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.status).toBe('Accepted')
    })

    test('Mom gets status when request accepted', async () => {
      const momData = await loginAsMom('Mom')
      const helpRequestId = await createTestHelpRequest(momData.id)
      const volunteerData = await loginAsVolunteer('Volunteer')
      const acceptResponse = await request(app)
        .post(`/api/help_requests/${helpRequestId}`)
        .set('Cookie', volunteerData.cookie)
      expect(acceptResponse.status).toBe(200)
      const response = await request(app)
        .get('/api/help_status')
        .set('Cookie', momData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.status).toBe('Accepted')
    })
  })
})
