import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import MobileFrame from './components/layout/MobileFrame';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PlanDashboardPage from './pages/PlanDashboardPage';
import PlanDetailsPage from './pages/PlanDetailsPage';
import PlanViewPage from './pages/PlanViewPage';
import PlanMilestonesPage from './pages/PlanMilestonesPage';
import SavingsBreakdownPage from './pages/SavingsBreakdownPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import BottomNavBar from './components/layout/BottomNavBar';
import ChatWidget from './components/ui/ChatWidget';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import PayNowContactsPage from './pages/PayNowContactsPage';
import PayNowAmountPage from './pages/PayNowAmountPage';
import PayNowConfirmPage from './pages/PayNowConfirmPage';
import PayNowSuccessPage from './pages/PayNowSuccessPage';
import RiskProfilingPage from './pages/RiskProfilingPage';
import PlanChangeOptionPage from './pages/PlanChangeOptionPage';
import ExpenseOptimizerPage from './pages/ExpenseOptimizerPage';
import PlanHealerPage from './pages/PlanHealerPage';
import AccountDetailPage from './pages/AccountDetailPage';
import PlanSimulationScreen from './features/planSimulation/PlanSimulationScreen';
import ReasoningLogPage from './features/planSimulation/ReasoningLogPage';
import PlanLiquidityDetailsPage from './pages/PlanLiquidityDetailsPage';
import PageTransitionLoader from './components/ui/PageTransitionLoader';

/**
 * RoutePage — thin wrapper around motion.div that disables pointer-events
 * the instant a route starts its AnimatePresence exit animation.
 * This prevents an exiting (fading/sliding out) page from intercepting
 * clicks that belong to the newly-entering page underneath it.
 */
