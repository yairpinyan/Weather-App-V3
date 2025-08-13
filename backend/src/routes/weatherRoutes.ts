import { Router } from 'express';
import { getWeather, getBulkWeather, reverseGeocode } from '../controllers/weatherController';

const router = Router();

router.get('/weather/:city', getWeather);
router.post('/weather/bulk', getBulkWeather);
router.get('/reverse', reverseGeocode);

export default router; 