import AsyncStorage from '@react-native-async-storage/async-storage';

import { Difficulty, ScoreEntry } from '../types';

const SCOREBOARD_STORAGE_KEY = '@avp-memory-scoreboard';

export async function getScoreboardEntries(): Promise<ScoreEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(SCOREBOARD_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ScoreEntry[];

    return parsed.sort((a, b) => a.completionMs - b.completionMs);
  } catch {
    return [];
  }
}

export async function addScoreboardEntry(level: Difficulty, completionMs: number): Promise<void> {
  const existing = await getScoreboardEntries();

  const entry: ScoreEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level,
    completionMs,
    createdAt: new Date().toISOString(),
  };

  const next = [...existing, entry]
    .sort((a, b) => a.completionMs - b.completionMs)
    .slice(0, 50);

  await AsyncStorage.setItem(SCOREBOARD_STORAGE_KEY, JSON.stringify(next));
}
