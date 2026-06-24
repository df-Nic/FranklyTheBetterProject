# OCBC Wealth Progression — Prototype Development Plan

## Overview

A feature implementation plan for the Wealth Progression experience, built on top of the existing React Native OCBC app (found in the `OCBC-Banking` folder). The core goal is to help customers grow their wealth to become eligible for higher banking tiers (e.g., Basic → Premier Banking). All new screens are integrated using React Native, Tamagui for styling, and Expo Router for navigation. The prototype covers: tier progression dashboard, AI-driven profiling, Tinder-style risk swiping, within-product fund narrowing, CTA + compliance gate, and a unified dashboard — with a persistent AI chat overlay throughout. All data outside of AI calls is mocked locally.

---

## Tech Stack & Constraints

| Layer | Choice | Reason |
|---|---|---|
| Base app | Existing React Native Expo app (`OCBC-Banking` folder) | Feature injected into existing Expo structure |
| Styling | Tamagui | Consistent, performant UI/UX design matching the current folder |
| Animation | React Native Reanimated / Tamagui Animations | Smooth transitions, swipe cards, and screen animations |
| AI Logic | Mocked locally via timeouts | Simulates AI Assistant + Select For Me + fund narrowing |
| Navigation | Expo Router | Native routing within the existing `app` directory structure |
| Feature state | React `useReducer` / Zustand (local) | Scoped to Wealth flow; does not touch app-level state |
| Persistence | `AsyncStorage` / `SecureStore` | Save profile between sessions for returning user flow |
| Data | Hardcoded mocks | No backend; all portfolio/holding data is simulated |

---

## Screen Map & Component Breakdown

```
EXISTING APP (OCBC-Banking)
├── app/
│   ├── (tabs)/index.tsx  ←─ Entry Point widget injected here
│   └── ...
│
WEALTH PROGRESSION FEATURE (new components, local state)
├── TierProgressionDashboard [S3]  Visualizes current banking tier and target tier (e.g., Basic -> Premier)
│
├── ONBOARDING FLOW (first-time)
│   ├── PrimaryQuestionsScreen   [S4]  One-pager, 6 questions
│   ├── RiskSwipeScreen          [S5]  Tinder-style scenario cards (6–8)
│   └── WealthProductSelection   [S6]  Curated product cards + AI "Select For Me"
│
├── WITHIN-PRODUCT FLOW (Unit Trust example)
│   ├── FundNarrowingScreen      [S7]  Max 3 AI-filtered fund cards
│   └── CTAScreen                [S8]  Amount, projection, compliance gate
│
├── DASHBOARD                    [S9]  Holdings view + Tier Progress Tracker
│
└── RETURNING USER FLOW         [S10]  Single question → skip or re-profile

PERSISTENT COMPONENTS (mounted in feature wrapper)
├── AIAssistantFAB          Floating action button, all screens post-S3
└── AIAssistantOverlay      Chat drawer (Tamagui Sheet), never navigates away
```

---

## Phase 1 — Entry Point & Tier Progression Dashboard

**Goal:** Inject the feature into the existing React Native app. Introduce the goal of growing wealth to unlock higher banking tiers.

### Context

The base Expo app already exists in `OCBC-Banking`. Phase 1 scopes only the new surfaces that sit on top of it using Tamagui. All data is mocked locally.

### Tasks

- [ ] **P1.1** Add an entry widget to the existing home screen. Renders an interactive Tamagui component highlighting the user's current banking tier and the next tier milestone.
- [ ] **P1.2** Implement tap transition: on tap, route to `TierProgressionDashboard` via Expo Router.
- [ ] **P1.3** Build `TierProgressionDashboard`. Visualizes a progress bar towards the next banking tier (e.g., "$10,000 more in AUM to unlock Premier Banking").
- [ ] **P1.4** Include 4 action cards: **Grow Wealth** (active), Protect Wealth, Save, Plan. "Start your investment journey" CTA button below Grow Wealth card routes into the onboarding flow.

