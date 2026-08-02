export function createOpportunityLifecycle(hasPendingHealing, triggeredAt = new Date().toISOString()) {
  const route = hasPendingHealing ? 'healer' : 'standalone';
  return { state: route, route, triggeredAt };
}

export function completeOpportunityLifecycle(current) {
  return { ...current, state: 'handled' };
}
