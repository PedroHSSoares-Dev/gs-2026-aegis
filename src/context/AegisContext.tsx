import { createContext, useContext, useState, useMemo } from 'react';
import type { DisasterEvent, EventKind, LayerMap, Metrics, TimelineMarker } from '../types';
import { AEGIS_DATA } from '../data/mockData';
import { useClock } from '../hooks/useClock';
import { useTimeline } from '../hooks/useTimeline';
import { scrubToDaysOffset } from '../lib/timeUtils';

interface AegisContextValue {
  events:          DisasterEvent[];
  metrics:         Metrics;
  timelineMarkers: TimelineMarker[];
  selected:        string;
  expanded:        string | null;
  filter:          string;
  layers:          LayerMap;
  scrub:           number;
  playing:         boolean;
  now:             Date;
  daysBack:        number;
  isReplay:        boolean;
  handleSelect:    (id: string) => void;
  setExpanded:     (id: string | null) => void;
  setFilter:       (f: string) => void;
  setLayer:        (kind: EventKind, on: boolean) => void;
  setScrub:        (v: number) => void;
  togglePlay:      () => void;
}

const AegisContext = createContext<AegisContextValue>(null!);

export function useAegis() {
  const ctx = useContext(AegisContext);
  if (!ctx) throw new Error('useAegis must be used within AegisProvider');
  return ctx;
}

export function AegisProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string>('AEG-2407');
  const [expanded, setExpanded] = useState<string | null>('AEG-2407');
  const [filter,   setFilter]   = useState<string>('all');
  const [layers,   setLayers]   = useState<LayerMap>({
    wildfire: true, cyclone: true, flood: true, quake: true, drought: true,
  });

  const { now }                              = useClock();
  const { scrub, playing, setScrub, togglePlay } = useTimeline();

  const daysBack = useMemo(() => scrubToDaysOffset(scrub), [scrub]);
  const isReplay = Math.abs(scrub - 0.5) > 0.03;

  function handleSelect(id: string) {
    if (selected === id) {
      setSelected('');
      setExpanded(null);
    } else {
      setSelected(id);
      setExpanded(id);
    }
  }

  function setLayer(kind: EventKind, on: boolean) {
    setLayers(s => ({ ...s, [kind]: on }));
  }

  const value: AegisContextValue = {
    events:          AEGIS_DATA.events,
    metrics:         AEGIS_DATA.metrics as Metrics,
    timelineMarkers: AEGIS_DATA.timelineMarkers,
    selected,
    expanded,
    filter,
    layers,
    scrub,
    playing,
    now,
    daysBack,
    isReplay,
    handleSelect,
    setExpanded,
    setFilter,
    setLayer,
    setScrub,
    togglePlay,
  };

  return <AegisContext.Provider value={value}>{children}</AegisContext.Provider>;
}
