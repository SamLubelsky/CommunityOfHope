import { Router } from 'express'
import { getUsers, addUser, loginUser, deleteUser } from '../controllers/userController'

const router = Router();

router.get('/users', getUsers);
router.post('/users', addUser);
router.post('/login', loginUser);
router.delete('/users/:username', deleteUser);

export default router;