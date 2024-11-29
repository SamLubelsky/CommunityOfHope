import { Router } from 'express'
import { getUsers, addUser, loginUser, deleteUser, logoutUser, editUser, getUser } from '../controllers/userController'
import { requireAuth } from '../authMiddleware';

const router = Router();

router.get('/users', requireAuth, getUsers);
router.post('/users', requireAuth, addUser);
// npm run
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.delete('/users/:id', deleteUser);
router.delete('/logout', logoutUser);
router.put('/users/:id', requireAuth, editUser);
router.get('/users/:id', requireAuth, getUser)
export default router;