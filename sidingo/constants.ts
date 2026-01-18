import { VocabularyItem } from './types';

// Top frequent English words for beginners (A1/A2)
// Using French as the support language based on the region context implied
export const vocabularyDatabase: VocabularyItem[] = [
  { id: 1, target: "Water", native: "L'eau", category: "Food", image: "https://picsum.photos/id/10/150/150" },
  { id: 2, target: "Hello", native: "Bonjour", category: "Basics", image: "https://picsum.photos/id/338/150/150" },
  { id: 3, target: "To Eat", native: "Manger", category: "Food", image: "https://picsum.photos/id/292/150/150" },
  { id: 4, target: "Car", native: "Voiture", category: "Travel", image: "https://picsum.photos/id/111/150/150" },
  { id: 5, target: "Friend", native: "Ami", category: "Social", image: "https://picsum.photos/id/157/150/150" },
  { id: 6, target: "Thank you", native: "Merci", category: "Basics" },
  { id: 7, target: "Please", native: "S'il vous plaît", category: "Basics" },
  { id: 8, target: "Good morning", native: "Bonjour (Matin)", category: "Basics" },
  { id: 9, target: "Why?", native: "Pourquoi ?", category: "Basics" },
  { id: 10, target: "Because", native: "Parce que", category: "Basics" },
  { id: 11, target: "To Speak", native: "Parler", category: "Social" },
  { id: 12, target: "Coffee", native: "Café", category: "Food" },
  { id: 13, target: "Work", native: "Travail", category: "Business" },
  { id: 14, target: "Yes", native: "Oui", category: "Basics" },
  { id: 15, target: "No", native: "Non", category: "Basics" },
  { id: 16, target: "I don't understand", native: "Je ne comprends pas", category: "Basics" },
  { id: 17, target: "Train", native: "Train", category: "Travel" },
  { id: 18, target: "Airport", native: "Aéroport", category: "Travel" },
  { id: 19, target: "Money", native: "Argent", category: "Business" },
  { id: 20, target: "Happy", native: "Heureux", category: "Social" },
];

export const MAX_HEARTS = 5;
export const XP_PER_QUIZ = 10;
export const XP_PER_SHADOWING = 20; // Higher reward for speaking
export const XP_BONUS_COMPLETE = 50;