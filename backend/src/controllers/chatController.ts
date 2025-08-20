import { Request, Response } from 'express';
import { processChatMessage as processChat } from '../services/chatService';

export const processChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, currentCustomizations = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    console.log('Processing chat message:', message);
    
    const result = await processChat(message, currentCustomizations);
    
    res.json({
      success: true,
      response: result.response,
      customizations: result.customizations
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
};
