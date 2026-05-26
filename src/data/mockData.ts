// ─── DATA SOURCE ─────────────────────────────────────────────────────────────
// Currently: static mock data for development and presentation.
// detectedDaysAgo convention:
//   positive = already happened (D-N: N days in the past)
//   zero     = happening now (TODAY)
//   negative = forecast / predicted (D+N: appears N days into the future)
// ─────────────────────────────────────────────────────────────────────────────

import type { AegisData, DisasterEvent } from '../types';

const events: DisasterEvent[] = [

  // ── D-5 to D-1 (past events, already in history) ───────────────────────────
  {
    id: 'AEG-2391', kind: 'cyclone', name: 'TC Nargis Remnant',
    region: 'Bay of Bengal', lat: 20.1, lon: 91.3,
    risk: 22, severity: 'low', delta: '-8.4', detected: '7d ago',
    area: '240 km² (dissipating)',
    spark: [88.2, 74.1, 58.3, 42.7, 31.4, 24.8, 22.1],
    radius: 5, detectedDaysAgo: 7,
  },
  {
    id: 'AEG-2392', kind: 'wildfire', name: 'Borneo Peat Fire',
    region: 'Kalimantan, Indonesia', lat: 0.8, lon: 114.2,
    risk: 31, severity: 'low', delta: '-3.1', detected: '6d ago',
    area: '67 km²',
    spark: [52.4, 48.7, 43.1, 37.8, 34.2, 31.9, 31.1],
    radius: 4, detectedDaysAgo: 6,
  },
  {
    id: 'AEG-2393', kind: 'flood', name: 'Danube Basin Overflow',
    region: 'Romania / Serbia', lat: 44.8, lon: 26.4,
    risk: 41, severity: 'medium', delta: '-2.8', detected: '5d ago',
    area: '390 km²',
    spark: [28.3, 35.7, 44.2, 48.9, 46.1, 43.4, 41.2],
    radius: 5, detectedDaysAgo: 5,
  },
  {
    id: 'AEG-2394', kind: 'quake', name: 'Vanuatu Swarm',
    region: 'Vanuatu', lat: -17.7, lon: 168.3,
    risk: 53, severity: 'medium', delta: '-1.4', detected: '4d ago',
    area: 'M 5.1 avg',
    spark: [61.2, 58.4, 55.8, 57.3, 54.1, 53.8, 53.2],
    radius: 4, detectedDaysAgo: 4,
  },
  {
    id: 'AEG-2395', kind: 'drought', name: 'Patagonia Dry Front',
    region: 'Argentina / Chile', lat: -40.3, lon: -68.9,
    risk: 36, severity: 'low', delta: '+0.4', detected: '3d ago',
    area: '28,100 km²',
    spark: [30.1, 31.4, 32.8, 33.7, 34.2, 35.1, 36.4],
    radius: 7, detectedDaysAgo: 3,
  },
  {
    id: 'AEG-2396', kind: 'wildfire', name: 'Peloponnese Outbreak',
    region: 'Greece', lat: 37.5, lon: 22.1,
    risk: 68, severity: 'high', delta: '+5.9', detected: '2d ago',
    area: '128 km²',
    spark: [18.4, 24.7, 31.2, 42.8, 55.3, 62.1, 68.4],
    radius: 5, detectedDaysAgo: 2,
  },
  {
    id: 'AEG-2397', kind: 'flood', name: 'Irrawaddy Delta Surge',
    region: 'Myanmar', lat: 15.9, lon: 95.2,
    risk: 79, severity: 'high', delta: '+7.3', detected: '1d ago',
    area: '730 km²',
    spark: [12.1, 21.4, 34.8, 48.3, 61.7, 72.4, 79.2],
    radius: 6, detectedDaysAgo: 1,
  },

  // ── D0 (current) ───────────────────────────────────────────────────────────
  {
    id: 'AEG-2406', kind: 'cyclone', name: 'TC Ileana',
    region: 'Bay of Bengal', lat: 16.2, lon: 88.4,
    risk: 88, severity: 'critical', delta: '+6.1', detected: '01:08 UTC',
    area: '1,840 km²',
    spark: [12.3, 28.7, 44.1, 58.6, 70.2, 81.9, 88.5],
    radius: 9, detectedDaysAgo: 0,
    path: [[78,12],[82,13],[86,14.5],[88.4,16.2],[89,18.5],[88,21]],
  },
  {
    id: 'AEG-2407', kind: 'wildfire', name: 'Athabasca Complex',
    region: 'Alberta, CA', lat: 56.7, lon: -111.4,
    risk: 94, severity: 'critical', delta: '+12.4', detected: '03:14 UTC',
    area: '184 km²',
    spark: [4.7, 19.0, 37.8, 52.3, 68.9, 79.4, 91.2],
    radius: 6.5, detectedDaysAgo: 0,
  },
  {
    id: 'AEG-2402', kind: 'cyclone', name: 'Atl. Disturbance 04',
    region: 'Mid-Atlantic', lat: 22.4, lon: -47.2,
    risk: 52, severity: 'medium', delta: '+0.9', detected: '14:02 UTC',
    area: 'Forming',
    spark: [18.6, 24.3, 31.7, 38.4, 43.2, 48.9, 52.1],
    radius: 8, detectedDaysAgo: 0,
    path: [[-40,18],[-43,20],[-47.2,22.4],[-52,25],[-58,28]],
  },

  // ── D+1 to D+7 (forecasted / future events) ────────────────────────────────
  // detectedDaysAgo is negative: appears on map when scrub moves into the future
  {
    id: 'AEG-2408', kind: 'cyclone', name: 'TC Makoa (Forecast)',
    region: 'South Indian Ocean', lat: -18.4, lon: 62.1,
    risk: 61, severity: 'high', delta: '+8.2', detected: 'D+1 forecast',
    area: 'Cat. 2 projected',
    spark: [0, 0, 8.4, 22.1, 38.6, 52.3, 61.0],
    radius: 7, detectedDaysAgo: -1,
    path: [[65,-14],[63,-15.5],[62.1,-18.4],[60,-21],[57,-23.5],[53,-25]],
  },
  {
    id: 'AEG-2409', kind: 'flood', name: 'Ganges Plain Alert',
    region: 'Bangladesh / India', lat: 24.2, lon: 89.8,
    risk: 55, severity: 'medium', delta: '+4.1', detected: 'D+2 forecast',
    area: '820 km² projected',
    spark: [0, 0, 0, 14.2, 31.8, 47.5, 55.2],
    radius: 6, detectedDaysAgo: -2,
  },
  {
    id: 'AEG-2410', kind: 'wildfire', name: 'Yakutia Fire Risk',
    region: 'Siberia, Russia', lat: 63.5, lon: 129.4,
    risk: 47, severity: 'medium', delta: '+3.5', detected: 'D+3 forecast',
    area: 'High risk zone',
    spark: [0, 0, 0, 0, 18.3, 34.2, 47.1],
    radius: 5, detectedDaysAgo: -3,
  },
  {
    id: 'AEG-2411', kind: 'quake', name: 'Cascadia Watch',
    region: 'Pacific Northwest, US', lat: 46.2, lon: -124.1,
    risk: 72, severity: 'high', delta: '+11.8', detected: 'D+4 forecast',
    area: 'M 5.8 predicted',
    spark: [0, 0, 0, 0, 0, 41.3, 72.4],
    radius: 5, detectedDaysAgo: -4,
  },
  {
    id: 'AEG-2412', kind: 'cyclone', name: 'WP-09 Development',
    region: 'Western Pacific', lat: 14.8, lon: 148.2,
    risk: 83, severity: 'critical', delta: '+14.2', detected: 'D+5 forecast',
    area: 'Cat. 4 projected',
    spark: [0, 0, 0, 0, 0, 38.7, 83.1],
    radius: 9, detectedDaysAgo: -5,
    path: [[152,10],[150,11.5],[148.2,14.8],[144,17],[139,19.5],[134,21]],
  },
  {
    id: 'AEG-2413', kind: 'drought', name: 'Sahel Deficit Projection',
    region: 'Chad / Niger', lat: 14.1, lon: 17.3,
    risk: 39, severity: 'low', delta: '+2.1', detected: 'D+6 forecast',
    area: '52,000 km² at risk',
    spark: [0, 0, 0, 0, 0, 0, 39.2],
    radius: 8, detectedDaysAgo: -6,
  },
  {
    id: 'AEG-2414', kind: 'flood', name: 'Amazon Basin Surge',
    region: 'Brazil / Peru', lat: -4.2, lon: -63.8,
    risk: 58, severity: 'medium', delta: '+6.7', detected: 'D+7 forecast',
    area: '1,200 km² projected',
    spark: [0, 0, 0, 0, 0, 0, 58.3],
    radius: 7, detectedDaysAgo: -7,
  },
];

