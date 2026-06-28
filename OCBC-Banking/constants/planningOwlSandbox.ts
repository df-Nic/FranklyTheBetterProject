export interface SandboxState {
  monthlySavings: number;
  timelineYears: number;
  projectedTotal: number;
  suggestedTag: 'rainy_day' | 'property_deposit' | 'bigger_goal';
}

export type SandboxField = 'timelineYears' | 'projectedTotal' | 'monthlySavings';

export interface CarriedField {
  sandboxField: SandboxField;
  targetField: string;
  label: string;
}

export interface NewField {
  field: string;
  label: string;
  inputType: 'currency' | 'text' | 'number';
}

export interface GoalFieldMapping {
  goalId: string;
  carries: CarriedField[];
  asksNew: NewField[];
}

export type SandboxGoalId = 'custom' | 'property' | 'education' | 'wedding' | 'family' | 'career_break';

export interface RankedGoalSuggestion {
  goalId: SandboxGoalId;
  title: string;
  fitLabel: string;
  reason: string;
}

export function calculateProjection(monthlySavings: number, timelineYears: number): number {
  return monthlySavings * 12 * timelineYears * 1.02;
}

export function getSuggestedTag(projectedTotal: number): SandboxState['suggestedTag'] {
  if (projectedTotal < 20000) return 'rainy_day';
  if (projectedTotal < 80000) return 'property_deposit';
  return 'bigger_goal';
}

export function buildPrefilledParams(sandbox: SandboxState, mapping: GoalFieldMapping) {
  const result: Record<string, number> = {};
  for (const c of mapping.carries) {
    result[c.targetField] = sandbox[c.sandboxField] as number;
  }
  return result;
}

export function getRankedGoalSuggestions(sandbox: SandboxState): RankedGoalSuggestion[] {
  const { projectedTotal, timelineYears, monthlySavings } = sandbox;
  const suggestions: RankedGoalSuggestion[] =
    projectedTotal < 20000
      ? [
          {
            goalId: 'custom',
            title: 'Emergency savings',
            fitLabel: 'Best fit',
            reason: 'Your projected amount is better suited to money that stays easy to access.',
          },
          {
            goalId: 'family',
            title: 'Family emergency fund',
            fitLabel: 'Also possible',
            reason: 'The timeline can support a smaller recurring-cost buffer.',
          },
          {
            goalId: 'career_break',
            title: 'Career break',
            fitLabel: 'Lower fit',
            reason: 'This can model a short income gap, but the target may need a higher monthly habit.',
          },
        ]
      : projectedTotal < 60000
        ? [
            {
              goalId: 'wedding',
              title: 'Wedding plan',
              fitLabel: 'Best fit',
              reason: 'The projected total fits a staged expense with deposits and final payments.',
            },
            {
              goalId: 'education',
              title: 'Education fund',
              fitLabel: 'Also possible',
              reason: 'The amount can become a fee target if the date is clear.',
            },
            {
              goalId: 'custom',
              title: 'Custom savings goal',
              fitLabel: 'Flexible',
              reason: 'Use this if the goal is travel, renovation, rainy day savings, or something else.',
            },
            {
              goalId: 'property',
              title: 'Property plan',
              fitLabel: 'Early-stage',
              reason: 'This may cover part of a downpayment, but Owl will ask for property value next.',
            },
          ]
        : projectedTotal < 120000
          ? [
              {
                goalId: 'education',
                title: 'Education fund',
                fitLabel: 'Best fit',
                reason: 'The amount and timeline can support a larger fee target with cash kept aside.',
              },
              {
                goalId: 'property',
                title: 'Property plan',
                fitLabel: 'Also possible',
                reason: 'The projected amount can be tested against a downpayment plan.',
              },
              {
                goalId: 'wedding',
                title: 'Wedding plan',
                fitLabel: 'Comfortable fit',
                reason: 'This can cover a larger wedding budget while preserving emergency cash.',
              },
              {
                goalId: 'career_break',
                title: 'Career break',
                fitLabel: 'Also possible',
                reason: 'A known timeline can help model how long expenses could be covered.',
              },
            ]
          : [
              {
                goalId: 'property',
                title: 'Property plan',
                fitLabel: 'Best fit',
                reason: 'The projected total is large enough to test against downpayment planning.',
              },
              {
                goalId: 'education',
                title: 'Education fund',
                fitLabel: 'Also possible',
                reason: 'The amount can support a high-fee education target if the date is known.',
              },
              {
                goalId: 'career_break',
                title: 'Career break',
                fitLabel: 'Also possible',
                reason: 'The amount can model a longer income gap with cash kept available.',
              },
              {
                goalId: 'custom',
                title: 'Custom savings goal',
                fitLabel: 'Flexible',
                reason: 'Use this if Owl should shape the amount around a goal you name yourself.',
              },
            ];

  if (timelineYears >= 5 && monthlySavings >= 1000 && !suggestions.some((suggestion) => suggestion.goalId === 'family')) {
    return [
      ...suggestions.slice(0, 3),
      {
        goalId: 'family',
        title: 'Family emergency fund',
        fitLabel: 'Longer-term fit',
        reason: 'A steady monthly habit can build a family buffer before expenses rise.',
      },
    ];
  }

  return suggestions;
}

export const GOAL_FIELD_MAPPINGS: Record<SandboxGoalId, GoalFieldMapping> = {
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
  custom: {
    goalId: 'custom',
    carries: [
      { sandboxField: 'projectedTotal', targetField: 'targetAmount', label: 'Target amount' },
      { sandboxField: 'monthlySavings', targetField: 'monthlySavings', label: 'Monthly savings' },
      { sandboxField: 'timelineYears', targetField: 'timeline', label: 'Timeline' },
    ],
    asksNew: [
      { field: 'goalName', label: 'Goal name', inputType: 'text' },
    ],
  },
  family: {
    goalId: 'family',
    carries: [
      { sandboxField: 'timelineYears', targetField: 'timeline', label: 'Timeline' },
    ],
    asksNew: [
      { field: 'numberOfDependents', label: 'Number of dependents', inputType: 'number' },
      { field: 'targetBuffer', label: 'Emergency savings target', inputType: 'currency' },
    ],
  },
  education: {
    goalId: 'education',
    carries: [
      { sandboxField: 'projectedTotal', targetField: 'educationCost', label: 'Education cost' },
      { sandboxField: 'timelineYears', targetField: 'educationTimeframe', label: 'Timeline' },
    ],
    asksNew: [
      { field: 'educationFor', label: 'Who this is for', inputType: 'text' },
    ],
  },
  wedding: {
    goalId: 'wedding',
    carries: [
      { sandboxField: 'projectedTotal', targetField: 'weddingBudget', label: 'Wedding budget' },
      { sandboxField: 'monthlySavings', targetField: 'weddingMonthlySavings', label: 'Monthly savings' },
      { sandboxField: 'timelineYears', targetField: 'weddingTimeframe', label: 'Timeline' },
    ],
    asksNew: [],
  },
  career_break: {
    goalId: 'career_break',
    carries: [
      { sandboxField: 'timelineYears', targetField: 'careerBreakTimeframe', label: 'Timeline' },
    ],
    asksNew: [
      { field: 'monthlyExpenses', label: 'Monthly expenses', inputType: 'currency' },
      { field: 'breakDuration', label: 'Break duration', inputType: 'number' },
    ],
  },
};
