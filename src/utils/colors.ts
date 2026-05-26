import type { EventKind, Severity } from '../types';

// Single color system — severity drives color everywhere (map + AEF).
// kindColor is gone. The icon shape identifies the type; severity identifies the urgency.
export const severityColor = (s: Severity): string => ({
  critical: '#FF6B35',
  high:     '#FFB547',
  medium:   '#00D4FF',
  low:      '#5EE0C2',
}[s]);

// Glow halo — fixed absolute pixel radii by severity.
export const severityGlow = (s: Severity): { haloR: number; glowPx: number; opacity: number } => ({
  critical: { haloR: 38, glowPx: 14, opacity: 0.92 },
  high:     { haloR: 28, glowPx: 10, opacity: 0.72 },
  medium:   { haloR: 20, glowPx:  7, opacity: 0.50 },
  low:      { haloR: 13, glowPx:  4, opacity: 0.28 },
}[s]);

export const kindIcon = (k: EventKind): string => ({
  wildfire: 'fire',
  cyclone:  'cyclone',
  flood:    'flood',
  quake:    'quake',
  drought:  'drought',
}[k]);
