import { useRef, useEffect } from 'react';
import type { TimelineMarker } from '../../types';
import { RewindIcon, PlayIcon, PauseIcon, ForwardIcon } from '../icons';

// Timeline spans D-7 to D+7 (14 days total, scrub=0.5 = NOW)
// scrub=0   → 7 days in the future  (D+7)
// scrub=0.5 → NOW                   (D+0)
// scrub=1   → 7 days in the past    (D-7)
const DAYS_HALF = 7;
const TOTAL_DAYS = DAYS_HALF * 2; // 14

export function scrubToDaysOffset(value: number): number {
  // Returns days relative to NOW: positive = past, negative = future
  return (value - 0.5) * TOTAL_DAYS; // 0→-7, 0.5→0, 1→+7
}

interface TimelineProps {
  value: number;
  onChange: (v: number) => void;
  playing: boolean;
  onPlayToggle: () => void;
  markers: TimelineMarker[];
  now: Date;
}

function formatTimelineDate(now: Date, value: number): string {
  const offsetDays = scrubToDaysOffset(value);
  const t = new Date(now.getTime() - offsetDays * 24 * 3600 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())} ${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}Z`;
}

const DENSITY_PATH = (() => {
  const pts: [number, number][] = [];
  const N = 80;
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * 100;
    const v = 0.3 + 0.25 * Math.sin(i * 0.4) + 0.2 * Math.sin(i * 0.13 + 1) + 0.15 * Math.sin(i * 0.7 + 2);
    pts.push([x, 100 - v * 80]);
  }
  return 'M0,100 ' + pts.map(p => `L${p[0]},${p[1]}`).join(' ') + ' L100,100 Z';
})();

// Axis labels: D+7 on left → D-7 on right, NOW in center
// 7 labels with uniform 1/6 spacing avoids overlap near NOW
const AXIS_LABELS = [
  { label: 'D+7', pos: 0 },
  { label: 'D+5', pos: 1/6 },
  { label: 'D+3', pos: 2/6 },
  { label: 'NOW', pos: 0.5, isNow: true },
  { label: 'D-3', pos: 4/6 },
  { label: 'D-5', pos: 5/6 },
  { label: 'D-7', pos: 1 },
];

export default function Timeline({ value, onChange, playing, onPlayToggle, markers, now }: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handle = (e: MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onChange(t);
  };

  useEffect(() => {
    const mv = (e: MouseEvent) => { if (dragging.current) handle(e); };
    const up = () => { dragging.current = false; };
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', mv);
      window.removeEventListener('mouseup', up);
    };
  }, [onChange]);

  const timeLabel = formatTimelineDate(now, value);
  // NOW is at scrub=0.5 — markers right of center (< 0.5) are "future"
  const nowPos = 0.5;

  return (
    <div className="timeline">
      <div className="tl-left">
        <button className="tl-btn" onClick={() => onChange(Math.max(0, value - 0.05))}>
          <RewindIcon width={14} height={14} />
        </button>
        <button className="tl-btn tl-play" onClick={onPlayToggle}>
          {playing ? <PauseIcon width={14} height={14} /> : <PlayIcon width={14} height={14} />}
        </button>
        <button className="tl-btn" onClick={() => onChange(Math.min(1, value + 0.05))}>
          <ForwardIcon width={14} height={14} />
        </button>
      </div>

      <div className="tl-center">
        <div className="tl-time">{timeLabel}</div>
        <div
          ref={trackRef}
          className="tl-track"
          onMouseDown={(e) => { dragging.current = true; handle(e.nativeEvent); }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="tl-density">
            <path d={DENSITY_PATH} fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.25)"
              strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* NOW divider line at 50% */}
          <div className="tl-now-line" />

          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="tl-tick" style={{ left: `${(i / 14) * 100}%` }} />
          ))}

          {markers.map((m, i) => {
            // m.t: 0=past(D-7), 1=future(D+7) — isPast means left of playhead AND left of NOW
            const isPast = m.t >= value && m.t >= nowPos;
            return (
              <div
                key={i}
                className={`tl-marker tl-marker-${m.kind}${isPast ? '' : ' tl-marker-future'}`}
                style={{ left: `${m.t * 100}%` }}
              />
            );
          })}

          <div className="tl-fill" style={{ width: `${value * 100}%` }} />
          <div className="tl-playhead" style={{ left: `${value * 100}%` }}>
            <div className="tl-playhead-line" />
            <div className="tl-playhead-knob" />
          </div>
        </div>

        <div className="tl-axis">
          {AXIS_LABELS.map(({ label, pos, isNow }) => (
            <span
              key={label}
              className={isNow ? 'now' : ''}
              style={{ position: 'absolute', left: `${pos * 100}%`, transform: 'translateX(-50%)' }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="tl-right">
        <div className="tl-speed">
          <span className="dim">PLAYBACK</span>
          <span className="val">1×</span>
        </div>
      </div>
    </div>
  );
}
