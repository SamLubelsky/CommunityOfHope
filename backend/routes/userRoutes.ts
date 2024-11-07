import { Router } from 'express'
import { getUsers, addUser, loginUser } from '../controllers/userController'

const router = Router();

router.get('/users', getUsers);
router.post('/users', addUser);
router.post('/login', loginUser);

export default router;