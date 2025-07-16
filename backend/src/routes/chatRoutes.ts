import { Router } from 'express'
import { requireAdmin, requireAuth } from '../authMiddleware';
import { getUserChats, getAllChats, getMessages, sendChat, getChatInfo, getMessagesByChatId} from '../controllers/chatsController'

const router = Router();

router.get('/chats/all', requireAdmin, getAllChats);
router.get('/chats/:chatId', requireAuth, getMessages);
router.get('/chats/:chatId/info', requireAuth, getChatInfo); // Alias for getMessages
router.post('/chats', requireAuth, sendChat);
router.get('/chats', requireAuth, getUserChats);
router.get('/chats/:chatId/messages', requireAuth, getMessagesByChatId); // Alias for getMessages
 // Alias for getUserChats
export default router;