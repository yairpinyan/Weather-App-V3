export interface User {
  email: string;
  favoriteCities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersData {
  users: User[];
} 