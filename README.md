# OCBC Banking — Prototype

A high-fidelity mobile banking prototype built with **React Native (Expo)**, showcasing AI-driven wealth management and financial planning experiences. This prototype was developed as part of a design and engineering exploration into how a modern digital bank could guide users along a personalised wealth-building journey.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native via [Expo](https://expo.dev) (SDK 52, New Architecture) |
| Routing | [Expo Router](https://expo.github.io/router/) (file-based, typed routes) |
| UI Components | [Tamagui](https://tamagui.dev/) |
| Animations | [Moti](https://moti.fyi/) + React Native Reanimated |
| Visual Effects | `expo-blur` (BlurView), animated background orbs |
| Icons | Expo Vector Icons (Feather, MaterialCommunityIcons, FontAwesome5, Ionicons) |
| Language | TypeScript |
| Platform | iOS (primary) · Android · Web |

---

## Get Started

### 1. Install dependencies

```bash
cd OCBC-Banking
npm install
```

### 2. Start the development server

```bash
npx expo start
```

From the terminal output, you can open the app in:

- [Development Build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) (limited sandbox)

---

## Project Structure

```
OCBC-Banking/
├── app/
│   ├── (tabs)/              # Bottom-tab screens
│   │   ├── home.tsx         # Main home screen
│   │   ├── planning-owl.tsx # Planning Owl feature (full flow)
│   │   ├── more.tsx         # More menu
│   │   ├── pay.tsx
│   │   ├── plan.tsx
│   │   └── rewards.tsx
│   ├── wealth/              # Invest Owl / Wealth journey screens
│   │   ├── onboarding.tsx
│   │   ├── risk-swipe.tsx
│   │   ├── product-selection.tsx
│   │   ├── fund-narrowing.tsx
│   │   ├── cta.tsx
│   │   ├── dashboard.tsx
│   │   └── tier-dashboard.tsx
│   ├── landing.tsx          # Onboarding carousel
│   ├── login.tsx            # Login screen
│   ├── owl-tiering.tsx      # Owl Journey map
│   ├── recommendations.tsx  # Deposit Owl recommendations
│   └── smart-deposit-details.tsx # Deposit Owl AI plan
├── components/
│   ├── home/                # Home screen sub-components
│   ├── deposit-owl/         # Deposit Owl UI components
│   ├── wealth/              # Invest Owl UI + context + mock data
│   ├── journey/             # Journey map components
│   ├── smart-deposit/       # Charts (Donut, Liquidity Area)
│   ├── landing/             # Carousel item component
│   ├── auth/                # Auth components
│   ├── GlassCard.tsx        # Shared glassmorphism card
│   ├── BackgroundOrb.tsx    # Animated ambient background element
│   └── CustomTabBar.tsx     # Custom bottom navigation bar
├── constants/               # Mock data, planning scenarios, store
├── assets/                  # Images, fonts, owl avatars, scene art
└── app.json                 # Expo configuration
```

---

## Implemented Features

### 1. 🏠 Home Screen

The main landing screen after login, built around a personalised, context-aware dashboard.

- **Account tabs** — Switch between Accounts, Investments, Cards, and Loans views. Each tab surfaces relevant summary information (balances, holdings, card details).
- **Balance masking** — A tap-to-reveal balance toggle that masks sensitive figures by default.
- **Floating Owl mascot** — An animated owl character that appears in the corner of the Accounts and Investments tabs. It cycles through contextual speech bubbles (e.g. *"Hoot! Want your idle funds to work harder for you?"*) with staggered show/hide timing to prompt users toward relevant features.
- **Action pills** — Quick-action buttons (Transfer, Pay, Invest, More) for common banking tasks.
- **Dynamic content cards** — Cards rendered per-tab, including spend summaries, portfolio snapshots, and promotional nudges. Content updates when the active tab changes.
- **Smart Insights banner** — A contextual insight strip that surfaces product recommendations based on the active tab.
- **Wealth Portfolio widget** — A compact view of total wealth across asset classes, shown in the Investments tab.

---

### 2. 🗺️ Owl Journey Map

A gamified, visual representation of the user's wealth-building path, designed as an illustrated mountain scene.

- **Illustrated scene background** — A custom-painted mountain image serves as the backdrop for the entire journey.
- **Milestone nodes** — Seven interactive tier nodes positioned precisely on the scene using percentage-based coordinates:
  - **Starter** (S$0–50K) — Completed
  - **Builder** (S$50K–150K) — Completed
  - **Grower** (S$150K–300K) — Current tier (highlighted)
  - **Momentum** (S$300K–350K) — Upcoming
  - **Premier Banking** (S$350K–1.5M) — Upcoming
  - **PPC** (S$1.5M–5M) — Locked
  - **BOS** (S$5M+) — Locked
  - Each node uses distinct visual states (done / current / upcoming / locked) with animated rings and badge styling.
- **Total Assets chip** — An overlay chip showing the user's current total assets (S$220,000), dynamically computed from all owl product holdings.
- **Owl product cards** — Below the scene, three cards represent the active AI-powered Owl modules:
  - **Deposit Owl** — Liquidity manager: navigates to the Smart Deposit Details screen.
  - **Investment Owl** — Portfolio strategist: navigates to the Invest Owl onboarding or dashboard.
  - **Planning Owl** — Future architect: navigates to the Planning Owl goal-planning flow.
  - Cards not yet implemented show a "Coming soon" alert.

---

### 3. 🦉 Deposit Owl — Smart Deposit

An AI-generated cash optimisation plan for idle funds sitting across multiple banks.

- **Multi-bank balance overview** — A donut chart visualising the user's cash distribution across OCBC (S$45K), DBS (S$60K), and UOB (S$19.5K).
- **Idle funds detection** — Identifies S$40,000 in uninvested cash and proposes a three-part allocation plan:
  1. **OCBC 360 Account top-up** (S$10K) — Moves liquid savings to the next bonus tier for up to 4.45% p.a.
  2. **6-Month Fixed Deposit** (S$20K) — Locks funds at a guaranteed promotional rate, shielded from market volatility.
  3. **OCBC RoboInvest** (S$10K) — Long-term inflation-beating growth via a low-risk Blue Chip portfolio.
- **Liquidity area chart** — An animated area chart illustrating the projected liquidity curve over time after the reallocation.
- **Allocation plan cards** — Step-by-step cards with colour-coded amounts and conversational explanations for each allocation decision.
- **Recommendations screen** — A filterable product catalogue with category chips (e.g. Deposits, Investments) for exploring OCBC products beyond the AI plan. Products are rendered as swipeable deck cards.

---

### 4. 📈 Invest Owl — Wealth Journey

A multi-step guided flow for entering wealth investment products, adapting to the user's financial profile.

#### Step 1: Onboarding Questionnaire
- Six-question profiling survey covering: age range, monthly income, investable amount, outstanding loans, preferred markets, and financial knowledge level.
- Answers are stored in a global `WealthContext` (React Context + Reducer) and used to personalise every subsequent step.
- Smooth slide-in animation per question using Moti.

#### Step 2: Risk Profiling — Swipe Cards
- A Tinder-style **swipe card game** for risk assessment.
- Each card presents a financial scenario. Users swipe **right** (agree / risk-seeking) or **left** (disagree / risk-averse).
- Cards adapt their language based on the user's self-reported knowledge level (Basic / Intermediate / Advanced).
- A risk score is tallied and mapped to one of three profiles: **Conservative 🛡️**, **Balanced ⚖️**, or **Growth 🚀**.
- Each card includes physics-based pan gesture handling (via `PanResponder` + `Animated`) that tilts the card as the user drags.

#### Step 3: Product Selection
- Displays wealth product categories (e.g. Unit Trust, Structured Products, Equities) as interactive cards.
- Each product highlights its risk level, typical return range, and a short description.
- The selected product is persisted in `WealthContext` for use downstream.

#### Step 4: Fund Narrowing
- An AI-simulated loading state generates a personalised shortlist of 3–5 recommended funds based on the user's risk profile and selected product.
- Each fund card shows: fund name, asset class, YTD performance, and a personalised rationale sentence tied to the user's profile.
- **Explore More** section — A searchable list of additional funds outside the AI shortlist, allowing users to manually browse and add funds.
- Selecting a fund persists the choice in context.

#### Step 5: Investment CTA
- Displays the selected fund, risk profile, and a projected growth simulation.
- **Editable investment amount** — The user can adjust the dollar amount they wish to invest; projections recalculate live.
- **Growth projection** — Calculates future value using risk-appropriate compound annual growth rates (5% Conservative, 6% Balanced, 8% Growth) over a 3–7 year horizon.
- **Premier Banking unlock indicator** — Shows whether the investment, combined with the user's current AUM, would unlock Premier Banking tier.
- Terms & Conditions checkbox + "Invest Now" confirmation, which triggers an animated success state before navigating to the dashboard.

#### Step 6: Wealth Dashboard
- Post-investment summary screen.
- **Donut chart** — Visualises the portfolio breakdown (Unit Trust, Equities, Bonds) with the newly added fund highlighted in green.
- **Holdings list** — Shows each asset class with current value and YTD performance.
- **Tier progress bar** — A visual indicator of how far the user is from Premier Banking (S$350K AUM target), updated to reflect the new investment.
- **AI nudge card** — A personalised prompt (e.g. *"Adding SGD 500/month could unlock Premier Banking 18 months earlier"*) encouraging ongoing engagement.
- **AI Assistant FAB** — A floating action button that opens the AI Assistant sheet.

#### Tier Dashboard
- An alternative entry point surfacing the user's current tier, progress toward Premier, and four action categories: Grow Wealth, Protect, Save, Plan.

---

### 5. 🗓️ Planning Owl — Goal Planner

A complete, multi-screen financial goal planning experience for life events (currently: property purchase).

- **Plans Home** — A library screen listing all saved plans. Users can view, edit, or delete existing plans, or create a new one.
- **Event Picker** — Selection of a life goal event (Property is the implemented prototype; others are stubs).
- **3-Question Guided Flow**:
  1. **Property value range** — S$600K–800K / S$800K–1.2M / S$1.2M–1.6M
  2. **Downpayment target** — 20% / 25% / 30% (with a chip showing current eligible cash: S$150,890)
  3. **Timeframe** — 1–2 / 3–4 / 5–6 years
- **Results Screen** — Generates a personalised savings plan with:
  - Monthly savings target
  - Total amount needed vs. current cash position
  - Gap analysis
  - Recommended OCBC products for the savings vehicle
- **Scenario Comparison** — Three scenarios are presented side-by-side:
  - **Match Timing** — Hit the downpayment exactly on the chosen date.
  - **Save Less, Wait Longer** — Reduce monthly burden, extend the timeline.
  - **Save More, Buy Sooner** — Accelerate contributions to buy earlier.
  - Users can switch between scenarios and see simulations update in real time.
- **Commit to Plan** — A confirmation step that saves the plan locally, allowing the user to revisit it from the Plans Home.
- **Ask Owl chat** — An inline contextual Q&A panel where users can ask the Owl questions about their plan (mock AI replies keyed to keywords).
- **Persistent plan store** — Plans are saved across sessions using a local store, supporting create, read, and delete operations.

---

### 6. 🤖 AI Assistant

A slide-up modal chat interface available throughout the Invest Owl flow.

- Accessible via a floating action button on the Wealth Dashboard and Tier Dashboard.
- **Quick question chips** — Pre-populated questions: *"How close am I to Premier?"*, *"What products are safest?"*, *"How long until I unlock Premier?"*
- **Free-text input** — Users can type any question and receive a contextual mock response.
- Responses are keyword-matched against a mock reply library and delivered with a 1.3-second "typing" delay to simulate a real AI assistant.
- Conversation history is persisted in `WealthContext` for the session.

---

### 7. 🎨 Design System & UI Patterns

The prototype uses a consistent set of UI primitives and design patterns across all screens.

- **GlassCard** — A shared glassmorphism card component with `expo-blur` background, used as the primary content container throughout the app.
- **BackgroundOrb** — Animated, softly pulsing gradient orbs layered behind content to create depth and visual warmth. Each screen composes 2–3 orbs with different colours, sizes, and positions.
- **Moti animations** — Entrance animations (fade + slide) applied to cards and content blocks to create a sense of progression as screens load.
- **Custom Tab Bar** — A bespoke bottom navigation bar with OCBC branding, active state indicators, and smooth transitions.
- **Colour palette** — OCBC Red (`#DA291C`), deep navy, amber gold, and soft off-white backgrounds across all screens, maintaining brand fidelity.
- **Typography** — System font stack with carefully tuned weight, size, and letter-spacing hierarchies for banking-grade readability.

---

## Screen Map

```
Landing → Login → Home (tabs)
                      ├── Accounts / Investments / Cards / Loans
                      └── [Floating Owl] → Owl Journey Map
                                              ├── Deposit Owl → Smart Deposit Details
                                              │                      └── Recommendations
                                              ├── Investment Owl → Onboarding
                                              │                       → Risk Swipe
                                              │                       → Product Selection
                                              │                       → Fund Narrowing
                                              │                       → CTA
                                              │                       → Dashboard
                                              └── Planning Owl → Plans Home
                                                                   → Event Picker
                                                                   → Questions (1→2→3)
                                                                   → Results
                                                                   → Scenario Comparison
                                                                   → Committed
```

---

## Notes

- All financial data (balances, fund returns, AUM figures, projections) are **mock/simulated** for prototype demonstration purposes.
- The Planning Owl plan store uses local device storage; data does not sync to a backend.
- Screens marked "Coming soon" in the Owl Journey are stubs for future prototype iterations.
- The app targets portrait orientation on iOS and Android.

