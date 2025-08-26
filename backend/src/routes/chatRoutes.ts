import express from 'express';
import { processChatMessage } from '../controllers/chatController';

const router = express.Router();

// AI Chat Customization endpoint
router.post('/chat', processChatMessage);

export default router;
