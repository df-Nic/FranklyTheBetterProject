
PLANNING OWL — CONSOLIDATED CHANGE PLAN

================================================
PART 1: EXISTING FEEDBACK ITEMS
================================================

1. EMPTY "YOUR PLANS" PAGE
- Add an "Owl noticed something" insight card above the empty-state card.
  Shows a proactive AI suggestion (e.g. detected family-related spending
  pattern) with two actions: "Explore plan" (primary) and "Not now" (plain).
- Add two low-commitment quick-start pills below the main CTA:
  "Play with the numbers" and... [one more category if needed, e.g. "Rainy day fund"]
- These pills should not look like full life-event cards — pill shape,
  lighter visual weight, so they read as lower commitment than the main CTA.

2. "CHOOSE A LIFE EVENT" PAGE
- Surface the AI-suggested life event as a distinct recommended card at the
  top of the list, visually separated from the generic catalogue below.
- Treat "save for something else" type goals as their own category, not
  squeezed into the life-event list alongside Buying a property, Education, etc.

3. TIMELINE PICKER — ADD "<1 YEAR" OPTION
- Add a sub-1-year option to "When would you like to buy?"
- Downstream: the scenario engine must drop logically unreachable scenario
  options once <1 year is selected (e.g. there is no "buy earlier" option
  if the user already picked the shortest timeline). Flag to whoever owns
  scenario-generation logic — this is a logic change, not just a UI add.

4. REMOVE "KEY TERMS" GLOSSARY BOX
- Delete the standalone "Key terms" card entirely.
- Reword badges to be self-explanatory in place:
    "78% success" -> "78% likely to work"
- Any remaining explanation moves to an inline tooltip at the point of
  confusion, not a separate glossary block.

5. FIX "EVERYTHING LOOKS CLICKABE" / HIERARCHY
- Static info chips (timeline, buffer, risk labels) get a flat/outline
  style with no fill.
- Reserve filled pill styling only for things that are actually tappable.
- Lead with the success percentage as the dominant visual element
  (large number, e.g. 28px), not a same-size badge among others.
- Timeline and buffer become secondary supporting tags underneath.

6. MERGE "CHOOSE A SCENARIO" WITH ACTION PLAN
- Show a condensed action plan (headline recommendation + 1-2 action items)
  directly inside the expanded scenario card — no separate screen needed
  for the common case.
- "See full plan" link/button becomes optional extra depth.
- OPEN DECISION: confirm with team whether "see full plan" expands in
  place (accordion) or pushes to a real screen, in case compliance needs
  a dedicated page for full disclosures/T&Cs.

