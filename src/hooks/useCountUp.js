import { useEffect, useRef, useState } from 'react';

// Animates from 0 up to `target` once the element is scrolled into view —
// runs only once per mount, and respects prefers-reduced-motion by jumping
// straight to the final value for anyone who's asked for less motion.
export function useCountUp(target, { duration = 1200 } = {}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setValue(target);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            const start = performance.now();
            function tick(now) {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - (1 - progress) ** 3; // ease-out cubic
              setValue(Math.round(eased * target));
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return [ref, value];
}
