# Planning Owl — frontend implementation plan

## Scope

Frontend interactions only. No backend, no real data sources, no AI calls — every
"AI-generated" output (follow-up questions, scenarios, recommendation) is mocked
with static or lightly-templated data for now.

Only the **buying a property** life event is implemented. Other life-event cards
(getting married, starting a family, career break) render in the picker but are
disabled / marked "coming soon" so the layout doesn't need to change later.

## Out of scope (for this pass)

- Any backend service, API, or database
- Real financial calculations or projections
- Other life events beyond property
- Cross-owl handoff actually creating anything in Deposit Owl / Invest Owl —
  tapping those links should just navigate/log for now
- Compliance / audit logging
- Persisting plan state across app restarts (in-memory state for the session is enough)

## Flow overview

```
Life event picker
      |
      v
      buying a property
      |
      v
Follow-up questions (3 screens, one question each)
  1. Desired property value
  2. Intended downpayment
  3. Target timeframe
      |
      v
Simulation results (success probability, time to goal, trajectory chart, guidance)
      |
      v
Strategy comparison (opportunity gap, why-this-works, commit to plan)
      |
      v
Commit confirmation (local-only "success" state, no backend write)
```

The floating **Ask Owl** button is a persistent overlay component, mounted once
above all five screens, not per-screen.

## State shape

Single local state object owned by a `PlanningOwlFlow` container component.
Everything downstream is presentational and receives props/callbacks — no screen
reads or writes global state directly.

```ts
type PlanningOwlState = {
  step: 'eventPicker' | 'question1' | 'question2' | 'question3'
      | 'results' | 'comparison' | 'committed';

  selectedEvent: 'property' | null; // only 'property' is interactive for now

  answers: {
    propertyValue: string | null;   // e.g. "S$800k – 1.2m"
    downpayment: string | null;     // e.g. "25%"
    timeframe: string | null;       // e.g. "Within 1 year"
  };

  askOwlOpen: boolean;
};
```

Scenario/recommendation data is **not** stored in state — it's derived by a pure
mock function (see below) from `answers`, so swapping in a real backend later is
just swapping that one function.

## Component structure

```
PlanningOwlFlow                 (container — owns state, step transitions)
 ├── LifeEventPicker             (step: eventPicker)
 │    └── EventCard × N
 ├── FollowUpQuestion            (step: question1/2/3 — same component, different props)
 │    └── OptionRow × N
 ├── SimulationResults           (step: results)
 │    ├── MetricCard × 2
 │    ├── TrajectoryChart
 │    ├── GuidanceCard
 │    └── ActionRow × 2          (Deposit owl / Invest owl links)
 ├── StrategyComparison          (step: comparison)
 │    ├── OpportunityGapCard
 │    ├── MetricCard × 2
 │    └── WhyThisWorksRow × N
 ├── CommitConfirmation          (step: committed)
 └── AskOwlButton                (persistent overlay, all steps)
      └── AskOwlDrawer           (opens on tap, closes on dismiss)
```

## Mock data layer

One file, `planningOwlMocks.ts`, exporting a single function so it's the only
thing that needs replacing when a real backend exists:

```ts
function getMockSimulation(answers: PlanningOwlState['answers']) {
  return {
    title: 'Dream home 2026',
    successProbability: 84,
    timeToGoalYears: 2.4,
    trajectory: [
      { year: 2024, value: 400_000 },
      { year: 2025, value: 700_000 },
      { year: 2026, value: 950_000 },
      { year: 2027, value: 1_200_000 },
    ],
    guidance: 'Saving aggressively reaches your downpayment goal 6 months earlier...',
    actions: [
      { id: 'deposit', label: 'Optimize liquidity', detail: 'Redirect S$2,400/mo surplus into Deposit owl', target: 'deposit_owl' },
      { id: 'invest', label: 'Rebalance growth', detail: 'Shift 15% to lower-volatility holdings', target: 'invest_owl' },
    ],
    comparison: {
      currentGoalDate: 'Oct 2026',
      optimizedGoalDate: 'Aug 2025',
      monthsSaved: 14,
      lifestyleAdjustment: '-15% dining',
      reasons: [
        { title: 'Compound interest trigger', detail: 'Diverting S$1,200/mo captures an estimated 8.2% APY, compounding monthly' },
        { title: 'Tax efficiency', detail: 'Rebalancing uses available capital-loss carry-forward to lift net purchase power' },
      ],
    },
  };
}
```

