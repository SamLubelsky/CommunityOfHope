import { Router } from 'express'
import {
  deactivateRequestById,
  getRequestStatus,
  getHelpRequests,
  addHelpRequest,
  getActiveHelpRequests,
  acceptRequest,
  deactivateRequest,
  unclaimRequest,
  getUnclaimed,
} from '../controllers/helpController'
import { requireAuth, requireAdmin, requireVolunteer } from '../authMiddleware'

const router = Router()
// Protected routes
router.get('/help_requests', requireAdmin, getHelpRequests)
router.get('/help_requests/unclaimed', requireAuth, getUnclaimed)
router.post('/help_requests/unclaim', requireAuth, unclaimRequest)
router.post('/help_requests/deactivate', requireAuth, deactivateRequest)
router.post('/help_requests/deactivate/:id', requireAuth, deactivateRequestById)
router.post('/help_requests/:id', requireVolunteer, acceptRequest)
router.post('/help_requests', requireAuth, addHelpRequest)
router.get('/help_status', requireAuth, getRequestStatus)

export default router
