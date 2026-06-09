import type { DisasterEvent } from '../types';
import { TIMELINE_TOTAL_DAYS } from '../constants';

export function scrubToDaysOffset(value: number): number {
  // scrub=0 → D-7 (past, daysBack=+7)
  // scrub=0.5 → NOW (daysBack=0)
  // scrub=1 → D+7 (future, daysBack=-7)
  return (0.5 - value) * TIMELINE_TOTAL_DAYS;
}

export function formatTimelineDate(now: Date, value: number): string {
  const offsetDays = scrubToDaysOffset(value);
  const t = new Date(now.getTime() - offsetDays * 24 * 3600 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())} ${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}Z`;
}

/**
 * For each event id, linearly interpolate the risk score between the two
 * snapshots that bracket `daysBack`. Single-snapshot events return their
 * fixed risk. Falls back to the nearest snapshot when daysBack is outside
 * the covered range.
 */
export function interpolateRisks(
  events: DisasterEvent[],
  daysBack: number,
): Map<string, number> {
  const byId = new Map<string, DisasterEvent[]>();
  for (const ev of events) {
    if (!byId.has(ev.id)) byId.set(ev.id, []);
    byId.get(ev.id)!.push(ev);
  }

  const result = new Map<string, number>();

  for (const [id, snapshots] of byId) {
    if (snapshots.length === 1) {
      result.set(id, snapshots[0].risk);
      continue;
    }

    // Sort descending by detectedDaysAgo (most-past first)
    const sorted = [...snapshots].sort((a, b) => b.detectedDaysAgo - a.detectedDaysAgo);

    let lower: DisasterEvent | null = null;
    let upper: DisasterEvent | null = null;

    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];     // more past (higher detectedDaysAgo)
      const b = sorted[i + 1]; // more recent (lower detectedDaysAgo)
      if (b.detectedDaysAgo <= daysBack && daysBack <= a.detectedDaysAgo) {
        lower = b;
        upper = a;
        break;
      }
    }

    if (!lower && !upper) {
      const nearest = sorted.reduce((best, s) =>
        Math.abs(s.detectedDaysAgo - daysBack) < Math.abs(best.detectedDaysAgo - daysBack)
          ? s : best,
      );
      result.set(id, nearest.risk);
      continue;
    }

    if (!lower) { result.set(id, upper!.risk); continue; }
    if (!upper) { result.set(id, lower.risk);  continue; }

    const range = upper.detectedDaysAgo - lower.detectedDaysAgo;
    const t     = range === 0 ? 0 : (daysBack - lower.detectedDaysAgo) / range;
    const interpolated = lower.risk + (upper.risk - lower.risk) * t;
    result.set(id, Math.round(Math.max(0, Math.min(100, interpolated))));
  }

  return result;
}

export function daysAgoLabel(daysAgo: number): string {
  if (daysAgo === 0) {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())} UTC`;
  }
  if (daysAgo === 1) return 'Yesterday';
  return `${daysAgo}d ago`;
}
