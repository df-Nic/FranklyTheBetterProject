import { motion, useReducedMotion } from "framer-motion";
import owlImage from "../../assets/images/ocbc-owl-transparent.png";
import fullProgressImage from "../../assets/images/milestone-scene-progress-full.png";
import {
  getCurrentMilestoneIndex,
  getJourneyPosition,
  getJourneyProgressPosition,
} from "../../data/milestonePlans";

export default function JourneyOverlay({ milestones, fundingProgress, fromFundingProgress }) {
  const reduceMotion = useReducedMotion();
  const currentIndex = getCurrentMilestoneIndex(milestones);
  const currentPosition = Number.isFinite(fundingProgress)
    ? getJourneyProgressPosition(fundingProgress)
    : getJourneyPosition(currentIndex, milestones.length);
  const isTraveling = !reduceMotion
    && Number.isFinite(fromFundingProgress)
    && Number.isFinite(fundingProgress)
    && fundingProgress > fromFundingProgress;
  const travelPositions = isTraveling
    ? Array.from({ length: 9 }, (_, index) => {
      const progress = fromFundingProgress + ((fundingProgress - fromFundingProgress) * index) / 8;
      return getJourneyProgressPosition(progress);
    })
    : [currentPosition];
  const travelTimes = travelPositions.map((_, index) =>
    travelPositions.length === 1 ? 1 : index / (travelPositions.length - 1));
  const journeyTransition = reduceMotion
    ? { duration: 0 }
    : {
      duration: isTraveling ? 1.5 : 1.25,
      ease: [0.22, 1, 0.36, 1],
      ...(isTraveling ? { times: travelTimes } : {}),
    };

  return (
    <>
      <motion.img
        src={fullProgressImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
        animate={{
          clipPath: isTraveling
            ? travelPositions.map((position) => `inset(${position.y}% 0 0 0)`)
            : `inset(${currentPosition.y}% 0 0 0)`,
          filter: isTraveling
            ? ["brightness(1)", "brightness(1.18) drop-shadow(0 0 7px rgba(200,138,46,0.65))", "brightness(1)"]
            : "brightness(1)",
        }}
        transition={{
          clipPath: journeyTransition,
          filter: reduceMotion ? { duration: 0 } : { duration: 1.5, times: [0, 0.55, 1] },
        }}
      />

      <motion.div
        className="pointer-events-none absolute z-30 h-[88px] w-[82px] -translate-x-1/2 -translate-y-[88%]"
        animate={{
          left: isTraveling
            ? travelPositions.map((position) => `${position.x}%`)
            : `${currentPosition.x}%`,
          top: isTraveling
            ? travelPositions.map((position) => `${position.y}%`)
            : `${currentPosition.y}%`,
        }}
        transition={{ left: journeyTransition, top: journeyTransition }}
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
      </motion.div>
    </>
  );
}
