import { Router } from 'express'
import { requireAuth } from '../authMiddleware';
import { getMessages, sendChat } from '../controllers/chatsController'

const router = Router();

router.get('/chats/:volunteerId/:momId', requireAuth, getMessages);
router.post('/chats', requireAuth, sendChat);