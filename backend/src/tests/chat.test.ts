import { recreateTables } from '../config/database'
import { app, httpServer } from '../index'
import request from 'supertest'
import { interval } from '../notifications/notifications'
import {
  createMomUser,
  loginAsAdmin,
  loginAsMom,
  loginAsVolunteer,
} from './utils'
beforeEach(async () => {
  await recreateTables()
})

afterAll(async () => {
  await httpServer.close()
  clearInterval(interval)
})
