export type EventKind = 'wildfire' | 'cyclone' | 'flood' | 'quake' | 'drought';
export type Severity  = 'critical' | 'high' | 'medium' | 'low';
export type NavId     = 'globe' | 'layers' | 'alert' | 'pulse' | 'satellite' | 'archive' | 'team';
export type LayerMap  = Record<EventKind, boolean>;

export interface DisasterEvent {
  id:               string;
  kind:             EventKind;
  name:             string;
  region:           string;
  lat:              number;
  lon:              number;
  risk:             number;
  severity:         Severity;
  delta:            string;
  detected:         string;
  area:             string;
  spark:            number[];
  radius:           number;
  path?:            [number, number][];
  detectedDaysAgo:  number;
}

export interface Metrics {
  activeEvents:      number;
  criticalCount:     number;
  highCount:         number;
  populationExposed: string;
  satellitesOnline:  number;
  satellitesTotal:   number;
  lastSync:          string;
  globalRiskIndex:   number;
  coverage:          number;
}

export interface TimelineMarker {
  t:    number;
  kind: EventKind;
}

export interface AegisData {
  now:             Date;
  events:          DisasterEvent[];
  metrics:         Metrics;
  nextPass:        { name: string; minutes: number; seconds: number };
  timelineMarkers: TimelineMarker[];
}
