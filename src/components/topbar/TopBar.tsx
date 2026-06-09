import { useState, useEffect } from 'react';
import type { Metrics } from '../../types';
import MetricChip from './MetricChip';

interface TopBarProps {
  metrics: Metrics;
  now: Date;
  nextPass: { name: string; minutes: number; seconds: number };
}

function formatClock(now: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    timeStr: `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`,
    dateStr: `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`,
  };
}

export default function TopBar({ metrics, now, nextPass }: TopBarProps) {
  const { timeStr, dateStr } = formatClock(now);

  // Fix 2: live sync age counter
  const [syncAge, setSyncAge] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSyncAge(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const syncLabel = syncAge < 60
    ? `${syncAge}s ago`
    : `${Math.floor(syncAge / 60)}m ${syncAge % 60}s ago`;

  // Fix 8: next pass countdown
  const [passCountdown, setPassCountdown] = useState(
    nextPass.minutes * 60 + nextPass.seconds
  );
  useEffect(() => {
    const t = setInterval(() => setPassCountdown(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const passMin = Math.floor(passCountdown / 60);
  const passSec = passCountdown % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <header className="topbar">
      <div className="topbar-title">
        <div className="topbar-name">AEGIS<span className="dim">/orbital</span></div>
        <div className="topbar-sub">PLANETARY HAZARD MONITORING · GLOBAL · REAL-TIME</div>
      </div>

      <div className="topbar-metrics">
        <MetricChip label="GLOBAL RISK" value={metrics.globalRiskIndex} suffix="/100" tone="warn" />
        <MetricChip label="ACTIVE" value={metrics.activeEvents} suffix=" events" tone="cool" />
        <MetricChip label="CRITICAL" value={metrics.criticalCount} suffix=" sites" tone="alert" />
        <MetricChip label="EXPOSED" value={metrics.populationExposed} suffix=" pop." tone="cool" />
        <MetricChip label="SATCOM" value={`${metrics.satellitesOnline}/${metrics.satellitesTotal}`} suffix="" tone="ok" />
        <div className="topbar-nextpass">
          <div className="topbar-nextpass-lbl">NEXT PASS</div>
          <div className="topbar-nextpass-val">
            {nextPass.name} <span className="dim">in</span> {passMin}:{pad(passSec)}
          </div>
        </div>
      </div>

      <div className="topbar-clock">
        <div className="clock-time">{timeStr}</div>
        <div className="clock-meta">UTC · {dateStr}</div>
        <div className="clock-sync">
          SYNC <span className="clock-sync-dot" /> {syncLabel}
        </div>
      </div>
    </header>
  );
}
