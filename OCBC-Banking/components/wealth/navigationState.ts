// Shared navigation state to track whether the user has completed the owl onboarding quiz.
// Once completed via any owl (planning / investment / deposit), all owls skip the quiz.

let hasCompletedOwlQuiz = false;

/** Route to redirect to after the quiz + risk-swipe flow finishes. */
let pendingOwlDestination: string = '/wealth/dashboard';

export function getHasCompletedOwlQuiz() {
  return hasCompletedOwlQuiz;
}

export function setHasCompletedOwlQuiz(value: boolean) {
  hasCompletedOwlQuiz = value;
}

export function getPendingOwlDestination(): string {
  return pendingOwlDestination;
}

export function setPendingOwlDestination(destination: string) {
  pendingOwlDestination = destination;
}

// ---------------------------------------------------------------------------
// Legacy aliases kept so nothing else breaks while the rename propagates.
// ---------------------------------------------------------------------------
/** @deprecated Use getHasCompletedOwlQuiz() */
export function getHasBypassedLandingPage() {
  return hasCompletedOwlQuiz;
}

/** @deprecated Use setHasCompletedOwlQuiz() */
export function setHasBypassedLandingPage(value: boolean) {
  hasCompletedOwlQuiz = value;
}