function RoutePage({ children, className, style, ...motionProps }) {
  const isPresent = useIsPresent();
  return (
    <motion.div
      className={className}
      style={{ ...style, pointerEvents: isPresent ? 'auto' : 'none' }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

// Iris-animated wrapper for RiskProfilingPage — mirrors how PlanDetailsPage enters/exits
function RiskProfilingIrisWrapper() {
  const { clickPos } = useApp();
  const x = clickPos?.x ?? 195;
  const y = clickPos?.y ?? 422;
  const initialClip = `circle(0% at ${x}px ${y}px)`;
  const animateClip = `circle(150% at ${x}px ${y}px)`;

  return (
    <motion.div
      initial={{ clipPath: initialClip }}
      animate={{ clipPath: animateClip }}
      exit={{ clipPath: initialClip }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      className="absolute inset-0 z-50 bg-brand-primary flex flex-col overflow-hidden"
    >
      {/* Delayed content fade-in: lets the red iris expand first before content appears */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
        className="w-full h-full flex flex-col"
      >
        <RiskProfilingPage />
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const { page, planDetailOrigin, setPage, isNavigating, setPaynowContact, setPaynowAmount, setPaynowReference } = useApp();

  // Background under plan-details depends on where the user came from
  const detailsOrigin = planDetailOrigin || 'home';

  const isPayNowPage = page === 'paynow-contacts' || page === 'paynow-amount' || page === 'paynow-confirm' || page === 'paynow-success';
  const isPlanPage = page === 'plan-dashboard' || page === 'plan-view' || page === 'plan-milestones' || page === 'savings-breakdown' || page === 'opportunity-detail' || page === 'plan-change-option' || page === 'expense-optimizer' || page === 'plan-healer' || page === 'reasoning-log' || page === 'plan-liquidity-details';
  const isUserLoggedIn = page === 'home' || page === 'plan-details' || isPlanPage || isPayNowPage || page === 'risk-profiling' || page === 'plan-simulation';
  const isRiskProfilingBackground = page === 'plan-details' && detailsOrigin === 'risk-profiling';
  const activeNavTab = isPayNowPage
    ? 'pay'
    : (isPlanPage || (page === 'plan-details' && detailsOrigin === 'plan-dashboard') ? 'plan' : 'home');

  const handleTabSelect = (tabId) => {
    if (tabId === 'home') {
      setPage('home');
    } else if (tabId === 'plan') {
      setPage('plan-dashboard');
    } else if (tabId === 'pay') {
      setPaynowContact(null);
      setPaynowAmount('');
      setPaynowReference('');
      setPage('paynow-contacts');
    }
  };

  return (
    <MobileFrame>
      {/* No mode="wait" — simultaneous crossfade prevents white-page flash between routes.
          RoutePage wrappers disable pointer-events during exit so the fading page
          never intercepts clicks meant for the newly-entering page. */}
      <AnimatePresence>
        {page === 'landing' && (
          <RoutePage
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden"
          >
            <LandingPage />
          </RoutePage>
        )}
        {page === 'login' && (
          <RoutePage
            key="login"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden"
          >
            <LoginPage />
          </RoutePage>
        )}
        {(page === 'home' || page === 'risk-profiling' || (page === 'plan-details' && detailsOrigin === 'home')) && (
          <RoutePage
            key="home"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden z-10"
          >
            <HomePage />
          </RoutePage>
        )}
        {/* risk-profiling stays mounted as background only when plan-details opens on top of it */}
        {isRiskProfilingBackground && (
          <RoutePage
            key="risk-profiling-bg"
            animate={{ opacity: 1, x: 0 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden z-10"
          >
            <RiskProfilingPage />
          </RoutePage>
        )}
        {/* plan-dashboard: visible on plan-dashboard page, or as background when plan-details was opened from plan-dashboard */}
        {(page === 'plan-dashboard' || (page === 'plan-details' && (detailsOrigin === 'plan-dashboard' || !detailsOrigin))) && (
          <RoutePage
            key="plan-dashboard"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden z-10"
          >
            <PlanDashboardPage />
          </RoutePage>
        )}
        {page === 'expense-optimizer' && (
          <RoutePage
            key="expense-optimizer"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden z-10"
          >
            <ExpenseOptimizerPage />
          </RoutePage>
        )}
        {page === 'paynow-contacts' && (
          <RoutePage
            key="paynow-contacts"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden z-10"
          >
            <PayNowContactsPage />
          </RoutePage>
        )}
        {page === 'paynow-amount' && (
          <RoutePage
            key="paynow-amount"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden z-10"
          >
            <PayNowAmountPage />
          </RoutePage>
        )}
        {page === 'paynow-confirm' && (
          <RoutePage
            key="paynow-confirm"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden z-10"
          >
            <PayNowConfirmPage />
          </RoutePage>
        )}
        {page === 'paynow-success' && (
          <RoutePage
            key="paynow-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden z-20"
          >
            <PayNowSuccessPage />
          </RoutePage>
        )}

      </AnimatePresence>

      {/* Persistent overlay components for logged-in views */}
      {isUserLoggedIn && !isPayNowPage && page !== 'risk-profiling' && page !== 'plan-simulation' && page !== 'reasoning-log' && !isRiskProfilingBackground && (
        <>
          {page !== 'plan-milestones' && page !== 'savings-breakdown' && page !== 'opportunity-detail' && page !== 'plan-change-option' && page !== 'expense-optimizer' && page !== 'plan-healer' && page !== 'account-detail' && page !== 'plan-liquidity-details' && <ChatWidget />}
          {page !== 'plan-change-option' && page !== 'plan-healer' && page !== 'account-detail' && page !== 'plan-liquidity-details' && <BottomNavBar activeTab={activeNavTab} onTabSelect={handleTabSelect} />}
        </>
      )}

      {/* plan-details, plan-view, and risk-profiling are clip-circle overlays on top of whichever background is active */}
      <AnimatePresence>
        {page === 'plan-simulation' && (
          <RoutePage
            key="plan-simulation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[60] overflow-y-auto scroll-ios no-scrollbar"
          >
            <PlanSimulationScreen />
          </RoutePage>
        )}
        {page === 'plan-details' && (
          <PlanDetailsPage />
        )}
        {page === 'plan-view' && (
          <PlanViewPage />
        )}
        {/* risk-profiling uses the same Iris clip-circle animation as plan-details */}
        {page === 'risk-profiling' && (
          <RiskProfilingIrisWrapper key="risk-profiling-iris" />
        )}
        {(page === 'plan-milestones' || (page === 'plan-details' && detailsOrigin === 'plan-milestones')) && (
          <RoutePage
            key="plan-milestones"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
            style={{ pointerEvents: page === 'plan-milestones' ? 'auto' : 'none' }}
          >
            <PlanMilestonesPage />
          </RoutePage>
        )}
        {page === 'reasoning-log' && (
          <RoutePage
            key="reasoning-log"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-40 overflow-hidden"
          >
            <ReasoningLogPage />
          </RoutePage>
        )}
        {page === 'savings-breakdown' && (
          <RoutePage
            key="savings-breakdown"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
            style={{ pointerEvents: page === 'savings-breakdown' ? 'auto' : 'none' }}
          >
            <SavingsBreakdownPage />
          </RoutePage>
        )}
        {page === 'opportunity-detail' && (
          <RoutePage
            key="opportunity-detail"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
            style={{ pointerEvents: page === 'opportunity-detail' ? 'auto' : 'none' }}
          >
            <OpportunityDetailPage />
          </RoutePage>
        )}
        {page === 'plan-change-option' && (
          <RoutePage
            key="plan-change-option"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
            style={{ pointerEvents: page === 'plan-change-option' ? 'auto' : 'none' }}
          >
            <PlanChangeOptionPage />
          </RoutePage>
        )}
        {page === 'plan-healer' && (
          <RoutePage
            key="plan-healer"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
          >
            <PlanHealerPage />
          </RoutePage>
        )}
        {page === 'account-detail' && (
          <RoutePage
            key="account-detail"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
          >
            <AccountDetailPage />
          </RoutePage>
        )}
        {page === 'plan-liquidity-details' && (
          <RoutePage
            key="plan-liquidity-details"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
          >
            <PlanLiquidityDetailsPage />
          </RoutePage>
        )}
      </AnimatePresence>

      {/* Page transition loading overlay */}
      <PageTransitionLoader visible={isNavigating} />
    </MobileFrame>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
