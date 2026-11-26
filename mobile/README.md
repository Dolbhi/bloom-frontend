# Bloom mobile

This Expo SDK 58 app uses React Native, Expo Router, and React Native Paper. Run the commands below from `mobile/`.

## Setup and run

Use Node.js 22.13 or newer and npm. The handoff checks ran with Node.js 22.16.0 and npm 11.6.2. Use a browser for web development or an Expo Go client compatible with SDK 58 on a supported device. [Expo SDK version requirements](https://docs.expo.dev/versions/v58.0.0/#each-expo-sdk-version-depends-on-a-react-native-version)

| Task | Windows PowerShell | Other shells |
| --- | --- | --- |
| Install from the committed lockfile | `npm.cmd ci` | `npm ci` |
| Start web | `npm.cmd run web` | `npm run web` |
| Start for Expo Go | `npm.cmd start -- --go` | `npm start -- --go` |
| Type-check without emitting files | `npm.cmd run typecheck` | `npm run typecheck` |
| Also check unused locals and parameters | `npm.cmd run typecheck:strict` | `npm run typecheck:strict` |

To open the app in Expo Go, connect the phone and development machine to the same network and scan the terminal QR code. Starting Expo also generates the route types used by TypeScript. The Android and iOS launch scripts invoke Expo’s device or simulator workflow. Production Android and iOS builds have not been verified. [Expo CLI launch targets](https://docs.expo.dev/more/expo-cli/#launch-target)

The existing `lint` script invokes Expo lint, but this checkout has no ESLint configuration or installed ESLint executable. Use the two TypeScript scripts for repeatable checks while lint setup is pending.

## Local data and previews

Plant data comes from the local mock adapter. Startup requires no API URL, credentials, or environment file.

| Development route | Preview |
| --- | --- |
| `/dev-bloom-button` | Button variants and interactions |
| `/dev-bloom-inputs` | Search field and filter chips |
| `/dev-bloom-plant-card` | Plant tiles |
| `/dev-bloom-status` | Status indicators and pollen warnings |

Open these paths on the development web server. Each route has a source-level `__DEV__` guard that redirects to Discovery in production. Production redirect behavior still needs runtime verification.

[The mobile ignore rules](.gitignore) cover `.env`, `.env.development`, `.env.test`, and `.env.production` at the app root, along with files matching `.env*.local`. Template names such as `.env.example` remain eligible for tracking. Keep credentials and generated files out of Git.

See the [implementation guide](BLOOM_UI_IMPLEMENTATION_GUIDE.md) for architecture and integration boundaries.
