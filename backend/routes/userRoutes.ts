import { Router } from 'express'
import { getUsers, addUser, loginUser, deleteUser, logoutUser } from '../controllers/userController'
import { requireAuth } from '../authMiddleware';

const router = Router();

router.get('/users', getUsers);
router.post('/users', requireAuth, addUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.delete('/users/:username', deleteUser);

export default router;