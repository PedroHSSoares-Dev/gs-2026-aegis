import type { DisasterEvent } from '../types';

export function interpolatePath(path: [number, number][], t: number): [number, number] {
  if (path.length < 2) return path[0] ?? [0, 0];
  const total = path.length - 1;
  const s = Math.max(0, Math.min(1, t)) * total;
  const i = Math.min(Math.floor(s), total - 1);
  const f = s - i;
  return [
    path[i][0] + (path[i + 1][0] - path[i][0]) * f,
    path[i][1] + (path[i + 1][1] - path[i][1]) * f,
  ];
}

export function bearing(p0: [number, number], p1: [number, number]): number {
  return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * (180 / Math.PI);
}

export function pathProgress(ev: DisasterEvent, daysBack: number): number {
  if (!ev.path || ev.path.length < 2) return 1;
  // Use firstDetectedDaysAgo (storm birth time) if set, otherwise fall back to
  // detectedDaysAgo. With multi-snapshot events the current snapshot's dA ≈ daysBack,
  // which would always give elapsed ≈ 0 (icon stuck at path start).
  const totalDays = ev.firstDetectedDaysAgo ?? ev.detectedDaysAgo;
  if (totalDays <= 0) return 1;
  const elapsed = totalDays - daysBack;
  return Math.max(0, Math.min(1, elapsed / totalDays));
}
