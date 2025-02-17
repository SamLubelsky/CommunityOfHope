import { Router } from 'express'
import { getUsers, addUser, loginUser, deleteUser, logoutUser, editUser, getUser, verifySession} from '../controllers/userController'
import { requireAuth, requireAdmin } from '../authMiddleware';
import { verify } from 'crypto';
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, "../../public/images"))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})
const router = Router();

router.get('/users', requireAdmin, getUsers);
router.post('/users', requireAdmin, upload.single("profilePic"), addUser); //is this how we add multiple middlewares?
// npm run
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/users/:id',requireAdmin, deleteUser);
router.post('/logout', logoutUser);
router.put('/users/:id', requireAdmin, upload.single("profilePic"), editUser);
router.get('/users/:id', requireAdmin, getUser);
router.post('/verify-session', requireAuth, verifySession);

export default router;