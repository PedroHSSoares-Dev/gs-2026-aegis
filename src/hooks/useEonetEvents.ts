import { useEffect, useState } from 'react';
import type { DisasterEvent } from '../types';

const EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50';

const CATEGORY_MAP: Record<string, string> = {
  wildfires:    'wildfire',
  severeStorms: 'cyclone',
  floods:       'flood',
  earthquakes:  'quake',
  volcanoes:    'quake',
  drought:      'drought',
};

export function useEonetEvents() {
  const [events, setEvents]   = useState<DisasterEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(EONET_URL)
      .then(r => r.json())
      .then(data => {
        const normalized: DisasterEvent[] = data.events
          .filter((e: any) => e.geometry?.length > 0)
          .map((e: any, i: number): DisasterEvent => {
            const geo    = e.geometry[0];
            const catId  = e.categories[0]?.id ?? 'severeStorms';
            const kind   = (CATEGORY_MAP[catId] ?? 'cyclone') as DisasterEvent['kind'];
            const mag    = geo.magnitudeValue ?? 0;
            const risk   = Math.min(98, Math.round(20 + (mag / 10000) * 60 + i * 3));
            const severity: DisasterEvent['severity'] =
              i < 2 ? 'critical' : i < 5 ? 'high' : 'medium';

            const detectedMs     = Date.now() - new Date(geo.date).getTime();
            const detectedDaysAgo = Math.max(0, detectedMs / (1000 * 60 * 60 * 24));

            const path: [number, number][] | undefined =
              e.geometry.length > 1
                ? e.geometry.map((g: any) => [g.coordinates[0], g.coordinates[1]] as [number, number])
                : undefined;

            return {
              id:             e.id,
              kind,
              name:           e.title,
              region:         'Global',
              lat:            geo.coordinates[1],
              lon:            geo.coordinates[0],
              risk,
              severity,
              delta:          '+0.0',
              detected:       new Date(geo.date).toLocaleString('en-US', { timeZone: 'UTC' }),
              area:           'Active',
              spark:          [0, 0, 0, 0, 0, 0, risk],
              radius:         12,
              detectedDaysAgo,
              path,
            };
          });
        setEvents(normalized);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading };
}
