import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import { ShieldAlert, Key, QrCode, Send, TrendingUp, Landmark, Grid, ArrowRight } from 'lucide-react';
import owlPlanning from '../assets/images/owl-planning.png';
import ocbcLogo from '../assets/images/OCBC-Bank-Logo.png';

const LandingPage = () => {
  const { navigate } = useApp();

  const quickAccessItems = [
    { id: 'onetoken', label: 'OneToken', icon: Key },
    { id: 'scanpay', label: 'Scan & Pay', icon: QrCode },
    { id: 'paynow', label: 'PayNow', icon: Send },
    { id: 'wealth', label: 'Wealth Insights', icon: TrendingUp },
    { id: 'forex', label: 'Foreign Exchange', icon: Landmark },
    { id: 'more', label: 'More', icon: Grid },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <div className="flex-1 w-full bg-[#FAFAFA] flex flex-col justify-between overflow-y-auto no-scrollbar relative px-6 py-6 select-none">
      {/* Animated Orbs */}
      <BackgroundOrb color="pink" size="320px" className="-top-16 -left-16" />
      <BackgroundOrb color="gold" size="380px" className="-bottom-20 -right-20" />

      {/* Header section (Logo) */}
      <div className="w-full flex justify-between items-center z-10 shrink-0 mb-8">
        <img
          src={ocbcLogo}
          alt="OCBC Bank Logo"
          className="h-8 object-contain"
        />
        <span className="text-xs font-bold px-2.5 py-1 bg-zinc-200/50 backdrop-blur-md rounded-full text-zinc-600 border border-zinc-300/30">
          SG PROTOTYPE
        </span>
      </div>

      {/* Content Area */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-start z-10"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-[42px] leading-[48px] font-black tracking-tight text-brand-secondary">
            Welcome to <br />
            <span className="text-brand-primary">OCBC</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">
            Seamless banking, intelligent wealth management.
          </p>
        </motion.div>

        {/* Quick Access Grid */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-3 gap-y-5 gap-x-3">
            {quickAccessItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate('login')}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div className="w-14 h-14 rounded-full border-[1.5px] border-zinc-300 flex items-center justify-center bg-transparent text-zinc-700 transition-all duration-200 group-hover:border-brand-primary group-hover:text-brand-primary group-active:scale-95 group-active:bg-zinc-100">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-600 text-center mt-2 leading-tight">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Action CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3.5 mb-8">
          {/* Primary Button */}
          <button
            onClick={() => navigate('login')}
            className="w-full h-[55px] bg-brand-secondary text-white font-bold rounded-xl shadow-lg shadow-brand-secondary/20 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] hover:bg-zinc-800 cursor-pointer"
          >
            <span>Log in to OCBC Singapore</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Secondary Button */}
          <button
            onClick={() => navigate('login')}
            className="w-full h-[55px] bg-white border-2 border-brand-primary/90 text-brand-primary font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.98] hover:bg-red-50/50 cursor-pointer"
          >
            <img
              src={owlPlanning}
              alt="Mascot"
              className="w-7 h-7 object-contain animate-bounce"
              style={{ animationDuration: '2.5s' }}
            />
            <span>Manage your wealth with NEST</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Security Advisory Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full bg-zinc-200/40 border border-zinc-300/30 rounded-xl p-3.5 z-10 shrink-0"
      >
        <div className="flex gap-2.5">
          <ShieldAlert className="w-5 h-5 text-brand-warning shrink-0 stroke-[2]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-zinc-700 leading-tight">
              Security Advisory
            </span>
            <p className="text-[10px] text-zinc-500 font-medium leading-normal mt-0.5">
              Beware of calls starting with pre-recorded messages. OCBC will never ask for PIN/OneToken.
              <a href="https://www.ocbc.com" target="_blank" rel="noreferrer" className="text-brand-accent font-semibold ml-1 inline-block">
                Learn more
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
