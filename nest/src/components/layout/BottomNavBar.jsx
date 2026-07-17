import React from 'react';
import { Home, Compass, Send, Gift, Grid } from 'lucide-react';

const BottomNavBar = ({ activeTab = 'home', onTabSelect }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, enabled: true },
    { id: 'plan', label: 'Plan', icon: Compass, enabled: true },
    { id: 'pay', label: 'Pay&transfer', icon: Send, enabled: false },
    { id: 'rewards', label: 'Rewards', icon: Gift, enabled: false },
    { id: 'more', label: 'More', icon: Grid, enabled: false },
  ];

  return (
    <div
      style={{ 
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="absolute left-4 right-4 h-16 bg-white/35 border border-white/40 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] z-40 flex items-center justify-around px-2 py-1 select-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === activeTab;

        return (
          <button
            key={item.id}
            disabled={!item.enabled}
            onClick={() => item.enabled && onTabSelect?.(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 group ${
              item.enabled ? 'cursor-pointer' : 'cursor-default opacity-40'
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-colors ${
                isActive
                  ? 'text-brand-primary stroke-[2.2]'
                  : 'text-zinc-400 stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[9px] font-bold mt-1 tracking-tight transition-colors ${
                isActive
                  ? 'text-brand-primary'
                  : 'text-zinc-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavBar;
