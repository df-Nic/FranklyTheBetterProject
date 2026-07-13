import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const GlassCard = ({
  children,
  className,
  onClick,
  animateProps,
  hoverable = false,
  ...props
}) => {
  const baseClasses = 'bg-white/50 backdrop-blur-[25px] border border-white/70 rounded-[20px] shadow-[0_8px_32px_0_rgba(46,62,79,0.06)] overflow-hidden';
  
  if (onClick || hoverable) {
    return (
      <motion.div
        whileHover={hoverable ? { scale: 1.02, y: -2 } : undefined}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={clsx(baseClasses, 'cursor-pointer active-press', className)}
        {...animateProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={clsx(baseClasses, className)}
      {...animateProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
