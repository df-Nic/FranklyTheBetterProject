# OCBC Banking — Agentic AI Banking Prototype

A high-fidelity mobile banking prototype built with **React Native (Expo SDK 54)**, showcasing how **Agentic AI** can redefine digital wealth management and financial planning. 

In traditional mobile banking, apps function as static, reactive ledgers where users must navigate multiple menus to check balances or execute trades. This prototype explores a paradigm shift: **a proactive, contextual, and autonomous banking partner** that monitors multi-bank idle funds, profiles risk via interactive behavioral simulation, compares multi-scenario lifetime goals, and orchestrates cross-product wealth-building journeys.

---

## 🦉 Agentic AI Core Paradigms

This project prototypes several key dimensions of agentic AI systems in a retail and wealth banking context:

1. **Contextual Proactivity**: The system monitors customer account activities and balances, prompting them with actionable nudges at high-value moments.
2. **Cross-Institutional Orchestration**: The AI reasons over financial positions across multiple institutions (OCBC, DBS, UOB) to synthesize a single optimized liquidity allocation strategy.
3. **Adaptive Cognitive Matching**: Rather than using static forms, the risk-profiling system uses interactive game scenarios and dynamically adapts the complexity of its scenarios based on the customer's self-reported financial literacy.
4. **Multi-Scenario Optimization Engine**: The planning agent evaluates variable combinations (timeline, monthly contributions, risk assets) to generate and compare multiple paths to reach a single goal.
5. **Seamless Exploration Handoff**: A financial sandbox allows customers to play with general numbers first, which the agent automatically maps and carries over into formal goal configuration screens.
6. **Cross-Product Silo Integration**: The agent breaks down product boundaries (e.g., matching home loan eligibility with deposit rate bonuses and investment baskets) under one unified wealth architecture.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Version / Configuration |
|---|---|---|
| **Framework** | React Native via [Expo](https://expo.dev) | SDK 54 (New Architecture enabled) |
| **Routing** | [Expo Router](https://expo.github.io/router/) | File-based, strongly typed navigation paths |
| **UI Primitive** | [Tamagui](https://tamagui.dev/) | High-performance compiler and UI kit |
| **Animations** | [Moti](https://moti.fyi/) | Powered by React Native Reanimated (declarative animations) |
| **Gestures** | React Native Gesture Handler | Driver for interactive pan/swipe game mechanics |
| **Visual Effects** | `expo-blur` | Real-time native glassmorphism (BlurView) |
| **Icons** | Expo Vector Icons | Feather, FontAwesome5, Ionicons, MaterialCommunityIcons |
| **Language** | TypeScript | Strong typing for app state, routing, and context |

---

## 📂 Project Directory Structure

Below is the directory map of the prototype, highlighting the key files where the agentic logic and UI are defined:

```
OCBC-Banking/
├── app/
│   ├── (tabs)/                      # Core Application Navigation Tabs
│   │   ├── home.tsx                 # Context-aware Dashboard & Proactive Mascot UI
│   │   ├── planning-owl.tsx         # Planning Owl Goal Planner & Scenario comparison
│   │   ├── more.tsx                 # More menu
│   │   ├── pay.tsx                  # Pay tab stub
│   │   ├── plan.tsx                 # Legacy plan stub
│   │   └── rewards.tsx              # Rewards tab stub
│   ├── wealth/                      # Invest Owl Wealth Journey
│   │   ├── onboarding.tsx           # Profile questionnaire collecting customer context
│   │   ├── risk-swipe.tsx           # Tinder-style gestural Risk Assessment Game
│   │   ├── product-selection.tsx    # Asset class category selector
│   │   ├── fund-narrowing.tsx       # AI portfolio shortlisting & personalized rationales
│   │   ├── cta.tsx                  # Future compound projections & transaction checkout
│   │   ├── dashboard.tsx            # Post-investment portfolio breakdown & AI progress nudges
│   │   └── tier-dashboard.tsx       # Alternative wealth-tier entry point
│   ├── landing.tsx                  # Product onboarding walkthrough
│   ├── login.tsx                    # Authentication entry point
│   ├── owl-tiering.tsx              # Gamified customer tier map (Starter → BOS)
│   ├── planning-owl-sandbox.tsx     # "Play with the numbers" Sandbox exploration
│   ├── planning-owl-sandbox-handoff.tsx # Sandbox data mapping and routing handoff
│   ├── recommendations.tsx          # Deposit Owl product catalogue card deck
│   └── smart-deposit-details.tsx   # Deposit Owl Multi-Bank Optimization Dashboard
├── components/
│   ├── GlassCard.tsx                # Custom glassmorphic container with native blur
│   ├── BackgroundOrb.tsx            # Animated background gradient blur orbs
│   └── CustomTabBar.tsx             # Customized bottom navigation bar
├── constants/
│   ├── depositOwlData.ts            # Multi-bank balances & product mock data
│   ├── planningOwlMocks.ts          # Core simulator engine & scenario generation logic
│   ├── planningOwlSandbox.ts        # Data contracts, mappings, and projection logic for Sandbox
│   ├── planningOwlSavedPlanStore.ts # Local Storage wrapper for persistent goal plans
│   └── theme.ts                     # Tamagui design system constants & color tokens
├── assets/                          # Static resources (Owl icons, illustrations, backgrounds)
└── package.json                     # Project dependency definitions (Expo SDK 54)
```

---

## 🚀 Prototyped Agentic Features (In-Depth)

### 1. 🏠 Proactive Context-Aware Home Screen
The main interface [home.tsx](OCBC-Banking/app/(tabs)/home.tsx) is designed around dynamic, customer-centric balance states rather than a static home screen.
* **Proactive Floating Mascot**: An animated Owl mascot cycles through context-aware speech bubbles. For example, if a user lingers on the *Accounts* tab while holding high savings, the mascot prompts: *"Hoot! Want your idle funds to work harder for you?"*
* **Dynamic Tab Switcher**: Switches between Accounts, Investments, Cards, and Loans. Transitioning tabs updates the Action Pills, promotional banners, and spend summaries dynamically to represent the state relevant to that specific product suite.
* **Tap-to-Mask Balances**: Implements safety-first balance masking by default, toggled via a tap interaction to preserve privacy in public environments.

### 2. 🗺️ Gamified Customer Journey Map
The journey dashboard [owl-tiering.tsx](OCBC-Banking/app/owl-tiering.tsx) maps the user's long-term progression from retail savings to high-net-worth tiers.
* **milestones & Tier Status**: Tracks asset milestones across seven levels: *Starter* (S$0-50K), *Builder* (S$50K-150K), *Grower* (S$150K-300K, current active tier), *Momentum* (S$300K-350K), *Premier Banking* (S$350K-1.5M), *PPC* (S$1.5M-5M), and *BOS* (S$5M+).
* **Computed AUM Indicator**: The overlay reads from multiple simulated assets (deposits + investments) to compute the customer's total assets (S$220,000) and displays a progression tracker showing the distance to unlocking the next premium tier (*Premier Banking*).
* **Agent Quick-Launch**: Serves as the navigation hub, pointing users to the active AI modules (**Deposit Owl**, **Investment Owl**, or **Planning Owl**).

### 3. 🦉 Deposit Owl — Multi-Bank Cash Orchestrator
Defined in [smart-deposit-details.tsx](OCBC-Banking/app/smart-deposit-details.tsx), this feature addresses the fragmentation of liquidity across different financial institutions.
* **Multi-Bank Asset Aggregation**: Synthesizes and visualizes customer assets across UOB (S$19.5K), DBS (S$60K), and OCBC (S$45K) inside a dynamic donut chart.
* **Idle Cash Detection**: Identifies S$40,000 in uninvested, low-yielding cash across outside accounts and proposes a structured 3-part reallocation plan:
  1. **OCBC 360 Account Top-Up** (S$10,000) to hit high-yield bonus interest tiers (up to 4.45% p.a.).
  2. **6-Month Fixed Deposit** (S$20,000) to lock in secure interest shielded from volatility.
  3. **OCBC RoboInvest Blue Chip Basket** (S$10,000) for inflation-hedged growth.
* **Liquidity Curve Modeler**: Integrates a custom visual area chart that maps out the customer's projected liquid assets over a 12-month timeline, showing how liquidity changes before and after executing the AI's allocation advice.
* **Exploration Deck**: Integrates [recommendations.tsx](OCBC-Banking/app/recommendations.tsx), an alternative product swipe deck allowing customers to filter and explore OCBC's product catalog manually.

### 4. 📈 Invest Owl — Personalised Wealth Strategist
A multi-step wealth advisory flow that adapts its behaviors and portfolio recommendations based on the user's financial profile.
* **Context Gathering**: [onboarding.tsx](OCBC-Banking/app/wealth/onboarding.tsx) captures the user's age, income, investment amount, loan profile, and market preferences using an animated step card flow.
* **Adaptive Risk-Swipe Game**: [risk-swipe.tsx](OCBC-Banking/app/wealth/risk-swipe.tsx) assesses risk appetite through a Tinder-style swipe interface. Using the profile's financial knowledge level, the card game *rewrites scenario questions* (e.g., using simpler descriptions for "Basic" users, and detailed asset terms for "Advanced" users) to ensure clear comprehension. It incorporates physics-based pan gesture handling that tilts cards based on user finger drag.
* **AI Fund Shortlisting**: [fund-narrowing.tsx](OCBC-Banking/app/wealth/fund-narrowing.tsx) evaluates the user's context and generates a tailored shortlist of 3-5 unit trusts. Each card displays a personalized investment rationale (e.g., *"Recommended because this fund targets US tech, matching your interest in high growth markets while balancing your intermediate risk profile"*).
* **Compound Growth Modeler**: [cta.tsx](OCBC-Banking/app/wealth/cta.tsx) runs real-time simulations projecting portfolio values over a 3-7 year horizon. Adjusting the investment amount updates the curves and triggers alerts if the investment unlocks the *Premier Banking* tier.
* **Portfolio Dashboard & Nudges**: [dashboard.tsx](OCBC-Banking/app/wealth/dashboard.tsx) visualizes asset allocation post-investment and surfaces intelligent nudges (e.g., *"Adding S$500/month gets you to Premier Banking 18 months earlier"*). It also includes a floating button that expands a conversational AI Assistant panel.

### 5. 🗓️ Planning Owl — Goal Planner & Sandbox Explorer
The goal-planning engine in [planning-owl.tsx](OCBC-Banking/app/(tabs)/planning-owl.tsx) structures plans for major life events, backed by a persistent plan database [planningOwlSavedPlanStore.ts](OCBC-Banking/constants/planningOwlSavedPlanStore.ts).
* **The "Play with the Numbers" Sandbox**: Accessible via [planning-owl-sandbox.tsx](OCBC-Banking/app/planning-owl-sandbox.tsx), this playground lets users experiment with saving amounts and timelines before committing to a goal. Projections are computed live, labeling the user's savings band (e.g., *Rainy Day range* vs. *Property Deposit range*).
* **Frictionless Handoff**: [planning-owl-sandbox-handoff.tsx](OCBC-Banking/app/planning-owl-sandbox-handoff.tsx) maps sandbox values into target goal fields using [planningOwlSandbox.ts](OCBC-Banking/constants/planningOwlSandbox.ts). When pushing to the property or custom goal questionnaires, fields carried from the sandbox display a `"from sandbox"` badge, while unasked fields show a `"new"` badge.
* **Multi-Scenario Comparison Engine**: Instead of outputting a single number, the planner generates and compares three scenarios side-by-side:
  - *Match Timing*: Meets the target date exactly.
  - *Save Less, Wait Longer*: Extends the timeline to lower monthly contribution pressure.
  - *Save More, Buy Sooner*: Increases savings to accelerate property acquisition.
* **Silo-Breaking Action Plans**: Integrates actionable cross-product steps inside the scenario cards (e.g., linking Deposit Owl, Invest Owl portfolios, and a Home Loan eligibility check together).
* **Ask Owl Natural Language Chat**: An inline conversational chat interface. Customers type questions about their plan (e.g., *"What if my downpayment changes?"*), and the engine processes the context to output relevant guidance.
* **Persistent Plan Library**: Supports creating, naming, reading, and deleting goal plans. Saved plans are displayed on the *Plans Home* screen with options accessible through a 3-dot overflow options menu.

---

## 🎨 UI Design System & Micro-Interactions

Visual fidelity is crucial to making the banking experience premium and engaging. The application leverages Tamagui and Reanimated to implement a modern glassmorphism design:
* **GlassCard Container**: [GlassCard.tsx](OCBC-Banking/components/GlassCard.tsx) provides a shared visual component utilizing `expo-blur` to render semi-transparent, frosted glass backgrounds.
* **Pulsing Ambient Orbs**: [BackgroundOrb.tsx](OCBC-Banking/components/BackgroundOrb.tsx) renders blurred, glowing radial gradient backdrops behind components. These orbs pulse slowly using reanimated timing sequences to add depth and warmth to the canvas.
* **Moti Transitions**: Screens employ entrance transitions (fade-in, slide-up, scale) using Moti, creating a smooth progression flow as the customer moves between steps.
* **Tappable Visual Hierarchy**: Follows strict design rules where static metadata chips (e.g., timeframe tags) are styled as flat, transparent outlines, reserving filled button indicators solely for interactive elements.

---

## 🏁 Get Started & Setup

### Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18+) and `npm` installed.

### 1. Install Dependencies
Navigate to the mobile directory and install npm packages:
```bash
cd OCBC-Banking
npm install
```

### 2. Start the Expo Server
Start the local development server:
```bash
npx expo start
```

### 3. Open the Mobile Simulator
Once the server is running, you can open the project in:
* **iOS Simulator**: Press `i` in the terminal (requires macOS and Xcode).
* **Android Emulator**: Press `a` in the terminal (requires Android Studio).
* **Expo Go / Development Build**: Scan the QR code displayed in the terminal with your phone camera (using the Expo Go app).
