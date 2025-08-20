import { Router } from 'express';
import { processChatMessage } from '../controllers/chatController';

const router = Router();

// AI Chat Customization endpoint
router.post('/chat/customize', processChatMessage);

export default router;
