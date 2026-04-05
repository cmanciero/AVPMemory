import { Platform } from 'react-native';

interface InterstitialAdInstance {
  addAdEventListener: (eventType: string, listener: () => void) => () => void;
  load: () => void;
  show: () => void;
}

interface GoogleMobileAdsInterstitialModule {
  InterstitialAd: {
    createForAdRequest: (
      unitId: string,
      requestOptions?: {
        requestNonPersonalizedAdsOnly?: boolean;
      },
    ) => InterstitialAdInstance;
  };
  AdEventType: {
    LOADED: string;
    CLOSED: string;
    ERROR: string;
  };
  TestIds: {
    INTERSTITIAL: string;
  };
}

const INTERSTITIAL_AD_FREQUENCY = 5;
const INTERSTITIAL_TIMEOUT_MS = 7000;

const PRODUCTION_INTERSTITIAL_UNIT_IDS = {
  ios: 'ca-app-pub-9243961400167403~7235573943',
  android: 'ca-app-pub-9243961400167403~7451196368',
} as const;

let adsModule: GoogleMobileAdsInterstitialModule | null = null;

try {
  // This stays lazy so Expo Go can boot without the native ads module present.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  adsModule = require('react-native-google-mobile-ads') as GoogleMobileAdsInterstitialModule;
} catch {
  adsModule = null;
}

export function shouldShowInterstitialForPlay(playCount: number): boolean {
  return playCount > 0 && playCount % INTERSTITIAL_AD_FREQUENCY === 0;
}

export async function showInterstitialAd(): Promise<void> {
  if (!adsModule) {
    return;
  }

  const { InterstitialAd, AdEventType, TestIds } = adsModule;
  const interstitial = InterstitialAd.createForAdRequest(getInterstitialUnitId(TestIds.INTERSTITIAL), {
    requestNonPersonalizedAdsOnly: true,
  });

  await new Promise<void>((resolve) => {
    let resolved = false;
    const unsubscribe: Array<() => void> = [];

    const finish = () => {
      if (resolved) {
        return;
      }

      resolved = true;
      unsubscribe.forEach((removeListener) => removeListener());
      resolve();
    };

    unsubscribe.push(
      interstitial.addAdEventListener(AdEventType.LOADED, () => {
        interstitial.show();
      }),
    );
    unsubscribe.push(interstitial.addAdEventListener(AdEventType.CLOSED, finish));
    unsubscribe.push(interstitial.addAdEventListener(AdEventType.ERROR, finish));

    // Prevents the game flow from getting stuck if no ad event is emitted.
    const timeout = setTimeout(finish, INTERSTITIAL_TIMEOUT_MS);
    unsubscribe.push(() => clearTimeout(timeout));

    interstitial.load();
  });
}

function getInterstitialUnitId(testId: string): string {
  if (__DEV__) {
    return testId;
  }

  const productionUnitId = Platform.select({
    ios: PRODUCTION_INTERSTITIAL_UNIT_IDS.ios,
    android: PRODUCTION_INTERSTITIAL_UNIT_IDS.android,
    default: testId,
  });

  // Keep serving test ads until real IDs are configured and valid.
  if (!isValidAdUnitId(productionUnitId)) {
    return testId;
  }

  return productionUnitId;
}

function isValidAdUnitId(value: string): boolean {
  // Ad unit IDs must contain "/". App IDs contain "~" and are invalid here.
  if (!value.includes('/')) {
    return false;
  }

  return !value.includes('xxxxxxxx');
}
