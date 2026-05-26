import React from 'react';
import type { DisasterEvent } from '../../types';
import { severityColor } from '../../utils/colors';

interface DetailDrawerProps {
  ev: DisasterEvent;
}

export default function DetailDrawer({ ev }: DetailDrawerProps) {
  const color = severityColor(ev.severity);

  return (
    <div className="drawer" style={{ '--accent': color } as React.CSSProperties}>
      <div className="drawer-bar" />
      <div className="drawer-head">
        <div>
          <div className="drawer-id">{ev.id} · ANALYSIS</div>
          <div className="drawer-title">{ev.name}</div>
        </div>
        <div className="drawer-risk">
          <div className="drawer-risk-num">{ev.risk}</div>
          <div className="drawer-risk-lbl">RISK</div>
        </div>
      </div>
      <div className="drawer-rows">
        <div>
          <span className="dim">COORDS</span>
          <span className="mono">{ev.lat.toFixed(3)}, {ev.lon.toFixed(3)}</span>
        </div>
        <div>
          <span className="dim">EXTENT</span>
          <span className="mono">{ev.area}</span>
        </div>
        <div>
          <span className="dim">DETECTED</span>
          <span className="mono">{ev.detected}</span>
        </div>
        <div>
          <span className="dim">CONFIDENCE</span>
          <span className="mono">94.2%</span>
        </div>
        <div>
          <span className="dim">EXPOSURE</span>
          <span className="mono">412k pop.</span>
        </div>
      </div>
      <div className="drawer-actions">
        <button className="btn-pri">DISPATCH BRIEF</button>
        <button className="btn-sec">ESCALATE</button>
        <button className="btn-sec">DETAILS →</button>
      </div>
    </div>
  );
}
