import { Router } from 'express';
import { getRequestStatus, getHelpRequests, addHelpRequest, getActiveHelpRequests, acceptRequest, deactivateRequest } from '../controllers/helpController';
import { requireAuth, requireAdmin } from '../authMiddleware';

const router = Router();
// Protected routes
router.get('/help_requests', requireAdmin, getHelpRequests);
router.get('/help_requests/active', requireAuth, getActiveHelpRequests);
router.post('/help_requests/deactivate/', requireAuth, deactivateRequest);
router.post('/help_requests/:id', requireAuth, acceptRequest);
router.post('/help_requests', requireAuth, addHelpRequest);
router.get('/help_status', requireAuth, getRequestStatus);
export default router;