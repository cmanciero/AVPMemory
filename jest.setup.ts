import '@testing-library/jest-native/extend-expect';

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-google-mobile-ads', () => ({
  BannerAd: 'BannerAd',
  BannerAdSize: {
    ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  },
  TestIds: {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
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

jest.mock('expo-linear-gradient', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { LinearGradient: ({ children, style }: any) => React.createElement(View, { style }, children) };
});
