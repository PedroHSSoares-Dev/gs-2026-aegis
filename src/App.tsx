import React, { useState, useMemo } from 'react';
import type { NavId, LayerMap, Severity } from './types';
import { AEGIS_DATA } from './data/mockData';
import { useClock } from './hooks/useClock';
import { useTimeline } from './hooks/useTimeline';

import { scrubToDaysOffset } from './components/timeline/Timeline';
import LeftNav from './components/nav/LeftNav';
import TopBar from './components/topbar/TopBar';
import WorldMap from './components/map/WorldMap';
import Timeline from './components/timeline/Timeline';
import RiskGauge from './components/panels/RiskGauge';
import SensorNetwork from './components/panels/SensorNetwork';
import ForecastChart from './components/panels/ForecastChart';
import EventGroup from './components/events/EventGroup';
import PanelHead from './components/ui/PanelHead';
import { ExpandIcon, DownloadIcon } from './components/icons';

const { events, metrics, timelineMarkers } = AEGIS_DATA;

const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low'];

const LAYER_TOGGLES = [
  { k: 'wildfire' as const, label: 'FIRE',    color: '#FF6B35' },
  { k: 'cyclone'  as const, label: 'STORM',   color: '#00D4FF' },
  { k: 'flood'    as const, label: 'FLOOD',   color: '#3FA9FF' },
  { k: 'quake'    as const, label: 'QUAKE',   color: '#FFB547' },
  { k: 'drought'  as const, label: 'DROUGHT', color: '#C28A4A' },
];

const FILTER_BTNS = [
  { k: 'all',      label: 'ALL' },
  { k: 'critical', label: 'CRITICAL' },
  { k: 'high',     label: 'HIGH' },
  { k: 'medium',   label: 'MED' },
  { k: 'low',      label: 'LOW' },
];

export default function App() {
  const [activeNav, setActiveNav] = useState<NavId>('alert');
  const [selected,  setSelected]  = useState<string>('AEG-2407');
  const [expanded,  setExpanded]  = useState<string | null>('AEG-2407');

  // Toggle logic: second click on same event = zoom out + close card
  function handleSelect(id: string) {
    if (selected === id) {
      setSelected('');
      setExpanded(null);
    } else {
      setSelected(id);
      setExpanded(id);
    }
  }
  const [filter,    setFilter]    = useState<string>('all');
  const [layers,    setLayers]    = useState<LayerMap>({
    wildfire: true, cyclone: true, flood: true, quake: true, drought: true,
  });

  const { now } = useClock();
  const { scrub, playing, setScrub, togglePlay } = useTimeline();

  // scrub=1 → 0 days ago (now), scrub=0 → 14 days ago
  // D-7 → D+7: daysBack > 0 means past, < 0 means future
  // Event visible when detectedDaysAgo <= daysBack
  const daysBack = scrubToDaysOffset(scrub);
  const isReplay = Math.abs(scrub - 0.5) > 0.03;

  // Global risk index varies with timeline position:
  // Past (daysBack > 0): fewer active events → lower risk
  // Present (daysBack ≈ 0): baseline 67
  // Future (daysBack < 0): forecast events forming → higher risk
  const timelineRisk = useMemo(() => {
    const base = metrics.globalRiskIndex; // 67 at NOW
    const delta = daysBack * -2.8; // future = higher, past = lower
    return Math.round(Math.max(10, Math.min(98, base + delta)));
  }, [daysBack]);

  // AEF always shows all current events — not gated by timeline scrub
  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter(e => e.severity === filter || e.kind === filter);
  }, [filter]);

  const groupedEvents = useMemo(() => {
    return SEVERITY_ORDER.map(sev => ({
      severity: sev,
      events: [...filteredEvents.filter(e => e.severity === sev)].sort((a, b) => b.risk - a.risk),
    }));
  }, [filteredEvents]);

  const mapEvents = useMemo(
    () => events.filter(e => layers[e.kind]),
    [layers],
  );

  return (
    <div className="app" data-screen-label="01 Mission Control">
      <LeftNav active={activeNav} onChange={setActiveNav} />

      <div className="main">
        <TopBar metrics={metrics} now={now} />

        <div className="grid">
          <section className="col-center">
            <div className="map-wrap">
              <div className="map-header">
                <div className="map-header-left">
                  <div className="mh-title">
                    PLANETARY HAZARD MAP
                    {isReplay && <span className="mh-replay-badge">REPLAY MODE</span>}
                  </div>
                  <div className="mh-sub">REAL-TIME COMPOSITE · MULTI-SENSOR FUSION</div>
                </div>
                <div className="map-header-mid">
                  <div className="layer-toggles">
                    {LAYER_TOGGLES.map(l => (
                      <button
                        key={l.k}
                        className={`ltog ${layers[l.k] ? 'on' : ''}`}
                        onClick={() => setLayers(s => ({ ...s, [l.k]: !s[l.k] }))}
                        style={{ '--lc': l.color } as React.CSSProperties}
                      >
                        <span className="ltog-dot" />{l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="map-header-right">
                  <button className="mh-icon" title="Expand"><ExpandIcon width={14} height={14} /></button>
                  <button className="mh-icon" title="Export"><DownloadIcon width={14} height={14} /></button>
                </div>
              </div>

              <WorldMap
                events={mapEvents}
                selected={selected}
                onSelect={handleSelect}
                scrub={scrub}
                daysBack={daysBack}
              />

              <Timeline
                value={scrub}
                onChange={setScrub}
                playing={playing}
                onPlayToggle={togglePlay}
                markers={timelineMarkers}
                now={now}
              />
            </div>

            <div className="bottom-row">
              <SensorNetwork />
              <ForecastChart />
            </div>
          </section>

          <aside className="col-right">
            <div className="right-head">
              <div className="rh-title">ACTIVE EVENT FEED</div>
              <div className="rh-meta">
                <span className="pulse-dot" />
                {filteredEvents.length} EVENTS
              </div>
            </div>

            <div className="filter-row">
              {FILTER_BTNS.map(f => (
                <button
                  key={f.k}
                  className={`fbtn ${filter === f.k ? 'on' : ''}`}
                  onClick={() => setFilter(f.k)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className={`event-list${expanded ? ' has-selection' : ''}`}>
              {groupedEvents.map(g => (
                <EventGroup
                  key={g.severity}
                  severity={g.severity}
                  events={g.events}
                  selected={selected}
                  expanded={expanded}
                  onSelect={handleSelect}
                  onExpand={setExpanded}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="vignette" />
      <div className="noise" />
    </div>
  );
}
