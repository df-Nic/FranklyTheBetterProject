import { Href, Router } from 'expo-router';
import {
  getPlanningOwlReturnContext,
  markPlanningOwlActionComplete,
  PlanningOwlProductContext,
} from './planningOwlProductActions';

export function getRouteParamString(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (typeof rawValue !== 'string') {
    return undefined;
  }

  const trimmed = rawValue.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function buildPlanningOwlProductContext(params: Record<string, string | string[] | undefined>): PlanningOwlProductContext {
  return {
    source: getRouteParamString(params.source),
    completionKey: getRouteParamString(params.completionKey),
    planId: getRouteParamString(params.planId),
    actionId: getRouteParamString(params.actionId),
    productTarget: getRouteParamString(params.productTarget) as PlanningOwlProductContext['productTarget'],
    planTitle: getRouteParamString(params.planTitle),
    scenarioTitle: getRouteParamString(params.scenarioTitle),
    timeline: getRouteParamString(params.timeline),
    recommendedAmount: getRouteParamString(params.recommendedAmount),
    event: getRouteParamString(params.event) as PlanningOwlProductContext['event'],
    insight: getRouteParamString(params.insight),
  };
}

export function completePlanningOwlProductAction(router: Router, context: PlanningOwlProductContext) {
  markPlanningOwlActionComplete(context.completionKey, context.actionId);

  const returnContext = getPlanningOwlReturnContext(context.completionKey);
  if (returnContext) {
    router.replace({
      pathname: '/(tabs)/planning-owl',
      params: {
        completedAction: context.actionId ?? '',
        completionKey: context.completionKey ?? '',
      },
    } as Href);
    return;
  }

  router.replace('/(tabs)/planning-owl' as Href);
}