---

## Phase 2 — Onboarding: Primary Questions

**Goal:** Capture user profile across 6 questions on a single scrollable screen.

### Tasks

- [ ] **P2.1** Build `PrimaryQuestionsScreen` — vertical `ScrollView`, progress dots at top.
- [ ] **P2.2** Each question renders as Tamagui pill-button multi-choice groups (single select). Questions:
  1. Age range: 20s / 30s / 40s / 50s+
  2. Monthly income: SGD 3–5k / 5–10k / 10–20k / 20k+
  3. Invest amount now: SGD 1–5k / 5–20k / 20–50k / 50k+
  4. Outstanding loans: Mortgage / Car loan / Personal loan / None
  5. Target Tier Timeline: 1-3 years / 3-5 years / 5+ years
  6. Market interest: Singapore / Asia / Global / No preference
- [ ] **P2.3** "Continue" button activates only after all 6 answered. Stores answers to `userProfile` state object.
- [ ] **P2.4** Persist `userProfile` to `AsyncStorage` (key: `ocbc_wealth_profile`).

---

## Phase 3 — Risk Profiling: Tinder Swipe Cards

**Goal:** 6–8 scenario cards determine risk appetite without jargon, utilizing React Native Reanimated for swipe gestures.

### Tasks

- [ ] **P3.1** Build `RiskSwipeScreen` with a stacked card deck UI using Reanimated.
- [ ] **P3.2** Each card: scenario headline + 2-line description, no financial jargon. Swipe right = accept/agree, swipe left = avoid/decline. Show left/right affordance labels.
- [ ] **P3.3** 8 scenario cards (hardcoded):
  1. "A new café opens near you. You invest SGD 5,000 in their first funding round knowing 3 in 5 such cafés close within two years."
  2. "Your fund dropped 15% this month due to global news. You hold and wait."
  3. "You lock away SGD 10,000 for 5 years at a guaranteed 3% p.a. with no early withdrawal."
  4. "An index fund has returned 8% annually for 10 years. You put in half your savings."
  5. "A tech stock you own doubles in a week. You sell half to lock in gains."
  6. "Your portfolio is flat for 18 months. You stay invested."
  7. "A colleague made 40% on crypto last year. You allocate 10% of savings to try it."
  8. "You choose a lower but guaranteed return over a higher but uncertain one."
- [ ] **P3.4** Score responses: risk-seeking answers +1, risk-averse answers 0. Map total to: 0–2 = Conservative, 3–5 = Balanced, 6–8 = Growth. Store `riskProfile` in `userProfile`.

---

## Phase 4 — Wealth Product Selection

**Goal:** 7 product cards + AI "Select For Me", mapped to how they accelerate tier progression.

### Tasks

- [ ] **P4.1** Build `WealthProductSelection` screen — scrollable list of 7 Tamagui cards.
- [ ] **P4.2** Each card emphasizes how it helps reach the next banking tier (e.g. "Accelerate your path to Premier").
- [ ] **P4.3** "Select For Me" button (bottom, sticky): simulates an AI call locally using `userProfile`, returning a hardcoded best-match product after a brief delay. Displays result as a highlighted card.
- [ ] **P4.4** On product tap (or AI selection confirm), route to `FundNarrowingScreen`.

---

## Phase 5 — Within-Product Narrowing (Unit Trust)

**Goal:** AI silently filters to max 3 fund recommendations; inline Ask about this chat.

### Tasks

- [ ] **P5.1** Build `FundNarrowingScreen`. On mount, simulate an AI filtering process using `userProfile` + `riskProfile` + `selectedProduct` to return hardcoded fund cards.
- [ ] **P5.2** Each fund card: fund name, asset class badge, 1-line plain reason, and inline "Ask about this →" button.
- [ ] **P5.3** "Ask about this" opens a bottom sheet (Tamagui Sheet) — slides up from bottom. User types question, mock AI responds with a predefined conversational script.
- [ ] **P5.4** Tapping a fund card routes to `CTAScreen`.

