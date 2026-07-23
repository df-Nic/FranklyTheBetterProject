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
import { AnimatePresence, motion } from 'framer-motion';

function AppContent() {
  const { page, planDetailOrigin, setPage } = useApp();

  // Background under plan-details depends on where the user came from
  const detailsOrigin = planDetailOrigin || 'home';

  const isUserLoggedIn = page === 'home' || page === 'plan-dashboard' || page === 'plan-details' || page === 'plan-view' || page === 'plan-milestones' || page === 'savings-breakdown' || page === 'opportunity-detail';
  const activeNavTab = (page === 'plan-dashboard' || page === 'plan-view' || page === 'plan-milestones' || page === 'savings-breakdown' || page === 'opportunity-detail' || (page === 'plan-details' && detailsOrigin === 'plan-dashboard')) ? 'plan' : 'home';

  const handleTabSelect = (tabId) => {
    if (tabId === 'home') {
      setPage('home');
    } else if (tabId === 'plan') {
      setPage('plan-dashboard');
    }
  };

  return (
    <MobileFrame>
      {/* No mode="wait" — simultaneous crossfade prevents white-page flash between routes */}
      <AnimatePresence>
        {page === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col overflow-hidden"
          >
            <LandingPage />
          </motion.div>
        )}
        {page === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col overflow-hidden"
          >
            <LoginPage />
          </motion.div>
        )}
        {(page === 'home' || (page === 'plan-details' && detailsOrigin === 'home')) && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col overflow-hidden z-10"
          >
            <HomePage />
          </motion.div>
        )}
        {/* plan-dashboard: visible on plan-dashboard page, or as background when plan-details was accepted */}
        {(page === 'plan-dashboard' || page === 'plan-view' || page === 'plan-milestones' || page === 'savings-breakdown' || page === 'opportunity-detail' || (page === 'plan-details' && detailsOrigin === 'plan-dashboard')) && (
          <motion.div
            key="plan-dashboard"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 flex flex-col overflow-hidden z-10"
          >
            <PlanDashboardPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent overlay components for logged-in views */}
      {isUserLoggedIn && (
        <>
          {page !== 'plan-milestones' && page !== 'savings-breakdown' && page !== 'opportunity-detail' && <ChatWidget />}
          <BottomNavBar activeTab={activeNavTab} onTabSelect={handleTabSelect} />
        </>
      )}

      {/* plan-details and plan-view are clip-circle overlays on top of whichever background is active */}
      <AnimatePresence>
        {page === 'plan-details' && (
          <PlanDetailsPage />
        )}
        {page === 'plan-view' && (
          <PlanViewPage />
        )}
        {page === 'plan-milestones' && (
          <motion.div
            key="plan-milestones"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
          >
            <PlanMilestonesPage />
          </motion.div>
        )}
        {page === 'savings-breakdown' && (
          <motion.div
            key="savings-breakdown"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
          >
            <SavingsBreakdownPage />
          </motion.div>
        )}
        {page === 'opportunity-detail' && (
          <motion.div
            key="opportunity-detail"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 overflow-hidden"
          >
            <OpportunityDetailPage />
          </motion.div>
        )}
      </AnimatePresence>
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
