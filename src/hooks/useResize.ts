import { useState, useEffect, type RefObject } from 'react';

export function useResize(ref: RefObject<Element | null>) {
  const [size, setSize] = useState({ width: 1200, height: 720 });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        setSize({ width, height });
      }
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}