---

## Phase 6 — CTA Screen & Compliance Gate

**Goal:** Pre-filled investment amount, projection (including tier unlock projection), one-tap invest.

### Tasks

- [ ] **P6.1** Build `CTAScreen`.
- [ ] **P6.2** Pre-fill amount from `userProfile.investAmount`. Amount is editable via a number input.
- [ ] **P6.3** Projection display: "In 3 years this could grow to SGD X, unlocking Premier Banking."
- [ ] **P6.4** Compliance gate — simple checkbox for MAS Risk Acknowledgment.
- [ ] **P6.5** "Invest Now" button: triggers success animation, then routes to `Dashboard`.

---

## Phase 7 — AI Assistant (Persistent Chat)

**Goal:** Floating button + overlay chat available on screens.

### Tasks

- [ ] **P7.1** Build `AIAssistantFAB`: circular Tamagui button, bottom-right.
- [ ] **P7.2** Build `AIAssistantOverlay` using Tamagui Sheet/Modal. Chat history, text input, send button.
- [ ] **P7.3** Mock AI matches keywords in the user's message and returns predefined conversational replies based on `currentScreen` context.
- [ ] **P7.4** Conversation history maintained within session.

---

## Phase 8 — Dashboard

**Goal:** Unified wealth holdings view with a persistent tier progression tracker.

### Tasks

- [ ] **P8.1** Build `Dashboard` screen. Default: holdings for wealth products only.
- [ ] **P8.2** Top widget: Tier Progression Tracker (e.g., "$5,000 away from Premier").
- [ ] **P8.3** Holding cards (simulated data): Unit Trust value, RoboInvest portfolio value, etc.
- [ ] **P8.4** AI nudge cards: "Adding $500/month will unlock your new tier 6 months earlier."

---

## Phase 9 — Returning User Flow

**Goal:** Skip profiling; surface one check-in question.

### Tasks

- [ ] **P9.1** On app load, read `AsyncStorage` for `ocbc_wealth_profile`.
- [ ] **P9.2** Returning user skips S4 and S5. Goes directly to Dashboard or Product Selection.
- [ ] **P9.3** Surface a dismissible banner: "Has your goal to reach Premier Banking changed?"

---

## Data & State Architecture

```typescript
interface AppState {
  currentScreen: string;
  userProfile: {
    ageRange: string;
    incomeRange: string;
    investAmount: string;
    loans: string;
    targetTierTimeline: string;
    marketPreference: string;
    riskProfile: 'Conservative' | 'Balanced' | 'Growth';
    existingInvestor: boolean;
    sessionCount: number;
  };
  selectedProduct: string | null;
  selectedFund: object | null;
  returningUser: boolean;
}
```

---

## Build Order (Recommended)

```text
Phase 1 → Phase 8 (Dashboard Shell) → Phase 7 (AI Chat) → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 9
```

Rationale: Phase 1 establishes the Expo entry point and tier visualization. The Dashboard (Phase 8) gives the final destination shape early on. The AI Chat (Phase 7) is a core cross-cutting concern. Then follow the linear user onboarding flow (Phases 2-6) before adding persistence logic (Phase 9).

---

## Prototype Scope & Constraints

**In scope:**
- Self-contained Wealth Progression feature components injected into the existing React Native app
- Simulated AI features (Select For Me, Fund Narrowing, AI Assistant Chat) using hardcoded responses
- Persistent returning-user detection via `AsyncStorage`
- Tier progression logic and tracker
- Mobile viewport matching existing app dimensions

**Out of scope:**
- Real MAS compliance (prototype only — add disclaimer banner)
- Live portfolio or account data — all holdings are hardcoded mocks

**Prototype disclaimer banner** (render on all Wealth Progression screens):
> "This is a prototype for demonstration only. Not financial advice. No real transactions are made."
