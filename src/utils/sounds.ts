/**
 * Feedback utility — haptic feedback fires on all supported devices out of the box.
 *
 * To enable audio sounds, add the following files to assets/sounds/ and then
 * uncomment the expo-av block at the bottom of this file:
 *
 *   assets/sounds/tap.mp3      — short click (button presses)
 *   assets/sounds/flip.mp3     — soft whoosh (card flip)
 *   assets/sounds/match.mp3    — cheerful chime (successful match)
 *   assets/sounds/win.mp3      — celebratory fanfare (game won)
 *
 * Run:  npx expo install expo-av
 */
import * as Haptics from 'expo-haptics';

export type SoundKey = 'tap' | 'flip' | 'match' | 'win';

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
        break;
    }
  } catch {
    // Haptics not supported on this device – fail silently
  }
}
