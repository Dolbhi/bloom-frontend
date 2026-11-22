# Project guide for agents

# THIS GUIDE IS NOT FINISHED

## Stack
- Expo (React Native)
- Design tokens: /design/tokens.json (exported from Figma), components in /mobile/src/ui

## Commands
- Install: `npm ci` in each package
- Test: `npm test` (backend), `npm run test:mobile`
- Lint/typecheck: `npm run lint && npm run typecheck`
- DB migrate (dev only): `npx prisma migrate dev`

## Rules
- Work on a branch named `trello/<shortlink>-<slug>`. Never push to main.
- Every change needs tests. Run the test and lint commands before opening a PR.
- Never modify files in /design/tokens.json without a linked design change.
- Never read or write .env files or production credentials.
- Database migrations must be additive unless the issue explicitly says otherwise.
- PR descriptions must include: linked issue, summary, test results, and screenshots for UI changes.
