import React from 'react';
import type { Severity } from '../../types';
import { severityColor } from '../../utils/colors';

interface SeverityBadgeProps {
  level: Severity;
}

const ORDER: Severity[] = ['low', 'medium', 'high', 'critical'];
const LABELS: Record<Severity, string> = {
  critical: 'CRITICAL',
  high:     'HIGH',
  medium:   'MEDIUM',
  low:      'LOW',
};

export default function SeverityBadge({ level }: SeverityBadgeProps) {
  const color = severityColor(level);
  const idx = ORDER.indexOf(level);

  return (
    <div className="sbadge" style={{ '--c': color } as React.CSSProperties}>
      <div className="sbadge-bars">
        {ORDER.map((o, i) => (
          <span
            key={o}
            className={`sbadge-bar ${i <= idx ? 'on' : ''}`}
            style={{ background: i <= idx ? severityColor(o) : 'rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>
      <div className="sbadge-lbl">{LABELS[level]}</div>
    </div>
  );
}
