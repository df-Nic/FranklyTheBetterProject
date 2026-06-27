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

export const GOAL_FIELD_MAPPINGS: Record<string, GoalFieldMapping> = {
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
};
