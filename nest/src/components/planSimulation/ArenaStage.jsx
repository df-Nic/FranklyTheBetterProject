import { motion, useReducedMotion } from 'framer-motion';
import AgentOwl from './AgentOwl';

/**
 * ArenaStage — the "Finding your best-fit strategy" visual.
 *
 * Three agents orbit the marble podium. `activeAgent` lifts whichever lever
 * is currently being stress-tested. The arena backdrop is pure SVG (no binary
 * asset) so the file is self-contained; the owls composite cleanly because
 * their WebP files have full alpha transparency.
 *
 * Props
 * ─────
 * activeAgent  'cashflow' | 'yield' | 'sequencing' | null
 * className    string
 */

/**
 * Positions tuned for the real 1:1 owl images.
 * left/top are percentages of the stage container.
 * size is the `size` prop passed to AgentOwl (height px).
 * zIndex controls layering — sequencing (front-centre) sits highest.
 */
const SEATS = {
  cashflow:   { left: '5%',  top: '26%', size: 124, zIndex: 2 },
  yield:      { left: '58%', top: '22%', size: 124, zIndex: 2 },
  sequencing: { left: '30%', top: '44%', size: 138, zIndex: 3 },
};

export default function ArenaStage({ activeAgent = null, className = '' }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-[#F0E9DF] ${className}`}
      style={{ aspectRatio: '4 / 3' }}
    >
      {/* ── backdrop: marble podium ────────────────────────────────── */}
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="arena-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F6EFE6" />
            <stop offset="100%" stopColor="#E4D8C8" />
          </linearGradient>
          <radialGradient id="arena-floor" cx="50%" cy="45%" r="62%">
            <stop offset="0%"   stopColor="#FFFBF5" />
            <stop offset="100%" stopColor="#DDD0BC" />
          </radialGradient>
          <linearGradient id="arena-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#EDE0CB" />
            <stop offset="100%" stopColor="#C8B08A" />
          </linearGradient>
        </defs>

        {/* room wall */}
        <rect width="400" height="300" fill="url(#arena-wall)" />

        {/* faint financial-chart wallpaper */}
        <g opacity="0.13" stroke="#8B1A22" fill="none" strokeWidth="2">
          <path d="M230 94l20-18 13 11 24-27" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M287 60h13v13"              strokeLinecap="round" strokeLinejoin="round" />
          <g fill="#8B1A22" stroke="none">
            <rect x="318" y="83"  width="9" height="28" rx="2" />
            <rect x="332" y="68"  width="9" height="43" rx="2" />
            <rect x="346" y="53"  width="9" height="58" rx="2" />
          </g>
          <g strokeWidth="1.5" strokeLinecap="round">
            <path d="M58 72h60M58 82h46M58 92h54M58 102h36" />
          </g>
        </g>

        {/* outer rim shadow */}
        <ellipse cx="200" cy="218" rx="180" ry="68" fill="#B89E80" opacity="0.25" />

        {/* rim */}
        <ellipse cx="200" cy="213" rx="178" ry="66" fill="url(#arena-rim)" />

        {/* floor */}
        <ellipse cx="200" cy="207" rx="158" ry="56" fill="url(#arena-floor)" />

        {/* marble seam lines on rim */}
        <g stroke="#C8A87A" strokeWidth="1.2" opacity="0.5">
          {Array.from({ length: 16 }).map((_, idx) => {
            const a = (idx / 16) * Math.PI * 2;
            return (
              <line
                key={idx}
                x1={200 + Math.cos(a) * 158} y1={207 + Math.sin(a) * 56}
                x2={200 + Math.cos(a) * 178} y2={213 + Math.sin(a) * 66}
              />
            );
          })}
        </g>
      </svg>

      {/* ── orbiting arrows ──────────────────────────────────────────── */}
      <motion.svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full pointer-events-none"
        aria-hidden="true"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        style={{ transformOrigin: '50% 69%' }}
      >
        <g stroke="rgba(255,255,255,0.80)" strokeWidth="5.5" fill="none" strokeLinecap="round">
          {[0, 120, 240].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 200 207)`}>
              {/* arc segment */}
              <path d="M102 182a110 56 0 0 1 56-34" />
              {/* arrowhead */}
              <path d="M158 148l-15 3M158 148l-5 14" />
            </g>
          ))}
        </g>
      </motion.svg>

      {/* ── agent owls ───────────────────────────────────────────────── */}
      {Object.entries(SEATS).map(([id, seat], idx) => {
        const isActive = activeAgent === id;
        return (
          <motion.div
            key={id}
            className="absolute"
            style={{
              left:   seat.left,
              top:    seat.top,
              zIndex: seat.zIndex,
            }}
            animate={
              reduce
                ? { scale: isActive ? 1.06 : 1 }
                : {
                    y:     [0, -8, 0],
                    scale: isActive ? 1.08 : 1,
                  }
            }
            transition={{
              y:     { duration: 3.2 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
            }}
          >
            <AgentOwl variant={id} size={seat.size} />

            {/* active-agent glow ring under the owl */}
            {isActive && !reduce && (
              <motion.span
                className="pointer-events-none absolute -inset-x-2 -bottom-1 block h-4 rounded-full
                           bg-[#8B1A22] blur-lg"
                animate={{ opacity: [0.12, 0.35, 0.12] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
