import { Router } from 'express';
import {
  createUser,
  addFavoriteCity,
  removeFavoriteCity,
  getFavoriteCities
} from '../controllers/userController';

const router = Router();

router.post('/users', createUser);
router.post('/users/favorites', addFavoriteCity);
router.delete('/users/favorites', removeFavoriteCity);
router.get('/users/:email/favorites', getFavoriteCities);

export default router; 