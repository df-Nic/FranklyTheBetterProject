import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';
import { ArrowLeft, Fingerprint, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import ocbcLogo from '../assets/images/OCBC-Bank-Logo.png';

const LoginPage = () => {
  const { navigate, setUser } = useApp();
  const [accessId, setAccessId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  // Biometrics simulation states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle' | 'scanning' | 'success'

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!accessId.trim()) {
      setError('Please enter your Access ID');
      return;
    }
    if (pin.length < 6) {
      setError('PIN must be at least 6 digits');
      return;
    }
    
    setUser((prev) => ({ ...prev, accessId }));
    navigate('home');
  };

  const handleBiometricsTap = () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setError('');

    // Simulate scanning loop
    setTimeout(() => {
      setScanStatus('success');
      setTimeout(() => {
        setIsScanning(false);
        setUser((prev) => ({ ...prev, accessId: 'BIOMETRIC_USER' }));
        navigate('home');
      }, 1000);
    }, 2000);
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative px-6 py-6 overflow-y-auto no-scrollbar select-none">
      {/* Background Orb in top-right */}
      <BackgroundOrb color="peach" size="350px" className="-top-12 -right-12" />

      {/* Back button */}
      <div className="w-full flex items-center justify-between z-10 shrink-0 mb-6">
        <button
          onClick={() => navigate('landing')}
          className="w-10 h-10 rounded-full bg-white/60 border border-white/80 backdrop-blur-md flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <img
          src={ocbcLogo}
          alt="OCBC logo"
          className="h-6 object-contain opacity-80"
        />
      </div>

      {/* Main glass card login form wrapper */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 py-4">
        <GlassCard className="w-full max-w-[340px] px-5 py-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-zinc-400 font-medium mt-1 leading-normal">
              Sign in to your wealth dashboard
            </p>
          </div>

          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            {error && (
              <div className="text-xs font-semibold text-brand-primary bg-red-50 border border-red-200/50 rounded-lg p-2.5 text-center">
                {error}
              </div>
            )}

            {/* Access ID Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="accessId" className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Access ID
              </label>
              <input
                id="accessId"
                type="text"
                value={accessId}
                onChange={(e) => setAccessId(e.target.value)}
                placeholder="Enter Access ID"
                className="w-full h-11 px-3.5 bg-white/70 border border-zinc-200 rounded-xl text-zinc-800 text-sm font-medium focus:outline-none focus:ring-1.5 focus:ring-brand-primary focus:border-brand-primary placeholder-zinc-400 transition-all duration-150"
              />
            </div>

            {/* PIN Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pin" className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                PIN
              </label>
              <div className="relative">
                <input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN"
                  className="w-full h-11 pl-3.5 pr-10 bg-white/70 border border-zinc-200 rounded-xl text-zinc-800 text-sm font-semibold tracking-widest focus:outline-none focus:ring-1.5 focus:ring-brand-primary focus:border-brand-primary placeholder-zinc-400 transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 active:text-zinc-600 focus:outline-none cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forget Links */}
            <div className="text-right">
              <a href="https://www.ocbc.com" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-brand-accent hover:underline">
                Forgot access details?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full h-[50px] bg-brand-primary hover:bg-[#c11e15] text-white font-bold rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer mt-2"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5 gap-3">
            <div className="flex-1 h-[1px] bg-zinc-200" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-[1px] bg-zinc-200" />
          </div>

          {/* Biometrics */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleBiometricsTap}
              className="w-[70px] h-[70px] rounded-full bg-zinc-200/80 border border-zinc-300/40 flex items-center justify-center text-brand-primary transition-all duration-150 active:scale-[0.95] hover:bg-zinc-300/40 cursor-pointer shadow-sm relative group"
            >
              {/* Pulsing ring behind fingerprint when hover */}
              <span className="absolute inset-0 rounded-full border-2 border-brand-primary/20 scale-100 group-hover:scale-110 group-hover:opacity-100 transition-all duration-200" />
              <Fingerprint className="w-9 h-9 stroke-[1.8]" />
            </button>
            <span className="text-[11px] font-bold text-zinc-500 mt-2">
              Tap to use Biometrics
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Interactive Fullscreen Scanning Modal Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-[280px] bg-white/10 border border-white/20 rounded-[30px] p-6 flex flex-col items-center text-center shadow-2xl"
            >
              {/* Scan box */}
              <div className="relative w-36 h-36 border-2 border-white/30 rounded-2xl flex items-center justify-center overflow-hidden mb-6 bg-zinc-900/60">
                {scanStatus === 'scanning' && (
                  <>
                    {/* Laser line animation */}
                    <div className="absolute left-0 right-0 h-1 bg-brand-primary/80 shadow-[0_0_10px_2px_rgba(225,37,27,0.7)] scan-laser z-10" />
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-white opacity-40"
                    >
                      <Fingerprint className="w-20 h-20 stroke-[1.5]" />
                    </motion.div>
                  </>
                )}

                {scanStatus === 'success' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  >
                    <Check className="w-10 h-10 stroke-[3]" />
                  </motion.div>
                )}
              </div>

              {/* Status Header & Description */}
              <h3 className="text-base font-bold text-white mb-1">
                {scanStatus === 'scanning' ? 'Verifying Identity' : 'Access Granted'}
              </h3>
              <p className="text-xs text-zinc-300 font-medium">
                {scanStatus === 'scanning'
                  ? 'Keep your finger on the sensor...'
                  : 'Welcome back to OCBC NEST.'}
              </p>

              {/* Loading spinner */}
              {scanStatus === 'scanning' && (
                <div className="mt-4 flex items-center justify-center text-zinc-400 gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Processing</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
