import React from 'react';
import type { NavId } from '../../types';
import LogoPredictfy from '../brand/LogoPredictfy';
import {
  GlobeIcon, LayersIcon, AlertIcon, PulseIcon,
  SatelliteIcon, ArchiveIcon, TeamIcon, SettingsIcon,
} from '../icons';

interface LeftNavProps {
  active: NavId;
  onChange: (id: NavId) => void;
}

const NAV_ITEMS: { id: NavId; Icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string; badge?: number }[] = [
  { id: 'globe',     Icon: GlobeIcon,     label: 'Global Overview' },
  { id: 'layers',    Icon: LayersIcon,    label: 'Map Layers' },
  { id: 'alert',     Icon: AlertIcon,     label: 'Active Alerts', badge: 47 },
  { id: 'pulse',     Icon: PulseIcon,     label: 'Live Telemetry' },
  { id: 'satellite', Icon: SatelliteIcon, label: 'Satellite Network' },
  { id: 'archive',   Icon: ArchiveIcon,   label: 'Event Archive' },
  { id: 'team',      Icon: TeamIcon,      label: 'Operators' },
];

export default function LeftNav({ active, onChange }: LeftNavProps) {
  return (
    <nav className="lnav">
      <div className="lnav-brand">
        <LogoPredictfy
          className="lnav-brand-mark"
          size={32}
          color="#00D4FF"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.5))' }}
        />
        <div className="lnav-brand-mini">A</div>
      </div>
      <div className="lnav-divider" />
      <ul className="lnav-items">
        {NAV_ITEMS.map(({ id, Icon, label, badge }) => (
          <li key={id}>
            <button
              className={`lnav-btn ${active === id ? 'active' : ''}`}
              onClick={() => onChange(id)}
              title={label}
            >
              <Icon width={20} height={20} />
              {badge != null && <span className="lnav-badge">{badge}</span>}
              <span className="lnav-tooltip">{label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="lnav-bottom">
        <button className="lnav-btn" title="Settings">
          <SettingsIcon width={20} height={20} />
        </button>
        <div className="lnav-status">
          <div className="lnav-status-pulse">
            <span className="dot" />
            <span className="ring" />
          </div>
          <div className="lnav-status-lbl">LIVE</div>
        </div>
      </div>
    </nav>
  );
}
