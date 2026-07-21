import { motion, useReducedMotion } from "framer-motion";
import owlImage from "../../assets/images/ocbc-owl-transparent.png";
import fullProgressImage from "../../assets/images/milestone-scene-progress-full.png";
import { getCurrentMilestoneIndex, getJourneyPosition } from "../../data/milestonePlans";

export default function JourneyOverlay({ milestones }) {
  const reduceMotion = useReducedMotion();
  const currentIndex = getCurrentMilestoneIndex(milestones);
  const currentPosition = getJourneyPosition(currentIndex, milestones.length);

  return (
    <>
      <img
        src={fullProgressImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
        style={{ clipPath: `inset(${currentPosition.y}% 0 0 0)` }}
      />

      <div
        className="pointer-events-none absolute z-30 h-[88px] w-[82px] -translate-x-1/2 -translate-y-[88%]"
        style={{ left: `${currentPosition.x}%`, top: `${currentPosition.y}%` }}
        role="img"
        aria-label="Current milestone"
      >
        <motion.div
          className="relative h-full w-full"
          initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <motion.span
            className="absolute bottom-0 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-[#35180F]/30 blur-[2px]"
            animate={reduceMotion ? { scaleX: 1, opacity: 0.25 } : {
              scaleX: [1, 0.84, 1],
              opacity: [0.28, 0.16, 0.28],
            }}
            transition={reduceMotion ? { duration: 0 } : {
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.img
            src={owlImage}
            alt=""
            className="absolute bottom-1 left-0 h-[82px] w-[82px] object-contain drop-shadow-[0_5px_5px_rgba(45,20,14,0.2)]"
            animate={reduceMotion ? { y: 0, rotate: 0, scale: 1 } : {
              y: [0, -4, 0],
              rotate: [-1.5, 1.5, -1.5],
              scale: [1, 1.02, 1],
            }}
            transition={reduceMotion ? { duration: 0 } : {
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
