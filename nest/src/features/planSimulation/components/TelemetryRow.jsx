import { motion, useReducedMotion } from 'framer-motion';

export default function TelemetryRow({ name, Icon, color, data, completed = false }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color }}>
          <Icon size={10} className="text-white" />
        </div>
        <span className="min-w-0 flex-1 text-[10px] font-semibold leading-tight text-gray-700">{name}</span>
        <span className="text-[12px] font-bold text-gray-900">{data.displayPct}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: data.displayPct }}
          transition={reduce || completed ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D] shrink-0" />
        <span className="text-[9px] text-gray-400 leading-snug">{completed ? 'Scenario tests complete' : data.status}</span>
      </div>
    </div>
  );
}
