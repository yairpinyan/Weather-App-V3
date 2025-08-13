import { Request, Response } from 'express';
import * as dataService from '../services/dataService';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await dataService.createUser(email);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: (error as Error).message });
  }
};

export const addFavoriteCity = async (req: Request, res: Response) => {
  try {
    const { email, city } = req.body;
    const user = await dataService.addFavoriteCity(email, city);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error adding favorite city', error: (error as Error).message });
  }
};

export const removeFavoriteCity = async (req: Request, res: Response) => {
  try {
    const { email, city } = req.body;
    const user = await dataService.removeFavoriteCity(email, city);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error removing favorite city', error: (error as Error).message });
  }
};

export const getFavoriteCities = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const cities = await dataService.getFavoriteCities(email);
    res.json(cities);
  } catch (error) {
    res.status(400).json({ message: 'Error getting favorite cities', error: (error as Error).message });
  }
}; 