import { useCallback, useEffect, useReducer } from 'react';
import { cookingTimerReducer, createCookingTimer } from '../utils/cookingTimer';
import type { CookingTimerAction, CookingTimerInput } from '../utils/cookingTimer';

export function useCookingSession(durations: number[], recipeId: string) {
  const [timer, dispatch] = useReducer(cookingTimerReducer, durations, createCookingTimer);
  const durationsKey = JSON.stringify(durations);
  useEffect(() => {
    dispatch({ type: 'load', durations: JSON.parse(durationsKey) as number[] });
  }, [durationsKey, recipeId]);
  useEffect(() => {
    if (timer.deadlineMs === null && timer.graceDeadlineMs === null) return;
    const interval = window.setInterval(() => {
      if (!document.hidden) dispatch({ type: 'tick', now: Date.now() });
    }, 250);
    return () => window.clearInterval(interval);
  }, [timer.deadlineMs, timer.graceDeadlineMs]);
  useEffect(() => {
    const visibilityChanged = () => dispatch({ type: document.hidden ? 'pauseGrace' : 'tick', now: Date.now() });
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => document.removeEventListener('visibilitychange', visibilityChanged);
  }, []);
  const send = useCallback((action: CookingTimerInput) => {
    dispatch({ ...action, now: Date.now() } as CookingTimerAction);
  }, []);
  return { timer, send };
}
