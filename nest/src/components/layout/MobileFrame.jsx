import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

const MobileFrame = ({ children }) => {
  // Display current time in HH:MM format
  const currentTime = '09:41';

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-0 md:p-6 overflow-hidden select-none">
      {/* Outer Phone Frame - visible on md screens, full screen on small screens */}
      <div className="relative w-full h-screen md:w-[390px] md:h-[844px] md:rounded-[50px] md:border-[12px] md:border-zinc-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] bg-[#FAFAFA] flex flex-col overflow-hidden transition-all duration-300">
        
        {/* iOS StatusBar - visible on all but hides safe areas on real devices */}
        <div className="h-11 w-full bg-[#FAFAFA]/40 backdrop-blur-md px-6 flex justify-between items-center z-50 relative shrink-0">
          {/* Time */}
          <span className="text-xs font-bold text-zinc-800 tracking-tight">{currentTime}</span>
          
          {/* Mock Notch / Dynamic Island on desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-2 w-[110px] h-[25px] bg-zinc-950 rounded-full z-50" />

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-zinc-800">
            <Signal className="w-3.5 h-3.5 fill-current stroke-[2]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2]" />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] font-bold">88%</span>
              <Battery className="w-4 h-4 rotate-0 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Dynamic Safe Area Padding for content */}
        <div className="flex-1 w-full relative flex flex-col overflow-hidden">
          {children}
        </div>

        {/* iOS Home Indicator Bar - only on desktop simulator */}
        <div className="hidden md:block h-5 w-full bg-[#FAFAFA]/10 backdrop-blur-md flex justify-center items-end pb-2 shrink-0 z-50">
          <div className="w-[130px] h-[5px] bg-zinc-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
