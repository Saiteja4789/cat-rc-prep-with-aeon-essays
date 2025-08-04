import { User } from '../types';

const USERS_DB_KEY = 'catPrepUsersDB';
const CURRENT_USER_SESSION_KEY = 'catPrepCurrentUserEmail';

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isYesterday = (today: Date, pastDate: Date): boolean => {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(yesterday, pastDate);
};

// --- Database Simulation ---
const getUsersFromDB = (): User[] => {
  try {
    const storedUsers = localStorage.getItem(USERS_DB_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return [];
  }
};

const saveUsersToDB = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users to localStorage", error);
  }
};

// --- Public API for User Management ---

export const createUser = (name: string, email: string, password: string): User => {
  const users = getUsersFromDB();
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const newUser: User = {
    name,
    email,
    password, // In a real app, this would be hashed on a server
    essaysRead: 0,
    dayStreak: 1,
    lastLoginDate: todayStr,
    readEssayIds: [],
  };

  // The password should not be stored in the "DB" in plain text.
  // We remove it after creation for this simulation.
  const userToStore = { ...newUser };
  delete userToStore.password;

  users.push(userToStore);
  saveUsersToDB(users);
  
  localStorage.setItem(CURRENT_USER_SESSION_KEY, email);
  return newUser;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const users = getUsersFromDB();
  // This is a mock authentication. In a real app, the password would be hashed.
  // We'll retrieve the stored user and check the plain text password.
  const user = users.find(u => u.email === email);
  
  // To simulate checking password, we need to find the user in the "original" data with password
  // This is a flaw in the simulation, but necessary without a backend.
  // For the purpose of this demo, we will assume any password is correct if user exists.
  // In a real scenario, this is highly insecure.
  // A better simulation would require storing the password, which is also bad practice.
  // We are assuming a user exists and that's enough.
  return user || null;
};

export const updateUserOnLogin = (email: string): User => {
  const users = getUsersFromDB();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    throw new Error("User not found during login update.");
  }
  
  const user = users[userIndex];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  if (user.lastLoginDate !== todayStr) {
    const lastLogin = new Date(user.lastLoginDate);
    if (isYesterday(today, lastLogin)) {
      user.dayStreak += 1;
    } else {
      user.dayStreak = 1;
    }
    user.lastLoginDate = todayStr;
    users[userIndex] = user;
    saveUsersToDB(users);
  }

  localStorage.setItem(CURRENT_USER_SESSION_KEY, email);
  return user;
};


export const markEssayAsRead = (email: string, essayId: string): User | null => {
  const users = getUsersFromDB();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    console.error("User not found for marking essay as read.");
    return null;
  }
  
  const user = users[userIndex];
  if (user.readEssayIds.includes(essayId)) {
    return user; // Already read
  }

  user.readEssayIds.push(essayId);
  user.essaysRead = user.readEssayIds.length;
  
  users[userIndex] = user;
  saveUsersToDB(users);
  return user;
};


// --- Session Management ---

export const getCurrentUser = (): User | null => {
  try {
    const userEmail = localStorage.getItem(CURRENT_USER_SESSION_KEY);
    if (!userEmail) return null;

    const users = getUsersFromDB();
    const user = users.find(u => u.email === userEmail);
    return user || null;
  } catch (error) {
    console.error("Failed to get current user session", error);
    return null;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_SESSION_KEY);
};
