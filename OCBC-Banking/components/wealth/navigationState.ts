// Shared navigation state to track whether the user has bypassed the landing page for investments
let hasBypassedLandingPage = false;

export function getHasBypassedLandingPage() {
  return hasBypassedLandingPage;
}

export function setHasBypassedLandingPage(value: boolean) {
  hasBypassedLandingPage = value;
}
