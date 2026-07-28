# NEST — OCBC Financial Advisory Prototype

**NEST** is an interactive mobile banking prototype that demonstrates an AI-powered financial advisory experience layered on top of a standard digital banking app. It is designed to show how a bank can guide customers from day-to-day account management all the way through to proactive, personalised goal-based financial planning — without ever leaving the app.

The prototype is built as a simulated mobile app, rendered inside a browser-framed phone shell for demo and presentation purposes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 11 |
| Icons | Lucide React |
| Utilities | clsx, tailwind-merge |

---

## Getting Started

```bash
# Navigate into the app folder
cd nest

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app runs at `http://localhost:5173` by default. It is designed to be viewed at a mobile viewport (375 x 812 px). The browser frame wrapper handles this automatically in desktop browsers.

---

## Project Structure

```
nest/
└── src/
    ├── pages/          # Full-screen page components (one per route/state)
    ├── components/
    │   ├── layout/     # MobileFrame, BottomNavBar
    │   └── ui/         # Reusable UI primitives and complex widgets
    ├── context/        # AppContext — global state and all business logic
    ├── data/           # Static and derived data (plans, cards, deposits, etc.)
    └── assets/         # SVG illustrations for plan categories
```

Routing is state-based — there is no URL router. A single `page` string in `AppContext` controls which screen is rendered, and `navigate(pageName)` updates it.

---

## Features

### Home Dashboard

The main landing screen after login. Displays the user's full financial picture across four switchable tabs:

- **Accounts** — Lists all savings accounts with masked/unmasked balances. Tapping an account navigates to the Account Detail page.
- **Investments** — Net wealth summary with YTD growth, broken down by portfolio item.
- **Cards** — NEST Platinum Debit card display with Apple Wallet prompt.
- **Loans** — Active EasiCredit loan balance, interest rate, and pre-approved refinancing offers.

Additional elements on the Home screen:
- **Auto-scrolling promotional banner** — Rotates between global market access and OCBC 360 interest rate highlights every 4 seconds.
- **Quick action pills** — PayNow, Scan & Pay, Foreign Exchange, and Customise shortcuts.
- **Balance masking toggle** — Eye/EyeOff button hides all financial figures across the entire app simultaneously.
- **Plan deviation notification modal** — When Agent Owl detects a transaction that affects an active goal, a contextual popup surfaces on the home screen listing the impacted plans and prompting the user to review recovery options.
- **Opportunity popup** — After a deposit lands in an account, a popup surfaces recommending the best plan to allocate the new funds to.

---

### Account Detail

Accessible by tapping any account card on the Home screen.

- Displays full account name, number, type, SDIC insurance badge, available balance, and interest rate.
- Includes a **Simulate Deposit** panel for demo purposes: enter a custom amount or choose a quick preset (S$1k, S$5k, S$8k, S$10k), confirm, and the balance updates immediately in global state. After a deposit, the app navigates back to Home and triggers the Opportunity popup to demonstrate the deposit-to-plan allocation flow.

---

### AI Chat — Agent Owl (Chat Widget)

A persistent floating chat bubble available throughout the app (home, plan dashboard, plan milestones). Opens a full-screen conversational interface powered by **Agent Owl**.

- **Conversational plan creation** — The user describes a financial goal in natural language. Owl gathers the goal name, target amount, and target date through a guided conversation, then generates a complete plan proposal with categories, actions, and projections.
- **Plan proposal presentation** — A structured plan card appears inside the chat with a savings projection chart, action breakdown, and a one-tap Accept Plan button.
- **Risk profiling gate** — First-time plan creation triggers the Risk Profiling flow before the proposal is shown. Subsequent plans skip straight to the proposal.
- **Inline plan adjustments** — Users can ask Owl to adjust contribution amounts, change the target date, or switch payment strategy (monthly vs lump sum) without leaving the chat.
- **Contextual awareness** — Owl knows which plan is currently active, whether there are pending deviations, and whether an opportunity is waiting.

---

### Risk Profiling

Triggered automatically when the user creates their first plan. Uses a swipeable card deck UI:

- Six scenario-based questions presented as cards the user swipes **right (Yes)** or **left (No)**.
- Swipe direction is detected with a drag threshold; visual cues (green/red border, check/cross overlay) appear as the card moves.
- Results are aggregated into a risk profile label (e.g., *Balanced Wealth*, *Growth Seeker*) stored in global state and used to personalise plan recommendations.
- Enters via an iris clip-circle animation expanding from the tap origin.

---

### Plan Dashboard

The advisory hub, accessible via the **Plan** tab in the bottom nav.

- Displays all accepted plans as illustrated cards with category badge, goal name, target amount, target date, and status indicators (*Needs Review*, *Plan Adjusted*).
- **OCBC Smart Advisor banner** — One-tap entry into the Expense Optimizer.
- **Opportunity allocation card** — Surfaces when a deposit has been made and no deviation is pending, directing the user to allocate funds across their plans.
- **New Plan button** — Opens Agent Owl in plan-creation mode.

---

### Plan Details

A full-screen overlay (iris clip-circle animation) presenting the complete detail view of a selected plan proposal before acceptance.

