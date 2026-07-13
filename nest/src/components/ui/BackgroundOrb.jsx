import React from 'react';
import { clsx } from 'clsx';

const BackgroundOrb = ({ className, color = 'pink', size = '300px' }) => {
  const colorMap = {
    pink: 'bg-radial from-[#FFB6C1]/35 to-transparent',
    peach: 'bg-radial from-[#FFE4E1]/45 to-transparent',
    gold: 'bg-radial from-[#FFE4B5]/40 to-transparent',
    red: 'bg-radial from-brand-primary/20 to-transparent',
  };

  return (
    <div
      className={clsx(
        'absolute rounded-full pointer-events-none background-orb z-0',
        colorMap[color] || colorMap.pink,
        className
      )}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default BackgroundOrb;
