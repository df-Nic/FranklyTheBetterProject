import React from 'react';

const MobileFrame = ({ children }) => {
  return (
    <div className="min-h-dvh w-full bg-slate-900 flex items-center justify-center p-0 md:p-6 overflow-hidden select-none">
      {/* Outer Phone Frame - visible on md screens, full screen on small screens */}
      <div className="relative w-full h-dvh md:w-[390px] md:h-[844px] md:rounded-[50px] md:border-[12px] md:border-zinc-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] bg-[#FAFAFA] flex flex-col overflow-hidden transition-all duration-300">
        

        {/* Dynamic Safe Area Padding for content */}
        <div className="flex-1 w-full relative flex flex-col overflow-hidden">
          {children}
        </div>

        {/* iOS Home Indicator Bar - absolute positioned floating on top */}
        <div className="hidden md:flex absolute bottom-2 left-0 right-0 justify-center pointer-events-none z-50">
          <div className="w-[130px] h-[5px] bg-zinc-800/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
