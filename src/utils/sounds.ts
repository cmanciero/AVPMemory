/**
 * Feedback utility with haptics and win music.
 */
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as Haptics from 'expo-haptics';

export type SoundKey = 'tap' | 'flip' | 'match' | 'win';

let winSoundPromise: Promise<Audio.Sound | null> | null = null;

async function getWinSound(): Promise<Audio.Sound | null> {
  if (!winSoundPromise) {
    winSoundPromise = Audio.Sound.createAsync(require('../../assets/sounds/win.wav')).then(({ sound }) => sound).catch(() => null);
  }

  return winSoundPromise;
}

async function playWinMusic(): Promise<void> {
  const sound = await getWinSound();

  if (!sound) {
    return;
  }

  const status = await sound.getStatusAsync();

  if ((status as AVPlaybackStatus).isLoaded) {
    await sound.setPositionAsync(0);
    await sound.playAsync();
  }
}

export async function playFeedback(key: SoundKey): Promise<void> {
  try {
    switch (key) {
      case 'tap':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'flip':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'match':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'win':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await playWinMusic();
        break;
    }
  } catch {
    // Haptics not supported on this device – fail silently
  }
}
