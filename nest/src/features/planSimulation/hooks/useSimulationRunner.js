import { useCallback, useEffect, useRef, useState } from 'react';
import { deriveStateAt } from '../engine/deriveStateAt.js';

export function useSimulationRunner(script, { onComplete, autoStart = true } = {}) {
  const [state, setState] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef(null);
  const frameRef = useRef(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const complete = useCallback((activeScript) => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.(activeScript);
  }, []);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    startedAtRef.current = null;
    completedRef.current = false;
    setElapsed(0);
    setState(null);

    if (!script || !autoStart) return undefined;

    const tick = (now) => {
      if (startedAtRef.current === null) startedAtRef.current = now;
      const nextElapsed = Math.min(now - startedAtRef.current, script.durationMs);

      setElapsed(nextElapsed);
      setState(deriveStateAt(script, nextElapsed));

      if (nextElapsed >= script.durationMs) {
        complete(script);
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, [autoStart, complete, script]);

  const skip = useCallback(() => {
    if (!script || completedRef.current) return;
    cancelAnimationFrame(frameRef.current);
    setElapsed(script.durationMs);
    setState(deriveStateAt(script, script.durationMs));
    complete(script);
  }, [complete, script]);

  return {
    state,
    elapsed,
    skip,
  };
}
