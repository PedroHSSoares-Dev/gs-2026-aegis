import React, { useRef, useEffect } from 'react';
import type { DisasterEvent } from '../../types';
import { severityColor } from '../../utils/colors';
import { kindIconComponent } from '../icons';
import SeverityBadge from './SeverityBadge';
import Sparkline from './Sparkline';

interface EventCardProps {
  ev: DisasterEvent;
  selected: boolean;
  expanded: boolean;
  onSelect: (id: string) => void;
  onExpand: (id: string | null) => void;
}

export default function EventCard({ ev, selected, expanded, onSelect, onExpand }: EventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const KindIcon = kindIconComponent(ev.kind);
  const color = severityColor(ev.severity);
  const deltaPositive = ev.delta.startsWith('+');

  // Scroll into view when this card becomes selected
  useEffect(() => {
    if (selected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selected]);

  const handleClick = () => {
    onSelect(ev.id);
    onExpand(expanded ? null : ev.id);
  };

  return (
    <div
      ref={cardRef}
      className={`ecard${selected ? ' selected' : ''}${expanded ? ' expanded' : ''} ecard-${ev.severity}`}
      onClick={handleClick}
      style={{ '--accent': color } as React.CSSProperties}
    >
      <div className="ecard-glow" />
      <div className="ecard-top">
        <div className="ecard-kind">
          <div className="ecard-kind-icon">
            <KindIcon width={14} height={14} />
          </div>
          <div className="ecard-id">
            {ev.id}
            {ev.detectedDaysAgo < 0 && <span className="ecard-forecast-badge">FORECAST</span>}
          </div>
        </div>
        <div className="ecard-top-right">
          <SeverityBadge level={ev.severity} />
          <span className={`ecard-chevron${expanded ? ' open' : ''}`}>▾</span>
        </div>
      </div>
      <div className="ecard-name">{ev.name}</div>
      <div className="ecard-region">
        <span className="dim">▸</span> {ev.region}
        <span className="coord">
          {ev.lat.toFixed(1)}°{ev.lat >= 0 ? 'N' : 'S'} · {Math.abs(ev.lon).toFixed(1)}°{ev.lon >= 0 ? 'E' : 'W'}
        </span>
      </div>
      <div className="ecard-bottom">
        <div className="ecard-score">
          <div className="ecard-score-lbl">RISK</div>
          <div className="ecard-score-val">
            <span>{ev.risk}</span>
            <span className={`ecard-delta ${deltaPositive ? 'up' : 'down'}`}>{ev.delta}</span>
          </div>
        </div>
        <div className="ecard-spark">
          <div className="ecard-spark-lbl">7D INTENSITY</div>
          <Sparkline data={ev.spark} color={color} />
        </div>
      </div>
      <div className="ecard-meta">
        <span><span className="dim">DET</span> {ev.detected}</span>
        <span><span className="dim">AREA</span> {ev.area}</span>
      </div>

      {expanded && (
        <div className="ecard-detail">
          <div className="ecard-detail-divider" />
          <div className="ecard-detail-rows">
            <div className="ecard-detail-row">
              <span className="ecard-detail-lbl">COORDINATES</span>
              <span className="ecard-detail-val">
                {ev.lat.toFixed(4)}°, {ev.lon.toFixed(4)}°
              </span>
            </div>
            <div className="ecard-detail-row">
              <span className="ecard-detail-lbl">AREA AFFECTED</span>
              <span className="ecard-detail-val">{ev.area}</span>
            </div>
            <div className="ecard-detail-row">
              <span className="ecard-detail-lbl">DETECTED</span>
              <span className="ecard-detail-val">{ev.detected}</span>
            </div>
            <div className="ecard-detail-row">
              <span className="ecard-detail-lbl">EVENT ID</span>
              <span className="ecard-detail-val" style={{ color }}>{ev.id}</span>
            </div>
          </div>
          <div className="ecard-detail-actions">
            <button className="ecard-act">DISPATCH</button>
            <button className="ecard-act">MONITOR</button>
            <button className="ecard-act ecard-act-dim">ARCHIVE</button>
          </div>
        </div>
      )}
    </div>
  );
}
