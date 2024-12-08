import { Router } from 'express'
import { getUsers, addUser, loginUser, deleteUser, logoutUser, editUser, getUser, verifySession} from '../controllers/userController'
import { requireAuth, requireAdmin } from '../authMiddleware';
import { verify } from 'crypto';

const router = Router();

router.get('/users', getUsers);
router.post('/users', requireAdmin, addUser);
// npm run
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.delete('/users/:id',requireAdmin, deleteUser);
router.delete('/logout', logoutUser);
router.put('/users/:id', requireAdmin, editUser);
router.get('/users/:id', requireAdmin, getUser);
router.put('/verify-session', requireAuth, verifySession);

export default router;