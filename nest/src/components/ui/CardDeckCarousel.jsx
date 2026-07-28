import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';

export default function CardDeckCarousel({ cards, activeIndex, onChangeIndex }) {
  const handleNext = () => {
    onChangeIndex((activeIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    onChangeIndex((activeIndex - 1 + cards.length) % cards.length);
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none py-2 overflow-hidden">
      {/* 3D Stack Carousel Container */}
      <div className="relative w-full max-w-[340px] h-[195px] flex items-center justify-center">
        {cards.map((card, index) => {
          // Compute index relative to active card
          let offset = index - activeIndex;

          // Wrap offsets for circular deck effect
          if (offset < -Math.floor(cards.length / 2)) {
            offset += cards.length;
          } else if (offset > Math.floor(cards.length / 2)) {
            offset -= cards.length;
          }

          const isCenter = offset === 0;
          const isLeft = offset === -1 || (offset < 0 && Math.abs(offset) < Math.abs(offset + cards.length));
          const isRight = offset === 1 || (offset > 0 && Math.abs(offset) < Math.abs(offset - cards.length));
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          // Calculate transforms based on offset
          const zIndex = 30 - Math.abs(offset) * 10;
          const scale = isCenter ? 1 : 0.88 - Math.abs(offset) * 0.08;
          const translateX = offset * 45; // slight horizontal fan-out
          const translateY = Math.abs(offset) * 12; // lower background cards
          const rotateZ = offset * 4; // slight angled fan out
          const opacity = isCenter ? 1 : Math.max(0, 0.7 - Math.abs(offset) * 0.25);

          return (
            <motion.div
              key={card.id}
              onClick={() => onChangeIndex(index)}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -40 || velocity.x < -200) {
                  handleNext();
                } else if (offset.x > 40 || velocity.x > 200) {
                  handlePrev();
                }
              }}
              initial={false}
              animate={{
                x: translateX,
                y: translateY,
                scale,
                rotateZ,
                opacity,
                zIndex,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
              }}
              className="absolute w-[290px] h-[178px] rounded-[18px] p-5 flex flex-col justify-between shadow-2xl cursor-pointer overflow-hidden border border-white/20 backdrop-blur-md"
              style={{
                background: getCardBackground(card.id),
                boxShadow: isCenter
                  ? '0 20px 40px -12px rgba(0,0,0,0.6), 0 0 20px 2px rgba(255,255,255,0.1)'
                  : '0 10px 25px -10px rgba(0,0,0,0.4)',
              }}
            >
              {/* Metallic Glass / Holographic sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

              {/* Card Header: OCBC & Category Tag */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-black tracking-tighter text-white">OCBC</span>
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-widest">BANK</span>
                  </div>
                  <span className="text-[11px] font-bold text-white/90 tracking-tight mt-0.5 max-w-[170px] truncate">
                    {card.name.replace('OCBC ', '')}
                  </span>
                </div>
              </div>

              {/* EMV Chip & Contactless Icon */}
              <div className="relative z-10 flex items-center justify-between my-auto">
                <div className="flex items-center gap-2">
                  {/* EMV Chip graphic */}
                  <div
                    className="w-9 h-7 rounded-md border border-amber-300/40 relative overflow-hidden flex flex-col justify-between p-1 shadow-inner"
                    style={{
                      background: 'linear-[#E2B13C] linear-gradient(135deg, #F3D079 0%, #C49226 50%, #9B6F11 100%)',
                    }}
                  >
                    <div className="w-full h-[1px] bg-black/30 my-auto" />
                    <div className="w-full h-[1px] bg-black/30 my-auto" />
                  </div>
                  {/* Contactless waves */}
                  <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M8.5 14.5A5 5 0 0112 11" strokeLinecap="round" />
                    <path d="M6 12a8 8 0 016-6" strokeLinecap="round" />
                    <path d="M3.5 9.5a11 11 0 019-9" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Card Network Logo */}
                <span className="text-[12px] font-black italic tracking-wider text-white/90">
                  {card.network}
                </span>
              </div>

              {/* Card Footer: Cardholder & Expiry */}
              <div className="relative z-10 flex items-end justify-between text-white/90">
                <div className="flex flex-col">
                  <span className="text-[7.5px] uppercase font-bold text-white/60 tracking-widest">CARDHOLDER</span>
                  <span className="text-[10.5px] font-mono font-bold tracking-wider uppercase text-white">
                    OLIVIA TAN
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[7.5px] uppercase font-bold text-white/60 tracking-widest">EXPIRES</span>
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-white/90">08/29</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Carousel Controls & Page Dots */}
      <div className="flex items-center gap-4 mt-1.5 z-20">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-white text-zinc-700 shadow-md border border-zinc-200/80 active:scale-95 transition cursor-pointer hover:bg-zinc-50"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-1.5">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => onChangeIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex ? 'w-6 bg-[#D32F2F]' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-white text-zinc-700 shadow-md border border-zinc-200/80 active:scale-95 transition cursor-pointer hover:bg-zinc-50"
          aria-label="Next card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Custom Rich Color Gradients for authentic OCBC card visual appeal
function getCardBackground(cardId) {
  switch (cardId) {
    case 'ocbc-365':
      return 'linear-gradient(135deg, #1C1917 0%, #D32F2F 55%, #8B0000 100%)';
    case 'ocbc-frank':
      return 'linear-gradient(135deg, #0F172A 0%, #0284C7 60%, #00F5D4 100%)';
    case 'ocbc-90n':
      return 'linear-gradient(135deg, #09090B 0%, #1E293B 50%, #0D9488 100%)';
    case 'ocbc-titanium':
      return 'linear-gradient(135deg, #31103F 0%, #701A75 50%, #EC4899 100%)';
    case 'ocbc-voyage':
      return 'linear-gradient(135deg, #18181B 0%, #27272A 50%, #D4AF37 100%)';
    default:
      return 'linear-gradient(135deg, #1F2937 0%, #374151 100%)';
  }
}
