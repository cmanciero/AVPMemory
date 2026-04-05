import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAY_COUNTER_STORAGE_KEY = '@avp-memory-play-counter';

export async function incrementPlayCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(PLAY_COUNTER_STORAGE_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  const currentCount = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  const nextCount = currentCount + 1;

  await AsyncStorage.setItem(PLAY_COUNTER_STORAGE_KEY, String(nextCount));

  return nextCount;
}
