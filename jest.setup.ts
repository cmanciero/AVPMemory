import '@testing-library/jest-native/extend-expect';

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-google-mobile-ads', () => ({
  MobileAds: jest.fn(() => ({
    initialize: jest.fn(async () => []),
  })),
  BannerAd: 'BannerAd',
  BannerAdSize: {
    ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  },
  InterstitialAd: {
    createForAdRequest: jest.fn(() => ({
      addAdEventListener: jest.fn(() => jest.fn()),
      load: jest.fn(),
      show: jest.fn(),
    })),
  },
  AdEventType: {
    LOADED: 'loaded',
    CLOSED: 'closed',
    ERROR: 'error',
  },
  TestIds: {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  },
}));

jest.mock('./src/ads/AdBanner', () => ({
  AdBanner: 'AdBanner',
  isNativeAdsAvailable: jest.fn(() => true),
  getAdsRuntimeMessage: jest.fn(() => 'Google Mobile Ads native module is available.'),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(async () => undefined),
  notificationAsync: jest.fn(async () => undefined),
  selectionAsync: jest.fn(async () => undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(async () => ({
        sound: {
          getStatusAsync: jest.fn(async () => ({ isLoaded: true })),
          setPositionAsync: jest.fn(async () => undefined),
          playAsync: jest.fn(async () => undefined),
        },
      })),
    },
  },
}));

jest.mock('expo-linear-gradient', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { LinearGradient: ({ children, style }: any) => React.createElement(View, { style }, children) };
});
