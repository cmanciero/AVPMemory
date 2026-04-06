# AVP Memory Game (React Native)

A kid-friendly memory game for iOS and Android built with React Native + Expo.

## Features

- 3 difficulty levels:
  - Easy: 3 pairs (6 cards)
  - Medium: 4 pairs (8 cards)
  - Hard: 9 pairs (18 cards)
- Uses images from `assets/cards` with `avp-logo.png` as the card back
- Each game randomly selects pairs from the available front-image pool
- Consecutive games avoid reusing the exact same image set when spare images are available
- Scoreboard with level and completion time, stored locally
- Google AdMob banner displayed at the bottom
- Unit/UI tests with React Testing Library
- ESLint and Jest coverage support

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run app:

```bash
npm run start
npm run ios
npm run android
```

## Testing and Lint

```bash
npm run lint
npm run test
npm run test:coverage
```

## AdMob Notes

The app is configured with Google test IDs in `app.json` and uses `TestIds.BANNER` in development.
Before production release, replace test app IDs with your own AdMob app IDs.

## Store Release (Google Play + App Store)

### 1) One-time setup

```bash
npm install -g eas-cli
eas login
eas credentials
```

### 2) Pre-release checks

```bash
npm run lint
npm run test
```

### 3) Build production binaries

```bash
eas build -p android --profile production
eas build -p ios --profile production
```

### 4) Submit builds

```bash
eas submit -p android --profile production
eas submit -p ios --profile production
```

### Notes

- Android submissions target the internal testing track by default (`submit.production.android.track = internal` in `eas.json`).
- `build.production.autoIncrement` is enabled in `eas.json`, so store build numbers are incremented automatically on each production build.
- Keep `expo.version` in `app.json` aligned with your app release version.
