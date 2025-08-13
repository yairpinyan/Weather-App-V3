import fs from 'fs/promises';
import path from 'path';
import { User, UsersData } from '../models/User';

const DATA_FILE = path.join(__dirname, '../../data/users.json');

// Ensure data directory exists
async function ensureDataDirectory() {
    const dataDir = path.dirname(DATA_FILE);
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await ensureDataDirectory();
        await fs.writeFile(DATA_FILE, JSON.stringify({ users: [] }));
    }
}

// Read users data
async function readUsersData(): Promise<UsersData> {
    await initializeDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

// Write users data
async function writeUsersData(data: UsersData): Promise<void> {
    await ensureDataDirectory();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
    const data = await readUsersData();
    return data.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

// Create new user
export async function createUser(email: string): Promise<User> {
    const data = await readUsersData();
    
    // Check if user already exists
    if (data.users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('User already exists');
    }

    const newUser: User = {
        email,
        favoriteCities: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    data.users.push(newUser);
    await writeUsersData(data);
    return newUser;
}

// Add favorite city
export async function addFavoriteCity(email: string, city: string): Promise<User> {
    const data = await readUsersData();
    const userIndex = data.users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    if (!data.users[userIndex].favoriteCities.includes(city)) {
        data.users[userIndex].favoriteCities.push(city);
        data.users[userIndex].updatedAt = new Date();
        await writeUsersData(data);
    }

    return data.users[userIndex];
}

// Remove favorite city
export async function removeFavoriteCity(email: string, city: string): Promise<User> {
    const data = await readUsersData();
    const userIndex = data.users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    const cityIndex = data.users[userIndex].favoriteCities.indexOf(city);
    if (cityIndex > -1) {
        data.users[userIndex].favoriteCities.splice(cityIndex, 1);
        data.users[userIndex].updatedAt = new Date();
        await writeUsersData(data);
    }

    return data.users[userIndex];
}

// Get user's favorite cities
export async function getFavoriteCities(email: string): Promise<string[]> {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    return user.favoriteCities;
} 