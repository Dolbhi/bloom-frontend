# Bloom UI implementation guide

The Expo app in this repository implements Discovery, Plant Details, Seasons, Plant Submission, Alerts, Profile, Account, and Community Review. See the [mobile README](README.md) for setup and validation commands.

## Source architecture

| Path | Responsibility |
| --- | --- |
| [src/app](src/app) | Expo Router screens and layouts. Five bottom tabs contain the main flow. Plant Details is nested under Discovery, while Account and Community Review use the root stack. |
| [src/components](src/components) | Reusable Bloom presentation and controls. |
| [src/hooks](src/hooks) | Shared plant-list request lifecycle. |
| [src/utils](src/utils) | Shared calendar metadata. |
| [src/api](src/api) | Plant data contract and active mock adapter. |
| [src/data](src/data) | Sample plant records and fixture image references. |
| [src/types](src/types) | Plant UI model and its category and pollen-level types. |
| [src/theme](src/theme) | Bloom colours, Paper theme, and display typography. |
| [src/constants](src/constants) | Shared spacing, radii, and control sizes. |
| [assets](assets) | Brand artwork, bundled Lora fonts and license, sample photographs, and configured app icons and splash assets. |

## Reusable components

| Component | Responsibilities and interface |
| --- | --- |
| `BloomBottomNavigation` | Renders equal-width tabs from Expo Router’s `BottomTabBarProps`. Uses route descriptors, navigation events, and supplied left, right, and bottom insets. |
| `BloomButton` | Takes `label` and `onPress`. Supports primary and secondary variants, disabled state, optional width, and an accessible label. |
| `BloomFilterChip` | Controlled chip with `label`, `selected`, and `onPress`. Accepts tinted or solid selected treatments, disabled state, an accessible label, and optional label font size. |
| `BloomIndicator` | Displays `bloom`, `pollenLow`, or `pollenHigh` with an optional label override. Used by the status preview. |
| `BloomLogo` | Displays the approved flower and lowercase wordmark. It takes no props and exposes one accessible name. |
| `BloomPollenWarning` | Informational block with a `title` and `body`. The caller supplies the sample wording. |
| `BloomScreen` | Scrollable screen wrapper with children. Accepts a custom `header` or `title` and `subtitle` with optional `eyebrow` and `displayHeading`. Also supports `botanical`, `insetTop`, and `contentContainerStyle`. |
| `BloomSearchField` | Controlled `value` and `onChangeText` with a required accessible label. Supports an optional placeholder, clear and submit callbacks, and disabled state. |
| `MapPreview` | Illustrative map for a `featured` plant with an `onOpenPlant` callback. |
| `PlantTile` | Renders a `plant` with optional width and `onPress`. It can display as a static or interactive card. |

## Data access and calendar

[plantApi.ts](src/api/plantApi.ts) exposes asynchronous `listPlants()` and `getPlantById(id)`. The active adapter reads local fixtures. The [Plant model](src/types/plant.ts) supplies UI properties such as the image source, display-ready flowering window, and sample distance and pollen level.

[usePlantList.ts](src/hooks/usePlantList.ts) serves Discovery, Seasons, and Alerts. It starts in `loading`, then returns `success` with plants, `empty` for a successful empty collection, or `error` for a rejected request. Retry is accepted from `error` and restarts loading. Cleanup prevents obsolete results from updating the screen. Filtering and feedback presentation belong to each screen. Alerts can still show sample notices when plant references are unavailable.

[Plant Details](src/app/%28tabs%29/%28map%29/plants/%5Bid%5D.tsx) requests one plant by route ID. It distinguishes loading, success, missing (`null`), and request failure with retry. An ID change remounts the request-owning component, and cleanup discards obsolete results.

[calendar.ts](src/utils/calendar.ts) defines January through December once and derives numbers, abbreviations, and initials. The Plant contract uses 1 for January and 12 for December. Seasons owns overlap filtering for summer (December–February), autumn (March–May), winter (June–August), and spring (September–November). Plant Details checks its own timeline membership. Submission owns same-month and cross-year formatting, and preserves unknown or incomplete selections.

## Layout and design

- `BloomScreen` provides standard scrolling and gutters. Its optional botanical treatment adds the approved gradient and decorative artwork behind content.
- The wrapper applies the top safe-area edge by default. Account and Community Review pass `insetTop={false}` because their opaque stack headers account for the top inset. They retain 16 units of content padding. The correction passed TypeScript and a web export. Android visual confirmation remains pending.
- Discovery adapts its plant grid at 360 logical units. Seasons has independent scrolling month and season selectors. Bottom navigation items share the available width. Keep wrapping and font scaling in mind when changing these layouts.
- Use the Bloom Paper theme, Lora display styles, and Noto Sans interface styles. Reuse `Spacing`, `Radii`, and `ControlSize` from [constants/theme.ts](src/constants/theme.ts). The shared sizing constants provide a 48-unit minimum touch target and a preferred 56-unit button height.

## Development previews and integration boundaries

The [mobile README](README.md#local-data-and-previews) lists `dev-bloom-button`, `dev-bloom-inputs`, `dev-bloom-plant-card`, and `dev-bloom-status`. They are guarded by `__DEV__` and contain a production redirect to Discovery. Runtime verification of that redirect is still pending.

The current frontend uses local plant discovery, fixture photos, an illustrative map, and example pollen notices. Sighting previews do not upload or persist submissions. Account validates demonstration input locally, Profile is a guest view, and Community Review decisions remain in local state. No backend connection has been verified. Map backend responses into the existing UI model at the adapter boundary once the team has agreed on the API contract.

## Contributing

Follow the [repository instructions](../AGENTS.md) and [mobile instructions](AGENTS.md). Preserve shared component APIs and keep screen-specific logic local. Share logic when it serves multiple consumers with the same behavior. Keep changes small and independently verifiable, and exclude generated output and secrets from Git.
