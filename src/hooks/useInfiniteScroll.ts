import { useCallback, useEffect, useRef } from "react";

export function useInfiniteScroll(
  callbackParam: () => void,
  isActive: boolean
): (node: HTMLElement | null) => void {
  const observer = useRef<IntersectionObserver | null>(null);

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries.length === 0) {
        return;
      }

      if (entries[0].isIntersecting && isActive) {
        callbackParam();
      }
    },
    [callbackParam, isActive]
  );

  const infiniteScrollRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        return;
      }

      observer.current?.disconnect();

      observer.current = new IntersectionObserver(callback, {
        rootMargin: "400px",
        // threshold: 1.0,
      });
      observer.current.observe(node);
    },
    [callback]
  );

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  return infiniteScrollRef;
}
