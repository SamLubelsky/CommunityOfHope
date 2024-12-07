import { Router } from 'express';
import { getHelpRequests, addHelpRequest, getActiveHelpRequests, deactivateRequest } from '../controllers/helpController';
import { requireAuth } from '../authMiddleware';

const router = Router();
// Protected routes
router.get('/help_requests', requireAuth, getHelpRequests);
router.get('/help_requests/active', requireAuth, getActiveHelpRequests);
router.post('/help_requests/:id/deactivate', requireAuth, deactivateRequest);

// Public routes
router.post('/help_requests', addHelpRequest);

export default router;