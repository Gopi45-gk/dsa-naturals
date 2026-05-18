import { useEffect } from "react";
import { animateCounter } from "../helpers";

export function useCounter(ref, target) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { animateCounter(ref.current, target, 2000); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, target]);
}
