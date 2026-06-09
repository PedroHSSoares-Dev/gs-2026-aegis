import type { Severity } from '../types';
import { SEVERITY_CRITICAL, SEVERITY_HIGH, SEVERITY_MEDIUM } from '../constants';

export function scoreToSeverity(score: number): Severity {
  if (score >= SEVERITY_CRITICAL) return 'critical';
  if (score >= SEVERITY_HIGH)     return 'high';
  if (score >= SEVERITY_MEDIUM)   return 'medium';
  return 'low';
}

export function zoneLabel(v: number): { label: string; color: string } {
  if (v >= SEVERITY_CRITICAL) return { label: 'CRITICAL', color: '#FF6B35' };
  if (v >= SEVERITY_HIGH)     return { label: 'HIGH',     color: '#FFB547' };
  if (v >= SEVERITY_MEDIUM)   return { label: 'MEDIUM',   color: '#00D4FF' };
  return                             { label: 'LOW',      color: '#5EE0C2' };
}
