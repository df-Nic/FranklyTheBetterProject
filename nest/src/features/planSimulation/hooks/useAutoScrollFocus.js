import { useEffect } from 'react';

export function useAutoScrollFocus(phase, sectionRefs) {
  useEffect(() => {
    const sectionByPhase = {
      simulating: sectionRefs.telemetry,
      debating: sectionRefs.debate,
      judging: sectionRefs.judge,
    };
    const ref = sectionByPhase[phase];

    if (ref?.current) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      ref.current.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'nearest',
      });
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
}
