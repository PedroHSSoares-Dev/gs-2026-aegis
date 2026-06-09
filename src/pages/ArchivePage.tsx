import { useMemo, useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { severityColor } from '../utils/colors';
import type { Severity } from '../types';

const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low'];

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '7px 12px',
  whiteSpace: 'nowrap',
};

export default function ArchivePage() {
  const { events } = useAegis();
  const [sortCol, setSortCol] = useState<'risk' | 'severity' | 'kind' | 'detectedDaysAgo'>('risk');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...events].sort((a, b) => {
      let cmp = 0;
      if (sortCol === 'severity') {
        cmp = SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
      } else if (sortCol === 'risk') {
        cmp = a.risk - b.risk;
      } else if (sortCol === 'detectedDaysAgo') {
        cmp = a.detectedDaysAgo - b.detectedDaysAgo;
      } else {
        cmp = a[sortCol].localeCompare(b[sortCol]);
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [events, sortCol, sortAsc]);

  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) {
      setSortAsc(a => !a);
    } else {
      setSortCol(col);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ col }: { col: typeof sortCol }) => {
    if (sortCol !== col) return <span style={{ opacity: 0.25 }}>↕</span>;
    return <span>{sortAsc ? '↑' : '↓'}</span>;
  };

  return (
    <div className="grid" style={{ display: 'block', padding: '16px 24px', overflowY: 'auto' }}>
      <div className="right-head" style={{ marginBottom: 16 }}>
        <div className="rh-title">EVENT ARCHIVE</div>
        <div className="rh-meta">
          <span className="pulse-dot" />
          {events.length} RECORDS
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.2)', color: 'rgba(240,244,255,0.4)', textAlign: 'left' }}>
              <th style={thStyle}>ID</th>
              <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => handleSort('severity')}>
                SEV <SortIcon col="severity" />
              </th>
              <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => handleSort('kind')}>
                TYPE <SortIcon col="kind" />
              </th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>REGION</th>
              <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => handleSort('risk')}>
                RISK <SortIcon col="risk" />
              </th>
              <th style={thStyle}>DELTA</th>
              <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => handleSort('detectedDaysAgo')}>
                DETECTED <SortIcon col="detectedDaysAgo" />
              </th>
              <th style={thStyle}>AREA</th>
              <th style={thStyle}>COORDS</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ev, i) => {
              const color = severityColor(ev.severity);
              const isForecast = ev.detectedDaysAgo < 0;
              return (
                <tr
                  key={ev.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    color: 'rgba(240,244,255,0.75)',
                  }}
                >
                  <td style={{ ...tdStyle, color, fontWeight: 600 }}>{ev.id}</td>
                  <td style={tdStyle}>
                    <span style={{
                      color, fontSize: 9, fontWeight: 700,
                      background: `${color}1A`, padding: '2px 6px', borderRadius: 2,
                      border: `1px solid ${color}40`,
                    }}>
                      {ev.severity.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: 'rgba(240,244,255,0.5)', textTransform: 'uppercase' }}>{ev.kind}</td>
                  <td style={tdStyle}>
                    {ev.name}
                    {isForecast && (
                      <span style={{ marginLeft: 6, fontSize: 8, color: '#00D4FF', opacity: 0.7 }}>FCST</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: 'rgba(240,244,255,0.5)' }}>{ev.region}</td>
                  <td style={{ ...tdStyle, color, fontWeight: 700 }}>{ev.risk}</td>
                  <td style={{
                    ...tdStyle,
                    color: ev.delta.startsWith('+') ? '#FF6B35' : '#5EE0C2',
                  }}>{ev.delta}</td>
                  <td style={{ ...tdStyle, color: 'rgba(240,244,255,0.5)' }}>{ev.detected}</td>
                  <td style={{ ...tdStyle, color: 'rgba(240,244,255,0.4)', fontSize: 10 }}>{ev.area}</td>
                  <td style={{ ...tdStyle, color: 'rgba(240,244,255,0.35)', fontSize: 10 }}>
                    {ev.lat.toFixed(1)}°, {ev.lon.toFixed(1)}°
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
