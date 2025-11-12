## FurNest — Copilot instructions

This repository is a small Expo (React Native) app. The goal of these notes is to give an AI coding assistant the minimal, actionable context needed to make correct edits and add features.

Key files
- `App.tsx` — single entry navigator; contains functional screen components (`HomeScreen`, `DetailsScreen`) and the `createNativeStackNavigator` setup.
- `index.ts` — registers the root component with Expo (`registerRootComponent(App)`).
- `package.json` — uses Expo; scripts: `start`, `android`, `ios`, `web` (use `expo start` family).
- `tsconfig.json` — extends `expo/tsconfig.base` and enables `strict` TypeScript checks.

Architecture / Big picture
- Single-package Expo app using React Navigation (native stack). UI is composed of small functional screens exported/used in `App.tsx`.
- Navigation params are passed via `navigation.navigate('Details', { petId: 7 })` and read via `route.params` in the screen. Keep this convention when adding screens.
- Root wiring is in `index.ts` (do not change without updating Expo registration reasoning).

Developer workflows (how to run / debug)
- Start Metro (Expo) locally: `npm run start` (alias for `expo start`).
- Run on device/emulator: `npm run android` / `npm run ios` or open the URL in Expo Go.
- Web: `npm run web`.

Project-specific conventions
- Keep screens as small functional components in `App.tsx` for now. If adding many screens, create a `screens/` folder and export them into `App.tsx`'s navigator.
- Use TypeScript types where possible — `tsconfig.json` has `strict: true`. When adding navigation params, prefer declaring a navigation param type (e.g., a `RootStackParamList`) and use `NativeStackScreenProps` for typing.
- Styling is inline in the current files. Match the existing inline style pattern for small changes; extract to StyleSheet only when a component grows.

Dependencies / Integration points
- Expo SDK (see `package.json`) — use Expo CLI for builds and local dev.
- React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`) — modify navigator configuration in `App.tsx` when changing routes.

Examples (how to change or add things)
- Add a new screen:
  1. Create `screens/MyScreen.tsx` exporting a default functional component.
  2. Import and add `<Stack.Screen name="MyScreen" component={MyScreen} />` inside `App.tsx`'s `Stack.Navigator`.

- Read a navigation param in `DetailsScreen` (current pattern):
  const petId = route?.params?.petId ?? '-';

Notes / limitations discovered
- No test framework present — there are no `test` scripts or test files. If you add tests, include `jest` or `vitest` and add scripts to `package.json`.
- Project is small and opinionated (Expo + inline styles). Prefer minimal, non-invasive edits; keep the app runnable with `expo start`.

If anything here is incomplete or you'd like additional conventions (naming, folder structure, or linting rules), tell me which area to expand and I will update this file.
