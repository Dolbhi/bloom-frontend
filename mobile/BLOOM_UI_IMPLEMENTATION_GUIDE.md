# Bloom mobile UI demo — setup and test guide

This is **a source-code overlay** for the Expo project in your existing `bloom-frontend/mobile` folder. It is **not** a second Expo project. The package reproduces the approved Bloom flow in React Native/React Native Paper with the final flower palette, five bottom tabs, and eight layout views (Discovery, Plant Details, Seasons, Submit, Alerts, Profile, Account, Community Review). It does not include the production backend.

> This is a best-effort mockup interpretation, not a pixel-perfect export of the UI kit. Please compare every screen against your team's approved reference images tomorrow before accepting the appearance.

## Before copying

- Make sure `bloom-frontend/mobile` already runs in Expo Go (you previously confirmed this).
- In VS Code, stop Expo (`Ctrl+C`) and save your work.
- In the repo root, check `git status` and your branch. Commit any unfinished changes or back them up before copying files.
- Create a separate development branch if appropriate: `git switch -c feature/bloom-mockup-ui` (only if this branch doesn't already exist).
- This package assumes the Expo Router app directory is `mobile/src/app` as in your generated starter. **Do not run `create-expo-app` again.**

## Dependencies

From the VS Code PowerShell terminal in `bloom-frontend/mobile`:

```powershell
npm.cmd install react-native-paper
npx.cmd expo install react-native-safe-area-context expo-font expo-splash-screen expo-image-picker
npm.cmd install @expo-google-fonts/noto-sans
```

Expo's default template already includes `expo-router`, `@expo/vector-icons` and `expo-status-bar`. If one is missing, check `mobile/package.json` and Expo's docs before installing a compatible version.

## Copy source files

1. Extract this ZIP to a temporary folder. You will see `src`, `assets` and this guide.
2. Inside your current `bloom-frontend/mobile`, preserve the generated `package.json`, `package-lock.json`, `app.json`, and `tsconfig.json`.
3. Copy/merge the ZIP's `src` folder into **`bloom-frontend/mobile/src`**. Accept replacement of `src/app/_layout.tsx` and `src/app/(tabs)/*` if those files exist, **only after checking they contain no teammate's work**.
4. Copy/merge the ZIP's `assets` folder into **`bloom-frontend/mobile/assets`**.
5. The original default Expo template currently has `mobile/src/app/index.tsx` and `mobile/src/app/explore.tsx`. Once you have backed them up in Git, delete just those two **starter routes** if they still contain Expo sample content. This avoids route collisions with the new Discovery home (`src/app/(tabs)/(map)/index.tsx`). Leave the other template `src/components/*` files alone for now.
6. Optional: delete the ZIP's unused `src/components/ComingSoonScreen.tsx` (you don't need it for this walkthrough).

Keep the rest of your Expo starter; don't delete `node_modules`, lockfiles or config files. Don't copy any nested `.git` folder.

## Run

```powershell
npx.cmd expo install --check
npx.cmd expo start --clear
# Once Expo has generated route types, open a second terminal in mobile:
npx.cmd tsc --noEmit
```

Open Expo Go on your phone and scan the QR code. If you see a module error, verify the packages above were installed inside `mobile`, not in the repository root.

## Walkthrough to test with your partner

1. **Map:** Discover sample plants, search `lilac`, toggle category chips and the pollen filter. Tap Cherry Blossom in either map illustration or card.
2. **Plant Details:** See photo, flower months, pollen label, sample location and community notes. Go back to the Map tab. Check that bottom tabs remain visible.
3. **Seasons:** Change the month chips. View plants in the selected window and open a detail screen.
4. **Submit:** Choose one photo from the phone library, type a name and location, and tap **Preview sighting**. Confirm the dialog says no data was uploaded.
5. **Alerts:** Switch between All/Blooms/Pollen sample notices.
6. **Profile:** Open Account (UI-only) and Community Review. Try the review buttons; notice changes are only local.
7. **Accessibility:** Set phone font size larger, test screen scrolling and larger tap targets. Read titles and warnings without zooming.

## What's intentionally not implemented

- No backend connection, database, accounts, stored sighting, community approval, push notifications or real pollen data.
- The map is an illustrated placeholder; map pins and distances are fictional. No GPS or live map SDK.
- Flower pictures are low-resolution crops retained from the previous Bloom reference; replace them with approved photos/assets before production.
- For account preview **do not enter a real password**. This demo cannot log in.

The `src/api/plantApi.ts` interface isolates mock data; the backend team can later provide API endpoints and data schemas while screens continue to use the same interface.

## Git after testing

From `bloom-frontend` repository root:

```powershell
git status
git add mobile
git commit -m "feat: build Bloom mockup UI demo with sample data"
git push -u origin feature/bloom-mockup-ui
```

Replace the push branch name with `git branch --show-current` if you chose another branch. Do not push `node_modules`, secrets or Expo cache. Keep the UI branch separate from your teammate's branch and open a pull request when ready for review.
