import { Router } from 'express'
import { requireAdmin, requireAuth } from '../authMiddleware';
import { getUserChats, getAllChats, getMessages, sendChat } from '../controllers/chatsController'

const router = Router();

router.get('/chats/:chatId', requireAuth, getMessages);
router.post('/chats', requireAuth, sendChat);
router.get('/chats', requireAuth, getUserChats);
router.get('/chats/all', requireAdmin, getAllChats); // Alias for getUserChats
export default router;