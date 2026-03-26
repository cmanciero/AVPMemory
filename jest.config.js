module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'App.tsx'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|expo-haptics|expo-linear-gradient|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-google-mobile-ads))',
  ],
};