const metrics = {
  activeEvents: 47,
  criticalCount: 2,
  highCount: 3,
  populationExposed: '12.4M',
  satellitesOnline: 18,
  satellitesTotal: 18,
  lastSync: '00:00:04 ago',
  globalRiskIndex: 67,
  coverage: 99.8,
};

const nextPass = { name: 'SENTINEL-2B', minutes: 4, seconds: 22 };

// Timeline markers: t=0=D+7(future left), t=0.5=NOW(center), t=1=D-7(past right)
const timelineMarkers = [
  { t: 0.04,  kind: 'flood'    as const },  // D+6.5
  { t: 0.10,  kind: 'cyclone'  as const },  // D+6
  { t: 0.18,  kind: 'drought'  as const },  // D+5.5
  { t: 0.25,  kind: 'wildfire' as const },  // D+5
  { t: 0.32,  kind: 'quake'    as const },  // D+4
  { t: 0.39,  kind: 'flood'    as const },  // D+3
  { t: 0.46,  kind: 'cyclone'  as const },  // D+1
  { t: 0.50,  kind: 'wildfire' as const },  // NOW
  { t: 0.54,  kind: 'cyclone'  as const },  // D-0.5
  { t: 0.61,  kind: 'flood'    as const },  // D-1.5
  { t: 0.68,  kind: 'wildfire' as const },  // D-2.5
  { t: 0.75,  kind: 'quake'    as const },  // D-3.5
  { t: 0.82,  kind: 'drought'  as const },  // D-4.5
  { t: 0.89,  kind: 'wildfire' as const },  // D-5.5
  { t: 0.93,  kind: 'cyclone'  as const },  // D-6
  { t: 0.97,  kind: 'flood'    as const },  // D-6.5
];

export const AEGIS_DATA: AegisData = {
  now: new Date('2026-05-25T14:32:17Z'),
  events,
  metrics,
  nextPass,
  timelineMarkers,
};
