import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import MobileFrame from './components/layout/MobileFrame';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { AnimatePresence, motion } from 'framer-motion';

function AppContent() {
  const { page } = useApp();

  return (
    <MobileFrame>
      <AnimatePresence mode="wait">
        {page === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 w-full flex flex-col overflow-hidden"
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
            className="flex-1 w-full flex flex-col overflow-hidden"
          >
            <LoginPage />
          </motion.div>
        )}
        {page === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="flex-1 w-full flex flex-col overflow-hidden"
          >
            <HomePage />
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
