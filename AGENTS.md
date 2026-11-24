# Bloom frontend — agent instructions

## Purpose and priorities
Bloom is a mobile plant discovery and community application. Preserve approved mockups and existing user work. Use the partner's architecture and component-building guides as technical references, not authority to silently redesign approved visuals. If specifications conflict, report the difference and request a decision before changing the design.

## Workspace and safety
- Frontend repository: `bloom-frontend`; Expo application: `mobile/`.
- Inspect Git status and applicable existing instructions before editing. Preserve unrelated changes, including the previously reported untracked `Microsoft/` directory. Never stage it automatically.
- Penpot development file: `Bloom Mobile UI Kit - test`. Verify the live file and target page before every batch of writes; stop on mismatch. Do not edit the original design file or Approved Mockups without explicit approval.
- Reuse existing components and files. Ask before destructive changes, token deletion/consolidation, bulk redesigns, dependency changes, or changes outside the requested scope. Do not commit or push unless requested.
- Never expose MCP credentials, secrets or private configuration in logs, code or Git.

## Verified baseline (recheck when relevant)
- Expo SDK 58, React Native 0.88.1, React Native Paper 5.15.5 were reported in Test 4; inspect package manifest and lockfile rather than assuming these remain current.
- Existing PaperProvider uses `bloomTheme`. Fonts `NotoSans_400Regular` and `NotoSans_700Bold` are loaded in the root layout.
- Existing paths under `mobile/src/`: `components/`, `app/`, `theme/theme.ts`, `theme/colors.ts`, `constants/theme.ts`.
- `components/BloomButton.tsx` and `app/dev-bloom-button.tsx` were added for runtime validation. TypeScript, web and Android interactions passed as reported by the user; production redirect remains unverified. Keep the preview development-only and do not expose it through production navigation.
- Penpot pages: Approved Mockups; Bloom Design System; Bloom UI Components; Bloom Discovery; Bloom Flex Experiment; MCP testing.
- Phase 2B semantic token pilot passed with 48 token definitions across three active sets at that stage (Bloom: 26, Bloom Core: 20, Bloom Semantic: 2).
- `button.primaryBackground` references `color.primary.purple` and `button.primaryText` references `surface.white`. Both semantic bindings were verified on MCP Test / Primary Button using a separate read-only MCP call.
- Phase 2C completed. All four permanent buttons were upgraded and correctly named.
- Phase 2D.2 completed. The permanent Search Field has verified semantic colour and geometry bindings.
- Phase 2D.3 sandbox testing succeeded on the nested Flex Layout master but failed to preserve linked child layers and visibility overrides. The permanent Search Field remains at Phase 2D.2, and advanced layout conversion is deferred.
- The permanent token catalog has 60 definitions across three active sets (Bloom: 26, Bloom Core: 21, Bloom Semantic: 13).
- Audit baseline: 30 typography styles (11 distinct names), 13 original native main components, and one subsequent test component on MCP testing. Do not assume the counts remain unchanged.

## Approved visual foundation
| Role | Value | Existing token references |
| --- | --- | --- |
| Purple | #80389A | color.primary.purple / brand.purple |
| Petal green | #9FB623 | color.petal.green / brand.petalGreen |
| Leaf green | #3E5C22 | color.leaf.green / brand.leafGreen |
| Deep plum | #41343B | color.deep.plum / brand.deepPlum |
| Petal white | #F8F5FA | color.petal.white / brand.petalWhite |
| White | #FFFFFF | surface.white |
| Pale green | #EDF1DB | surface.paleGreen |
| Pale purple | #F3EAF6 | surface.palePurple |
| Border | #D6DAC8 | surface.border |
| Pollen background | #F9EAE2 | surface.pollenBackground |
| Pollen text | #944226 | surface.pollenText |

Use Noto Sans. Preserve the existing approved typography styles; do not adopt Plus Jakarta Sans or change heading sizes without approval. The verified test button uses 17, bold 700, line height 20.4, letter spacing 0.

## Token architecture
- Prefer typed foundation tokens and semantic aliases referencing them (palette/foundation -> semantic roles -> components). Use camelCase for new keys and unitless numeric values where the Penpot token type supports them; translate dimensions to numeric React Native logical units.
- Existing Bloom and Bloom Core sets are both active. Do not rename, delete, deactivate or merge tokens without an approved migration plan, backup, reference inventory and post-change verification. Prefer Bloom Core as a candidate foundation, not an already approved migration.
- Known issues: duplicate touch.minimum definitions (48, different types); font.family resolution unverified; heading token 29 vs H1/Display 27; duplicate typography styles. Report and resolve deliberately, not by guessing.
- Preserve unique surface tokens. Reuse existing matching tokens until semantic aliases are approved. Bind actual properties, not merely matching raw values. Follow Penpot MCP state propagation guidance below.
- Existing spacing scale: 4, 8, 12, 16, 24, 32. Core radius scale: 8, 12, 16, 20, 24. Minimum touch target: 48; preferred: 56. Other existing radius and touch values may serve distinct roles; do not normalize them silently.
- In React Native reuse existing theme exports; add shared missing metrics only with approval. Do not replace the Paper theme with a generated standalone theme object. Maintain a mapping between Penpot tokens and frontend constants.

