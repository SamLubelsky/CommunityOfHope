import { Router } from 'express'
import { getUsers, addUser, loginUser, deleteUser, logoutUser } from '../controllers/userController'
import { requireAuth } from '../authMiddleware';

const router = Router();

// Protected routes that need authentication
router.get('/users', requireAuth, getUsers);
router.delete('/users/:username', requireAuth, deleteUser);

// Public routes that don't need authentication
router.post('/users', addUser); // Remove requireAuth for user registration
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;