It's fine for this to ignore `answers` for now and return the same fixture —
the point is just that screens read from this function's shape, not from
hardcoded literals scattered across components.

## Screen-by-screen build order

### 1. `LifeEventPicker`
- Render 4 cards (property, married, family, career break)
- Only the property card is tappable; others show a "coming soon" badge and are
  visually muted (lower opacity, no hover state)
- Tapping property → `setStep('question1')`, `setSelectedEvent('property')`

### 2. `FollowUpQuestion` (reused 3×)
- Props: `questionNumber`, `title`, `subtitle`, `options[]`, `selectedValue`, `onSelect`, `onNext`, `onBack`, `onSkip`
- Progress dots derived from `questionNumber`
- "Skip — use estimated defaults" sets a sensible default answer and advances
- Back button on question 2/3 returns to the previous question without losing
  the other two answers
- Question 1 → property value options
- Question 2 → downpayment options (include the "current eligible cash" info
  chip — can be a static mock value for now)
- Question 3 → timeframe options
- On question 3 "Next" → `setStep('results')`

### 3. `SimulationResults`
- Pull fixture from `getMockSimulation(answers)`
- `MetricCard` ×2 for success probability / time to goal
- `TrajectoryChart` — simple SVG polyline, no charting library needed for 4 points
- `GuidanceCard` with the two `ActionRow`s
  - Tapping an `ActionRow` for now just logs/no-ops or shows a toast
    ("This will open Deposit owl") — no real navigation yet
- "Compare strategies" button → `setStep('comparison')`

### 4. `StrategyComparison`
- `OpportunityGapCard` — current vs optimized goal date, progress bar, "-N mos" badge
- `MetricCard` ×2 for lifestyle adjustment / goal acceleration
- `WhyThisWorksRow` list (color-coded left border, static per reason)
- "Commit to plan" → `setStep('committed')`

### 5. `CommitConfirmation`
- Simple confirmation screen: checkmark, "Your plan is saved", summary of the
  chosen scenario
- Since there's no backend, this is purely a local state transition — no
  persistence guarantee across sessions yet
- "Done" returns to the dashboard (or wherever Planning Owl is entered from)

### 6. `AskOwlButton` / `AskOwlDrawer`
- Floating button, fixed position bottom-right, present on every step above
- Tapping opens a bottom drawer (sheet), no navigation away from the current
  screen
- Drawer content can be a static placeholder for now ("Ask Owl is listening...")
  since there's no AI backend yet — just wire up the open/close interaction

## Interaction details to get right

- Step transitions should animate as a slide (matches the rest of the app's
  navigation pattern) rather than an instant swap
- Back button always returns one step, never resets the whole flow
- Selected option state in `FollowUpQuestion` must persist if the user goes
  back and forward again
- Disabled life-event cards should not be focusable/tappable (accessibility)
- All buttons need a disabled state while a transition is in progress, to
  prevent double-taps advancing two steps

## Acceptance criteria for this pass

- [ ] Can go from event picker through to commit confirmation entirely on
      mock data, no network calls
- [ ] Going back from any question screen preserves previously entered answers
- [ ] Skip-to-defaults works on all 3 question screens
- [ ] Ask Owl button is reachable and opens/closes on every screen
- [ ] Non-property event cards are visibly disabled and do not navigate
- [ ] Action rows in results/comparison screens are tappable but clearly
      marked as not-yet-wired (toast or console log is fine)

## Next pass (not now, just noting for later)

- Replace `getMockSimulation` with a real backend call
- Wire `ActionRow` taps to actually prefill and navigate into Deposit Owl /
  Invest Owl
- Add the remaining life events
- Persist `PlanningOwlState` so a committed plan survives app restart
- Compliance/audit logging on commit
