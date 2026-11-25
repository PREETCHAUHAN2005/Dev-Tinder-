# DevTinder frontend redesign

## Scope and source of truth

The existing repository is the authority for functionality. This change starts at commit `d5565736873eb554dba223596afcdc8c62ae8f28` and restyles the existing React application. Backend files, API URL, Redux modules, route paths, credentials handling, request payloads, Socket.IO events, and Razorpay order/verification contracts are preserved.

No new matching algorithm, presence tracking, location filters, subscriptions, AI functionality, or messaging endpoint is introduced. Pending, error, and success feedback use local presentation state.

## Reference review — 25 November 2026

1. Primary: [Tinder](https://tinder.com/).
2. Secondary: [micro1](https://www.micro1.ai/).

Both live public pages were retrieved. Tinder's official product illustration was also opened. The local browser failed to start, so a complete browser-based review of either site was unavailable. micro1's linked hero image could not be opened.

Observed in the available material:

| Reference | Observation | DevTinder application |
| --- | --- | --- |
| Tinder public page and official product illustration | Profiles, individual people, and connection actions are central; a clear account entry action appears in navigation. | Discover gives the profile image and name prominence, pairs existing Pass/Like actions, and presents an explicit mutual-match confirmation. Login has one clear primary submit action. |
| micro1 public page content | A short top-level headline leads into named content groups with compact explanations and clear next actions. | Consistent page headings, brief descriptions, grouped profile fields, and plainly described membership cards. |

The typography, exact spacing, dark surfaces, blue accent, sidebar, mobile navigation, breakpoints, and focus treatments are original implementation decisions for DevTinder. They are not claimed as direct visual observations of either reference. The existing Inter/Outfit fonts and blue identity are retained. No reference logos, imagery, or marketing text is copied.

## Screen coverage

| Existing screen | Presentation |
| --- | --- |
| Discover | Photo-led card stack, existing drag interaction and Pass/Like actions, actual profile skills, pending and failed-decision feedback. No unsupported location claims. |
| Match confirmation | Accessible dialog, message link, keep-discovering action, Escape dismissal, focus loop. The confirmation remains visible after the last card is removed. |
| Login / signup | Original developer illustration, labelled fields, preserved login/signup payloads and redirects, validation errors and submit feedback. |
| Profile | Grouped editor with existing fields and skill parsing, noninteractive live preview, saving/error/success feedback. |
| Connections | Consistent profile summaries with actual data and existing email/chat destinations. Static online indicators removed. |
| Requests | Existing accepted/rejected decisions with pending, failure, confirmation, and empty states. |
| Messages / thread | Inbox summaries and real unread counts, preserved history/send/socket logic, clearer message bubbles, empty/error/sending states. |
| Memberships | Server-provided prices, optional Silver/Gold plans, existing Razorpay handoff and verification, active-plan confirmation. No invented paid capabilities. |
| Contact | Styles the existing placeholder without inventing contact details or adding a form. |

## Structure and extension

- Shared visual values live in CSS custom properties at the start of `src/index.css`.
- Layout, type, states, and component styles use the `dt-` namespace.
- Reusable primitives live in `src/components/ui/`: Icon, Avatar, PageHeading, StatePanel, and MatchDialog.
- The Navbar destination list is the place to extend navigation when a real route is implemented.
- Feature request functions remain in their existing components; Redux and backend code remain independent of the presentation.
- The unused DaisyUI CSS plugin output is removed. Installed dependency versions and lockfiles remain unchanged.
- A DevTinder code-mark favicon replaces the Vite starter icon.

## Accessibility and responsive behavior

- Desktop sidebar; compact header and five-item navigation on smaller viewports.
- Inputs have associated labels and visible focus treatment.
- Decision buttons have text alternatives and disabled pending states.
- Images fall back to initials when absent or broken.
- Dialog focus stays within the confirmation and Escape dismisses it.
- Loading, error, and confirmation messages use status/alert semantics.
- Reduced-motion preferences suppress transitions and loading animation.
- Long names, skills, and message text can wrap at narrow widths.

## Verification

The workflow `.github/workflows/frontend-design-checks.yml` builds the frontend and runs the checks below. The contract comparison is scoped to this redesign branch so it does not freeze future feature work.

```sh
cd devtinder-frontend
npm ci
npm run build
node scripts/check-contracts.mjs origin/main
node scripts/check-lint.mjs origin/main
npm install --no-save --package-lock=false @playwright/test@1.56.1
npx playwright install chromium
npx playwright test
```

The browser suite uses synthetic API responses and a fake Razorpay constructor. It covers desktop and mobile screen rendering, viewport overflow, login/signup, profile editing, decisions and final-card matching, failed requests, empty states, request review, chat send failures/recovery, forbidden chat, both membership handoffs, logout/feed clearing, broken images, long content, and reduced motion. Screen captures and traces are available as workflow artifacts when a run completes.

The lint comparison reports existing baseline diagnostics and fails on an increase by file/rule/severity. It does not claim the existing codebase is lint-clean and does not disable rules.

Limits: mocked browser checks do not replace a live backend, authenticated socket server, or live payment verification test. Full reference-site visual inspection and direct local execution were unavailable in the task environment.
