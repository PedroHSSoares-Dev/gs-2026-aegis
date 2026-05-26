import { useState, useEffect } from 'react';

export function useTimeline() {
  const [scrub, setScrub] = useState(0.5); // start at NOW (center of D-7 → D+7)
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setScrub(s => {
        const next = s + 0.005;
        if (next >= 1) return 1;
        return next;
      });
    }, 80);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    if (scrub >= 1 && playing) setPlaying(false);
  }, [scrub, playing]);

  const togglePlay = () => setPlaying(p => !p);

  return { scrub, playing, setScrub, togglePlay };
}
