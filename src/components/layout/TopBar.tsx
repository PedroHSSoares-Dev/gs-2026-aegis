import { useAegis } from '../../context/AegisContext';
import MetricChip from './MetricChip';

function formatClock(now: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    timeStr: `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`,
    dateStr: `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`,
  };
}

export default function TopBar() {
  const { metrics, now } = useAegis();
  const { timeStr, dateStr } = formatClock(now);

  return (
    <header className="topbar">
      <div className="topbar-title">
        <div className="topbar-name">AEGIS<span className="dim">/orbital</span></div>
        <div className="topbar-sub">PLANETARY HAZARD MONITORING · OPS-WEST · SECTOR 04</div>
      </div>

      <div className="topbar-metrics">
        <MetricChip label="GLOBAL RISK" value={metrics.globalRiskIndex} suffix="/100" tone="warn" />
        <MetricChip label="ACTIVE" value={metrics.activeEvents} suffix=" events" tone="cool" />
        <MetricChip label="CRITICAL" value={metrics.criticalCount} suffix=" sites" tone="alert" />
        <MetricChip label="EXPOSED" value={metrics.populationExposed} suffix=" pop." tone="cool" />
        <MetricChip label="SATCOM" value={`${metrics.satellitesOnline}/${metrics.satellitesTotal}`} suffix="" tone="ok" />
      </div>

      <div className="topbar-clock">
        <div className="clock-time">{timeStr}</div>
        <div className="clock-meta">UTC · {dateStr}</div>
        <div className="clock-sync">
          SYNC <span className="clock-sync-dot" /> {metrics.lastSync}
        </div>
      </div>
    </header>
  );
}
