export interface VocabularyItem {
  id: number;
  target: string; // English word
  native: string; // French/Native translation
  category: 'Basics' | 'Food' | 'Travel' | 'Business' | 'Social';
  image?: string;
}

export enum GameState {
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED',
  GAME_OVER = 'GAME_OVER'
}

export enum ExerciseType {
  QUIZ = 'QUIZ',
  SHADOWING = 'SHADOWING'
}

export interface UserStats {
  hearts: number;
  streak: number;
  xp: number;
}

export interface QuizOption {
  id: number;
  text: string;
}