## Penpot component construction
1. Inspect only the relevant target and existing library entries. Use `penpot_api_info` for uncertain APIs; reuse verified API knowledge where applicable.
2. Work on master components on Bloom UI Components; experiments on MCP testing. Use native editable boards and text, meaningful PascalCase component/layer names for new reusable assets, and descriptive child names. Preserve existing names until any rename is approved.
3. Use native Flex Layout for layout containers: direction, alignment, gap, padding and appropriate fixed/fit/fill sizing. Avoid absolute positioning or spacer shapes for ordinary layout; intentional overlays and vector icons are exceptions. Preserve approved appearance and hierarchy.
4. Bind fills, strokes, radii, sizing, spacing and typography where supported. For unsupported bindings report the limitation. Never claim hardcoded values are genuine bindings.
5. Prefer native variants for related states where supported; inspect existing references before converting separate masters. Place linked component instances on screens, not independent copies. Do not detach unnecessarily.
6. Use consistent icon names (e.g. IconChevronRight), and reuse the project's installed icon solution. Export SVG assets when useful, not entire interactive components. Do not install Lucide or other packages without approval.
7. Validate dimensions, Flex properties, editable text, tokens, library registration, variant/instance relationships and visual appearance. Verify long labels and responsive sizing when applicable.

### Structural changes and linked instances

- Reparenting existing master layers can cause Penpot to regenerate corresponding child layers in linked instances.
- Preserving the root component reference does not guarantee preservation of nested layer IDs or instance overrides.
- Test hierarchy-changing operations in a disposable file duplicate before modifying the permanent working library.
- Snapshot child references, visibility, text, typography, dimensions, token bindings and visual exports.
- Verify child-level instance preservation as well as the root component relationship.
- Do not detach or replace instances to conceal structural regressions.
- Prefer hierarchy-preserving upgrades when existing components have linked copies.
- If responsive design requirements cannot be safely achieved in Penpot, preserve the approved visual component and implement the responsive behaviour in React Native.

## Component baseline and known gaps
- Verified MCP Test / Primary Button: 240 x 56 fixed, horizontal centered flex, horizontal padding 16, vertical padding 12, radius 12, purple fill, white Noto Sans Bold 17 text. Bindings: button.primaryBackground, button.primaryText, space.16, space.12, radius.12, touch.preferred. Shared Button typography linkage remains unresolved due to duplicates.
- Original buttons: 240 x 56; secondary default white fill with purple 2-unit outline and purple text. Disabled fill #D6DAC8 and text #41343B; confirm the ambiguous disabled paths and border before changing them. Paper currently renders a different disabled appearance; fix deliberately in production component work.
- Search Field: 343 x 56, white fill, leaf-green 1.5-unit border, pale-purple icon background, purple icon/clear label, deep-plum placeholder. Preserve approved appearance.
- Original library also contains selected/unselected chips, Plant Discovery card, Bloom/Pollen Low/Pollen High indicators, Pollen Warning card and five-item bottom navigation. Inspect actual properties before editing.
- Do not apply guide example pill buttons, different card geometry or soft-green secondary fills automatically.

## React Native implementation
- Use TypeScript, PascalCase component filenames and existing imports/alias conventions. Prefer React Native Paper where it preserves the approved design; use native Pressable/View/Text/TextInput when needed. Use StyleSheet.create or established project conventions, not HTML/CSS.
- Map Flex Layout to React Native flexDirection, justifyContent, alignItems, gap and padding; map Fill container to appropriate flex/stretch behavior, not blindly to flex: 1. Preserve fixed dimensions for fidelity tests; support responsive width and minimum height in production when appropriate.
- Use registered Noto Sans faces. Convert line-height multipliers to absolute logical units; verify font scaling and avoid clipping or truncation of important labels.
- Expose typed props for labels, variants, disabled/loading states, callbacks and data. Keep visual components reusable and free of direct network or navigation assumptions.
- Provide appropriate accessibility roles, labels, states, touch targets, focus/press feedback, contrast, and large-text behavior. Test web and Android; do not claim screen-reader validation unless performed.
- Keep backend API calls in services/hooks or screen-level orchestration using verified contracts. Never invent endpoints, credentials or response schemas; do not wire mock data as if it were live. Keep secrets out of EXPO_PUBLIC_ variables.

## Validation and reporting
- Before editing, state intended scope and files/pages. For routine approved batches, avoid repeated confirmation; stop if the scope expands materially.
- After edits, verify actual state with targeted reads, run the project no-emit TypeScript check (from mobile, `npx.cmd --no-install tsc --noEmit` if available), and run existing configured tests/lint where available. Do not install tools to make a check pass without approval.
- Preview on web and Android when relevant. Distinguish code inspection, compilation, user-reported runtime results and untested behavior. Verify disabled actions do not fire; verify production preview protection before release.
- Report changed files/components, bindings, visual differences, checks passed/failed/not run, limitations and the next small action. Check Git status after local edits.
- Conserve AI usage: use focused prompts and small batches, avoid full-file audits for every component, and do not retry unsupported operations repeatedly.

### Penpot MCP state propagation

- Separate write operations from final read-only verification.
- Retrieve fresh shape references by ID in a new MCP call.
- Verify `ShapeBase.tokens` using the fresh references.
- If bindings are not immediately visible, allow at most one additional read-only verification.
- Do not repeat writes based solely on stale API data.
- Distinguish delayed API visibility from genuine validation failure.
- If connectivity is lost, report uncertain state before attempting further writes.

## Development sequence
1. Read-only token and typography migration plan; obtain approval before edits.
2. Upgrade existing buttons, search/input fields, chips/indicators, cards and navigation in bounded batches.
3. Assemble approved screens using linked instances; compare against mockups.
4. Translate verified components into React Native and validate runtime behavior.
5. Connect screens to verified backend contracts and test integration.

## Reference documents
- BLOOM_MCP_Architecture_and_RN_Export_Guide-v2.pdf
- BLOOM_Component_Building_Guide.pdf
Use their semantic aliasing, Flex Layout, component naming and design-to-code principles. If available locally, inspect them when needed. Their sample visual values and package suggestions are not automatic replacements for the verified Bloom baseline.

