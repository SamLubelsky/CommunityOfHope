import { Router } from 'express'
import { getUsers, addUser, loginUser, deleteUser, logoutUser, editUser, getUser, verifySession} from '../controllers/userController'
import { requireAuth, requireAdmin } from '../authMiddleware';
import { verify } from 'crypto';

const router = Router();

router.get('/users', requireAdmin, getUsers);
router.post('/users', requireAdmin, addUser);
// npm run
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.delete('/users/:id',requireAdmin, deleteUser);
router.post('/logout', logoutUser);
router.put('/users/:id', requireAdmin, editUser);
router.get('/users/:id', requireAdmin, getUser);
router.post('/verify-session', requireAuth, verifySession);

export default router;