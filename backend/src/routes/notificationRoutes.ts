import { Router } from 'express'
import { requireAuth } from '../authMiddleware'
import { uploadToken } from '../controllers/notificationController'

const router = Router()

router.post('/upload-token', requireAuth, uploadToken)

export default router
