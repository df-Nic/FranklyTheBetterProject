/**
 * AgentOwl — NEST sub-agent mascot using the real 3D-rendered art.
 *
 * Drop the four WebP files into src/assets/agents/:
 *   owl-cashflow.webp   owl-yield.webp   owl-sequencing.webp   owl-judge.webp
 *
 * API is the same as the SVG placeholder that came before this file.
 * Nothing outside this file changes on the swap.
 *
 * Props
 * ─────
 * variant   'cashflow' | 'yield' | 'sequencing' | 'judge'
 * size      number  — height in px (width scales to keep aspect ratio 1:1)
 * crop      'full' | 'head'
 *           'head' crops the top 52% of the image for avatar thumbnails.
 *           At 40px this resolves to a clean face+chest read.
 * className string
 * title     string  — sets alt text; omit for decorative owls (aria-hidden)
 * style     object  — forwarded to the wrapper
 */

import owlCashflow   from '@/assets/agents/owl-cashflow.webp';
import owlYield      from '@/assets/agents/owl-yield.webp';
import owlSequencing from '@/assets/agents/owl-sequencing.webp';
import owlJudge      from '@/assets/agents/owl-judge.webp';

const SOURCES = {
  cashflow:   owlCashflow,
  yield:      owlYield,
  sequencing: owlSequencing,
  judge:      owlJudge,
};

/** Descriptive alt text used when title is not passed but a11y context needs it. */
const DESCRIPTIONS = {
  cashflow:   'Cashflow Lever agent — red owl holding a calculator and cash',
  yield:      'Asset Yield Lever agent — red owl holding a growth chart tablet',
  sequencing: 'Sequencing agent — red owl holding a checklist clipboard',
  judge:      'Judge Agent — red owl in judge robes holding a gavel',
};

export default function AgentOwl({
  variant  = 'cashflow',
  size     = 140,
  crop     = 'full',
  className = '',
  title,
  style,
  ...rest
}) {
  const src    = SOURCES[variant] ?? SOURCES.cashflow;
  const isHead = crop === 'head';
  const hasLabel = Boolean(title);

  /**
   * 'head' crop: images are 1:1. We show the top 52% of the image.
   * Implemented with object-position + a fixed height container so no
   * second network request is needed.
   */
  if (isHead) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${className}`}
        style={{ width: size, height: size, ...style }}
        role={hasLabel ? 'img' : 'presentation'}
        aria-label={hasLabel ? title : undefined}
        aria-hidden={hasLabel ? undefined : true}
        {...rest}
      >
        <img
          src={src}
          alt=""
          width={size}
          height={Math.round(size / 0.52)}   // show top 52% inside the container
          className="absolute inset-x-0 top-0 w-full object-cover object-top"
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={hasLabel ? title : ''}
      aria-hidden={hasLabel ? undefined : true}
      className={`shrink-0 object-contain ${className}`}
      style={style}
      loading="eager"
      decoding="async"
      draggable={false}
      {...rest}
    />
  );
}

/**
 * Preload all four owls as soon as the plan-input screen mounts,
 * so the tournament card is never blank on first paint.
 *
 * Usage:
 *   import { preloadOwls } from '@/features/planSimulation/components/AgentOwl';
 *   useEffect(() => { preloadOwls(); }, []);
 */
export function preloadOwls() {
  Object.values(SOURCES).forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}
