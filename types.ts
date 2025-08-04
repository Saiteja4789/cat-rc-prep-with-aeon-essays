export interface Essay {
  id: string;
  title: string;
  author: string;
  url: string;
  content: string;
  genre: string;
  duration: number; // in minutes
}

export interface VocabularyWord {
  word: string;
  definition: string;
  usageExample: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface User {
  name: string;
  email: string;
  password?: string; // Password should not be stored in client state long-term, but is needed for creation
  essaysRead: number;
  dayStreak: number;
  lastLoginDate: string; // ISO date string: 'YYYY-MM-DD'
  readEssayIds: string[];
}
