import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';
import { ArrowLeft, Fingerprint, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { navigate, setUser, loginRedirectPage, setLoginRedirectPage } = useApp();
  const [accessId, setAccessId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');



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
    const target = loginRedirectPage || 'home';
    setLoginRedirectPage(null);
    navigate(target);
  };

  const handleBiometricsTap = () => {
    setUser((prev) => ({ ...prev, accessId: 'BIOMETRIC_USER' }));
    const target = loginRedirectPage || 'home';
    setLoginRedirectPage(null);
    navigate(target);
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative px-6 py-6 overflow-y-auto overflow-x-hidden no-scrollbar select-none">
      {/* Background Orb in top-right */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <BackgroundOrb color="peach" size="350px" className="-top-12 -right-12" />
      </div>

      {/* Back button */}
      <div className="w-full flex items-center justify-start z-10 shrink-0 mb-6">
        <button
          onClick={() => navigate('landing')}
          className="w-10 h-10 rounded-full bg-white/60 border border-white/80 backdrop-blur-md flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Main glass card login form wrapper */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 py-4">
        <GlassCard className="w-full max-w-[340px] px-5 py-6">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-zinc-400 font-medium mt-1 leading-normal">
              Sign in to your wealth dashboard
            </p>
          </div>

          {/* Reserved Space for Error Message to prevent layout shift */}
          <div className="h-[42px] w-full flex items-center justify-center mb-2 shrink-0">
            {error && (
              <div className="w-full text-xs font-semibold text-brand-primary bg-red-50 border border-red-200/50 rounded-lg p-2.5 text-center">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSignIn} className="flex flex-col gap-4">

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
                  className={`w-full h-11 pl-3.5 pr-10 bg-white/70 border border-zinc-200 rounded-xl text-zinc-800 text-sm focus:outline-none focus:ring-1.5 focus:ring-brand-primary focus:border-brand-primary placeholder-zinc-400 transition-all duration-150 ${
                    pin ? 'tracking-widest font-semibold' : 'tracking-normal font-medium'
                  }`}
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
              className="w-14 h-14 rounded-full bg-zinc-200/80 border border-zinc-300/40 flex items-center justify-center text-brand-primary transition-all duration-150 active:scale-[0.95] hover:bg-zinc-300/40 cursor-pointer shadow-sm relative group"
            >
              {/* Pulsing ring behind fingerprint when hover */}
              <span className="absolute inset-0 rounded-full border-2 border-brand-primary/20 scale-100 group-hover:scale-110 group-hover:opacity-100 transition-all duration-200" />
              <Fingerprint className="w-7 h-7 stroke-[1.8]" />
            </button>
            <span className="text-[11px] font-bold text-zinc-500 mt-2">
              Tap to use Biometrics
            </span>
          </div>
        </GlassCard>
      </div>


    </div>
  );
};

export default LoginPage;
