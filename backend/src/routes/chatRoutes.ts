import { Router } from 'express'
import { requireAuth } from '../authMiddleware';
import { getAllChats, getMessages, sendChat } from '../controllers/chatsController'

const router = Router();

router.get('/chats/:chatId', requireAuth, getMessages);
router.post('/chats', requireAuth, sendChat);
router.get('/chats', requireAuth, getAllChats);
export default router;