7. BREAK PRODUCT SILOS
- Add a cross-product row inside the action plan list (e.g. "Check your
  home loan eligibility") alongside Deposit Owl / Invest Owl suggestions.
- Same list, same visual treatment, but use a neutral icon (not the
  Owl-brand red icon) to signal it's a different product family.

8. FIX DELETE BUTTON
- Replace the large delete button on saved plan cards with a 3-dot
  overflow menu (Edit / Duplicate / Delete), or swipe-to-delete if plans
  render as list rows.


================================================
PART 2: NEW FEATURE — PLAY WITH THE NUMBERS
("Sandbox" / "Just exploring" entry point, renamed for user-facing copy)
================================================

COPY CHANGES
- Quick-start pill label: "Play with the numbers" (was "Just exploring")
- Screen subtitle under it: "See where you'd land" (optional, if space allows)
- Internal/code naming can stay as "sandbox" — this is a copy change only,
  not a rename of the underlying feature or folder structure.

GOAL
Let a user play with generic savings/timeline numbers without picking a
life event first, then optionally convert that exploration into a real
goal — carrying over whatever overlaps, asking fresh only for what the
playground couldn't have known.

SCOPE AND CONSTRAINTS
- Frontend only, mock data only. No backend, no persistence beyond
  in-memory/session state.
- Do not touch: Deposit Owl / Invest Owl feature folders, navigation root
  config, shared design tokens/theme files.
- New code in: src/features/planning-owl/sandbox/ (adjust path to match
  actual repo convention).
- Reuse existing currency formatter, slider component, and badge/tag
  styling already used elsewhere in the app — do not introduce new ones.

DATA CONTRACTS (types.ts)

interface SandboxState {
  monthlySavings: number;
  timelineYears: number;
  projectedTotal: number;
  suggestedTag: 'rainy_day' | 'property_deposit' | 'bigger_goal';
}

interface CarriedField {
  sandboxField: 'timelineYears' | 'projectedTotal' | 'monthlySavings';
  targetField: string;
  label: string;
}

interface NewField {
  field: string;
  label: string;
  inputType: 'currency' | 'text' | 'number';
}

interface GoalFieldMapping {
  goalId: string;
  carries: CarriedField[];
  asksNew: NewField[];
}

PROJECTION FORMULA (mock only, not connected to any real engine)

function calculateProjection(monthlySavings: number, timelineYears: number): number {
  return monthlySavings * 12 * timelineYears * 1.02;
}

function getSuggestedTag(projectedTotal: number): SandboxState['suggestedTag'] {
  if (projectedTotal < 20000) return 'rainy_day';
  if (projectedTotal < 80000) return 'property_deposit';
  return 'bigger_goal';
}

GOAL FIELD MAPPING CONFIG (goalFieldMappings.ts)
Single source of truth for what carries over vs what's asked fresh.
Start with "property" fully specified, "family" stubbed (since Starting a
family is still "coming soon"):

const GOAL_FIELD_MAPPINGS: Record<string, GoalFieldMapping> = {
  property: {
    goalId: 'property',
    carries: [
      { sandboxField: 'timelineYears', targetField: 'timeline', label: 'Timeline' },
      { sandboxField: 'projectedTotal', targetField: 'downpayment', label: 'Downpayment target' },
    ],
    asksNew: [
      { field: 'propertyValue', label: 'Property value', inputType: 'currency' },
    ],
  },
  family: {
    goalId: 'family',
    carries: [
      { sandboxField: 'timelineYears', targetField: 'timeline', label: 'Timeline' },
    ],
    asksNew: [
      { field: 'numberOfDependents', label: 'Number of dependents', inputType: 'number' },
      { field: 'targetBuffer', label: 'Target buffer', inputType: 'currency' },
    ],
  },
};

STATE PASSING
Use React Navigation route params to pass SandboxState between screens.
Do not introduce a global store for this — three primitive fields doesn't
justify it. Revisit only if a future goal needs to carry more than ~5 fields.

PlanningOwlSandbox: undefined;
PlanningOwlSandboxHandoff: { sandbox: SandboxState };
PropertyPlanForm: {
  prefilled?: { timeline?: number; downpayment?: number };
};

SCREENS TO BUILD

1. SandboxScreen.tsx
   - Two sliders: monthly savings (SGD 100-3000, step 100), timeline
     (1-15 years, step 1).
   - Live-updating projected total via calculateProjection.
   - Tag/badge below the result driven by getSuggestedTag.
   - Primary button "Make this a real plan" -> navigates to
     PlanningOwlSandboxHandoff with current SandboxState.
   - Plain button "Keep browsing without saving" -> navigates back, no
     state persisted.
   - Page title/header copy: "Play with the numbers". Subtext: "See where
     you'd land."

2. SandboxHandoffScreen.tsx
   - Receives sandbox: SandboxState via route params.
   - Shows read-only summary card: monthly savings, timeline, projected total.
   - Shows suggested-goal card derived from suggestedTag:
       rainy_day -> no specific goal suggestion, show generic "create a
                    plan" path
       property_deposit -> suggest "property"
       bigger_goal -> suggest "property" for now (only fully-shipped goal;
                      update when more goals ship)
   - Secondary button "Choose a different goal instead" opens the existing
     life-event picker (reuse, don't duplicate). On selection, re-render
     this screen's suggested-goal card using the new goalId's mapping.
   - Primary button "Create plan with these numbers" -> navigates to the
     relevant goal form, passing only the fields listed in that goal's
     `carries` array, computed via:

     function buildPrefilledParams(sandbox: SandboxState, mapping: GoalFieldMapping) {
       const result: Record<string, number> = {};
       for (const c of mapping.carries) {
         result[c.targetField] = sandbox[c.sandboxField] as number;
       }
       return result;
     }

3. Update existing property plan form screen (do not rebuild)
   - Accept new optional `prefilled` route param.
   - Fields with a prefilled value: render pre-filled, editable, with a
     "from sandbox" badge next to the label.
   - Property value field (always fresh): render with a "new" badge instead.
   - Do not change validation, submit logic, or layout structure beyond
     adding these badges and accepting prefilled values.

OUT OF SCOPE
- Education, getting married, career break mappings — leave as "coming
  soon," do not add mapping entries.
- Animation/transition polish beyond Moti defaults.
- Persisting state across app restarts.
- Connecting calculateProjection to any real interest-rate/investment engine.

ACCEPTANCE CHECKLIST
[ ] Sliders update result/tag live with no lag or stale state.
[ ] "Keep browsing without saving" leaves no residual state.
[ ] Handoff screen correctly maps property_deposit tag to property suggestion.
[ ] Switching goals correctly re-derives carried vs new fields via
    GOAL_FIELD_MAPPINGS.
[ ] Property form shows "from sandbox" badges only on actually-prefilled
    fields, "new" only on property value.
[ ] No changes to Deposit Owl, Invest Owl, navigation root, or theme files.
[ ] User-facing copy says "Play with the numbers," not "sandbox" or
    "just exploring," anywhere visible to the user.
```