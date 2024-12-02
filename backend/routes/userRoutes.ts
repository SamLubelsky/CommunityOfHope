import { Router } from 'express'
import { getUsers, addUser, loginUser, deleteUser, logoutUser, editUser, getUser } from '../controllers/userController'
import { requireAuth } from '../authMiddleware';

const router = Router();

router.get('/users', requireAuth('admin'), getUsers);
router.post('/users', requireAuth('admin'), addUser);
// npm run
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.delete('/users/:id',requireAuth('admin'), deleteUser);
router.delete('/logout', logoutUser);
router.put('/users/:id', requireAuth('admin'), editUser);
router.get('/users/:id', requireAuth('admin'), getUser)
export default router;