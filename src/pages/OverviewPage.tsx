import React, { useMemo } from 'react';
import type { Severity } from '../types';
import { useAegis } from '../context/AegisContext';
import WorldMap from '../components/map/WorldMap';
import Timeline from '../components/timeline/Timeline';
import EventGroup from '../components/events/EventGroup';
import { ExpandIcon, DownloadIcon } from '../components/icons';

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

export default function OverviewPage() {
  const {
    events, timelineMarkers,
    selected, handleSelect,
    expanded, setExpanded,
    filter, setFilter,
    layers, setLayer,
    scrub, setScrub,
    playing, togglePlay,
    now, daysBack, isReplay,
  } = useAegis();

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter(e => e.severity === filter || e.kind === filter);
  }, [filter, events]);

  const groupedEvents = useMemo(() => {
    return SEVERITY_ORDER.map(sev => ({
      severity: sev,
      events: [...filteredEvents.filter(e => e.severity === sev)].sort((a, b) => b.risk - a.risk),
    }));
  }, [filteredEvents]);

  const mapEvents = useMemo(
    () => events.filter(e => layers[e.kind]),
    [events, layers],
  );

  return (
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
                    onClick={() => setLayer(l.k, !layers[l.k])}
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
  );
}