- **Savings projection area chart** — Multi-line chart showing contributions vs. projected growth over time.
- **Tabbed action breakdown** — Categories of actions (e.g., Investments, Deposits, Protection) with individual line items, amounts, and rates. Each action has a **Change** button.
- **Subgoal editor** — Add, edit, or remove sub-milestones with custom names, amounts, and dates.
- **Replan overlay** — Lets the user switch the payment strategy (monthly contributions vs lump sum) and recalculates projections in real time.
- **Accept Plan** — Saves the plan to global state and transitions to the Plan Milestones view.

---

### Plan Milestones

A timeline view of an accepted plan's key checkpoints.

- Lists milestones in chronological order with completion states (completed, next, upcoming, goal).
- Progress bar shows overall funding progress.
- Entry point to Plan Details, Savings Breakdown, and Plan Healer.

---

### Savings Breakdown

Detailed breakdown of how monthly contributions are distributed across the actions within a plan (investments, deposits, protection, etc.), displayed as a visual allocation summary.

---

### Plan Change Option

Accessible from the **Change** button on any action inside Plan Details. Presents alternative financial products for that action category:

- **Deposits tab** — OCBC deposit account alternatives shown in a swipeable card deck carousel with rates, lock-in periods, and minimum balance details.
- **Cards tab** — Recommended credit/debit cards for spending optimisation shown in the same carousel format.
- Lock/unlock toggles, product-level exclusions, and side-by-side comparison of before vs. after states.
- Applying a change writes back to `planAdjustments` in global state.

---

### Expense Optimizer

A standalone advisor screen accessible from the Plan Dashboard banner.

- Shows personalised OCBC credit card recommendations ranked by cashback/rewards potential based on the user's active plan and spending profile.
- Shows recommended deposit account options (fixed deposits, high-yield savings) with projected interest yield.
- Toggle between **Cards** and **Deposits** views with an animated curtain transition.
- Interactive **monthly spend slider** for cards — adjusts estimated annual cashback in real time.
- Interactive **deposit amount slider** for deposits — adjusts projected interest earned.

---

### Plan Healer

Triggered when Agent Owl detects that a transaction has created a shortfall in one or more active plans.

- Lists all affected plans with gap amounts and plan names.
- For each affected plan, presents **recovery strategy options** (e.g., extend the target date, increase monthly contributions, reduce the goal amount) with before/after comparisons.
- The user selects one or more plans to heal and picks a strategy per plan.
- **Bonus allocation panel** — If an opportunity deposit exists alongside the deviation, the user can allocate those funds to help close the gaps.
- Applying a recovery updates `planAdjustments`, marks the deviation as resolved, and adds a timestamped activity entry to the plan's history.
- Declining a recovery dismisses the healer without modifying the plan.

---

### Opportunity Detail

Surfaces when the user has a new deposit available and wants to allocate it across their plans.

- Three allocation modes: **Best** (concentrate on the plan that benefits most), **Balanced** (split proportionally by gap across all plans), **Custom** (manually set amount per plan).
- Per-plan impact preview: months saved, new projected completion date.
- Product allocation breakdown showing which OCBC products (deposit accounts, investment products) the funds will flow into.
- Confirm allocation writes to `opportunityDecisions` in global state and navigates to the updated plan milestones.

---

### Plan View

A minimal read-only summary card for a plan, used as a lightweight overview before drilling into full Plan Details.

---

### Login and Landing

- **Landing page** — Branded entry screen with a prompt to get started.
- **Login page** — OCBC-styled login form (Access ID + PIN) with a simulated authentication flow. Successful login navigates to the Home screen.

---

## Global State (AppContext)

All application state lives in `AppContext` and is accessible via the `useApp()` hook. Key state slices:

| State | Description |
|---|---|
| `page` | Current active screen/route |
| `isMasked` | Global balance masking toggle |
| `activeTab` | Active tab on the Home screen (accounts/investments/cards/loans) |
| `createdPlans` | Array of accepted plan IDs |
| `planAdjustments` | Per-plan overrides (target, date, contribution, milestones, healed flag) |
| `transactionDeviations` | Array of deviation events with affected plans and recovery options |
| `opportunityDecisions` | Record of accepted/declined opportunity allocations |
| `accountsData` | Live account balances (updated by simulate deposit) |
| `opportunitySourceAmount` | Amount available for opportunity allocation |
| `riskProfile` | User's risk tolerance label from Risk Profiling |
| `user` | Basic user profile (name, access ID) |

---

## Demo Flow (Suggested Walkthrough)

1. **Landing → Login** — Enter any credentials to proceed.
2. **Home** — View accounts, toggle balance masking, explore tabs.
3. **Home → Plan tab** — Open Plan Dashboard; see the existing Housing plan.
4. **Chat (Owl)** — Tap the chat bubble and describe a new goal (e.g. *"I want to save for my wedding"*) to create a new plan. Complete Risk Profiling on first run.
5. **Plan Dashboard** — Both plans now appear. Tap the Housing plan card.
6. **Plan Milestones → Plan Details** — Review the full plan, change an action, and explore the Savings Breakdown.
7. **Account Detail** — Go back to Home, tap the 360 Account, and use the deposit simulator to add S$8,000.
8. **Opportunity popup** — After deposit, the Home screen surfaces the opportunity to allocate funds. Tap to explore.
9. **Opportunity Detail** — Compare allocation modes and confirm.
10. **Plan Healer** — Trigger from Plan Dashboard if a deviation notification appears; select a recovery strategy and apply.
11. **Expense Optimizer** — Visit from Plan Dashboard banner; explore card and deposit recommendations.
