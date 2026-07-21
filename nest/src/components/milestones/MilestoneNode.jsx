// src/components/milestones/MilestoneNode.jsx
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

const TAG_TEXT = {
  completed: "Completed",
  current: "In progress",
  next: "Next milestone",
  upcoming: "Upcoming",
  goal: "Goal",
};

const DOT_STYLES = {
  completed: "bg-[#2E7D4F]",
  current: "bg-white border-[3px] border-[#C88A2E]",
  next: "bg-white border-[3px] border-[#C88A2E]",
  upcoming: "bg-white border-2 border-[#C88A2E]",
  goal: "bg-white border-2 border-[#CBB89B]",
};

const TAG_STYLES = {
  completed: "bg-[#2E7D4F] text-white",
  current: "bg-[#F3ECE1] text-[#7A5B2A]",
  next: "bg-[#FBEFD9] text-[#7A5B2A]",
  upcoming: "bg-[#F3ECE1] text-[#8A7F72]",
  goal: "bg-[#F3ECE1] text-[#8A7F72]",
};

export default function MilestoneNode({ milestone, position }) {
  const reduce = useReducedMotion();
  const isCurrent = milestone.state === "current" || milestone.state === "next";

  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`flex h-[26px] w-[26px] items-center justify-center rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.15)] ${DOT_STYLES[milestone.state]}`}
        >
          {milestone.state === "completed" && <Check size={14} strokeWidth={3} color="#fff" />}
        </div>

        {isCurrent && !reduce && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#C88A2E]"
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </div>

      <div
        className={`absolute top-1/2 w-[116px] -translate-y-1/2 rounded-xl bg-[#FFF9F2]/90 px-2.5 py-2 leading-tight shadow-[0_3px_12px_rgba(62,39,25,0.14)] backdrop-blur-sm ${
          position.labelSide === "right" ? "left-[44px] text-left" : "right-[44px] text-right"
        }`}
      >
        <div className="text-[12px] font-extrabold leading-[1.15] text-[#7C2230]">
          {milestone.name}
        </div>
        <div className="mb-1 mt-0.5 text-[11px] text-[#8A7F78]">{milestone.date}</div>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[9.5px] font-bold ${TAG_STYLES[milestone.state]}`}
        >
          {TAG_TEXT[milestone.state]}
        </span>
      </div>
    </div>
  );
}
