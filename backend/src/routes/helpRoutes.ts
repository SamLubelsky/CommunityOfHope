import { Router } from 'express';
import { getHelpRequests, addHelpRequest, getActiveHelpRequests, acceptRequest } from '../controllers/helpController';
import { requireAuth, requireAdmin } from '../authMiddleware';

const router = Router();
// Protected routes
router.get('/help_requests', requireAdmin, getHelpRequests);
router.get('/help_requests/active', requireAuth, getActiveHelpRequests);
router.post('/help_requests/:id', requireAuth, acceptRequest);
router.post('/help_requests', requireAuth, addHelpRequest);

export default router;