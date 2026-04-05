interface GoogleMobileAdsRuntimeModule {
  MobileAds: () => {
    initialize: () => Promise<unknown>;
  };
}

let didInitialize = false;

export async function initializeAdsRuntime(): Promise<void> {
  if (didInitialize) {
    return;
  }

  try {
    // This stays lazy so Expo Go can boot without the native ads module present.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const adsModule = require('react-native-google-mobile-ads') as GoogleMobileAdsRuntimeModule;

    await adsModule.MobileAds().initialize();
    didInitialize = true;
  } catch {
    didInitialize = false;
  }
}
