import { ImageSourcePropType } from 'react-native';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CardTemplate {
  id: string;
  image: ImageSourcePropType;
}

export interface GameCard {
  key: string;
  pairId: string;
  image: ImageSourcePropType;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface ScoreEntry {
  id: string;
  level: Difficulty;
  completionMs: number;
  createdAt: string;
}
