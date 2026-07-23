import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowLeft, ChevronsRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';

const PayNowConfirmPage = () => {
  const {
    navigate,
    paynowContact,
    paynowAmount,
    paynowReference,
    paynowSourceAccount,
    accountsData,
    setPage
  } = useApp();

  const [sliderWidth, setSliderWidth] = useState(0);
  const trackRef = useRef(null);
  const handleRef = useRef(null);

  // Recipient details
  const name = paynowContact?.name || 'Ivan Heng';
  const detailString = paynowContact
    ? `${paynowContact.phone}${paynowContact.vpa ? ` • ${paynowContact.vpa}` : ''}`
    : '+65 88888888 • Ivanhengsj';

  const amountDisplay = parseFloat(paynowAmount || '0').toFixed(2);

  // Framer motion drag setup
  const dragX = useMotionValue(0);
  const handleWidth = 48; // width of drag handle is 48px (w-12)
  const padding = 6; // track padding p-1.5 is 6px
  const maxDrag = sliderWidth - handleWidth - padding * 2;

  const targetMax = maxDrag > 0 ? maxDrag : 1;

  // Transform drag distance into progress width
  // At x = 0, width is 0px (no red background visible at all)
  // At x > 0, width follows the right edge of the circle (dragX + handleWidth + padding)
  // At x = maxDrag, width is the full sliderWidth to completely fill the track
  const progressWidth = useTransform(
    dragX,
    [0, 1, targetMax],
    [0, 55, sliderWidth]
  );

  // Transform drag distance into text opacity (fade out text as slider moves right)
  const textOpacity = useTransform(dragX, [0, targetMax * 0.7], [1, 0]);

  // Transform drag distance into "Make payment" text opacity (fade in as slider moves right)
  const makePaymentOpacity = useTransform(dragX, [targetMax * 0.3, targetMax * 0.8], [0, 1]);

  // Update slider width on mount / resize
  useEffect(() => {
    if (trackRef.current) {
      setSliderWidth(trackRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (trackRef.current) {
        setSliderWidth(trackRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (event, info) => {
    // If user dragged it to at least 92% of the way, confirm transaction
    if (dragX.get() >= maxDrag * 0.92) {
      // Complete transaction: subtract balance from source account
      if (paynowSourceAccount) {
        paynowSourceAccount.balance -= parseFloat(paynowAmount);
      }
      
      // Navigate to success page
      navigate('paynow-success');
    } else {
      // Smoothly animate back to start using Framer Motion's spring animate
      animate(dragX, 0, { type: 'spring', damping: 25, stiffness: 220 });
    }
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative overflow-hidden select-none">
      {/* Background Orbs */}
      <BackgroundOrb color="pink" size="320px" className="-top-10 -right-10" />
      <BackgroundOrb color="peach" size="240px" className="bottom-10 -left-10" />

      {/* Header */}
      <header className="pt-6 pb-4 h-auto w-full bg-white/40 backdrop-blur-xl border-b border-white/30 px-4 flex items-center justify-between z-40 shrink-0 sticky top-0">
        <button
          onClick={() => navigate('paynow-amount')}
          className="w-9 h-9 rounded-full bg-white border border-zinc-200/60 flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-[18px] h-[18px] stroke-[2.5]" />
        </button>
        <div className="w-9 h-9" /> {/* Spacer */}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 flex flex-col gap-6 z-10">
        
        {/* Review amount block */}
        <div className="flex flex-col gap-1 px-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Review payment of</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-4xl font-black text-zinc-900 tracking-tight">{amountDisplay}</span>
            <span className="text-base font-black text-zinc-400 tracking-tight">SGD</span>
          </div>
        </div>

        {/* Transaction Cards details */}
        <div className="flex flex-col gap-4">
          
          {/* Target Card: has standard red vertical highlight on left */}
          <div className="flex items-stretch bg-white border border-zinc-200/50 rounded-2xl overflow-hidden shadow-sm shadow-zinc-200/20">
            {/* The vertical red bar on left side matching Screenshot 3! */}
            <div className="w-1.5 bg-brand-primary" />
            
            <div className="p-4 flex flex-col gap-1.5 flex-1 justify-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Pay to</span>
              <h4 className="text-sm font-black text-zinc-900 leading-tight tracking-tight mt-0.5">{name}</h4>
              <p className="text-[10px] font-semibold text-zinc-400 leading-none">{detailString}</p>
            </div>
          </div>

          {/* Source Card */}
          <GlassCard className="p-4 border-white/70 flex flex-col gap-1.5 justify-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">From</span>
            <h4 className="text-sm font-black text-zinc-900 leading-tight tracking-tight mt-0.5">
              {paynowSourceAccount?.name || '360 Account'}
            </h4>
            <p className="text-[10px] font-semibold text-zinc-400 leading-none">
              {paynowSourceAccount?.number || '001-23456-789'}
            </p>
          </GlassCard>

          {/* Reference Card (if provided) */}
          {paynowReference && (
            <GlassCard className="p-4 border-white/70 flex flex-col gap-1.5 justify-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Reference</span>
              <h4 className="text-xs font-bold text-zinc-800 leading-tight">{paynowReference}</h4>
            </GlassCard>
          )}

        </div>

        {/* Warning text */}
        <div className="mt-auto pt-6 flex flex-col gap-4 items-center">
          <p className="text-[10px] font-semibold text-zinc-400 text-center max-w-[250px] leading-normal">
            Please check that all details are correct before proceeding.
          </p>

          {/* Custom Slide to Pay Component */}
          <div
            ref={trackRef}
            className="w-full h-[58px] bg-brand-secondary rounded-full relative flex items-center p-1.5 select-none overflow-hidden shadow-md shadow-brand-secondary/20"
          >
            {/* Sliding background progress indicator */}
            <motion.div 
              className="absolute top-0 bottom-0 bg-brand-primary rounded-full pointer-events-none z-0"
              style={{ left: '0px', width: progressWidth }}
            />

            {/* Slider track text - default */}
            <motion.div
              style={{ opacity: textOpacity }}
              className="absolute inset-0 flex items-center justify-center text-white text-[12px] font-black tracking-wider pointer-events-none z-10"
            >
              Slide to pay
            </motion.div>

            {/* Slider track text - active drag */}
            <motion.div
              style={{ opacity: makePaymentOpacity }}
              className="absolute inset-0 flex items-center justify-center text-white text-[12px] font-black tracking-wider pointer-events-none z-10"
            >
              Make payment
            </motion.div>

            {/* Draggable thumb/handle */}
            <motion.div
              ref={handleRef}
              drag="x"
              dragConstraints={{ left: 0, right: maxDrag }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-secondary cursor-pointer shadow-md z-10 shrink-0"
            >
              <ChevronsRight className="w-5 h-5 stroke-[2.8]" />
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PayNowConfirmPage;
