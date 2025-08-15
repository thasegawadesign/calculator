import { useEffect, useState } from "react";

export function useEdgeFades<T extends HTMLElement>(
  scrollRef: React.RefObject<T>,
  enabled: boolean,
) {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !enabled) {
      setShowLeft(false);
      setShowRight(false);
      return;
    }

    const EPS = 1;
    let ticking = false;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) {
        setShowLeft(false);
        setShowRight(false);
        return;
      }
      const left = el.scrollLeft;
      setShowLeft(left > EPS);
      setShowRight(left < max - EPS);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild as Element);

    const mo = new MutationObserver(() => update());
    mo.observe(el, { childList: true, subtree: true, characterData: true });

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("orientationchange", update);
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("orientationchange", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
      mo.disconnect();
    };
  }, [scrollRef, enabled]);

  return { showLeft, showRight };
}
