import { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { ZoomTransform } from 'd3';
import * as topojson from 'topojson-client';
import type { GeoJsonObject } from 'geojson';
import type { Topology } from 'topojson-specification';
import type { DisasterEvent, EventKind, Severity } from '../../types';
import { severityColor, severityGlow } from '../../utils/colors';
import { useResize } from '../../hooks/useResize';

interface WorldMapProps {
  events:   DisasterEvent[];
  selected: string;
  onSelect: (id: string) => void;
  scrub:    number;
  daysBack: number;
}

// SVG path data for each kind — 24×24 viewBox
const KIND_PATHS: Record<EventKind, string> = {
  wildfire: 'M12 2c1 4 5 5 5 10a5 5 0 11-10 0c0-2 1-3 2-4-1 4 3 3 3 6',
  cyclone:  'M12 3a9 9 0 019 9M12 21a9 9 0 01-9-9M12 8a4 4 0 014 4M12 16a4 4 0 01-4-4',
  flood:    'M3 14c2 0 2-2 4.5-2S10 14 12 14s2-2 4.5-2S19 14 21 14M3 9c2 0 2-2 4.5-2S10 9 12 9s2-2 4.5-2S19 9 21 9',
  quake:    'M2 12h3l2-6 3 14 3-10 3 6 2-4h4',
  drought:  'M12 3a4 4 0 100 8 4 4 0 000-8zM12 1v2M12 13v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M5 20h14',
};

const ICON_SIZE = 14;   // rendered size in SVG units
const ICON_HALF = ICON_SIZE / 2;
const VIEWBOX   = 24;   // source viewBox

// Interpolate [lon,lat] along path at t (0=start, 1=end)
function interpolatePath(path: [number,number][], t: number): [number,number] {
  if (path.length < 2) return path[0] ?? [0,0];
  const total = path.length - 1;
  const s = Math.max(0, Math.min(1, t)) * total;
  const i = Math.min(Math.floor(s), total - 1);
  const f = s - i;
  return [path[i][0] + (path[i+1][0] - path[i][0]) * f,
          path[i][1] + (path[i+1][1] - path[i][1]) * f];
}

// Angle (degrees) from screen pt0 → pt1
function bearing(p0: [number,number], p1: [number,number]): number {
  return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * (180 / Math.PI);
}

// progress 0→1 along storm path based on daysBack
function pathProgress(ev: DisasterEvent, daysBack: number): number {
  if (!ev.path || ev.path.length < 2) return 1;
  const elapsed = daysBack - ev.detectedDaysAgo;
  return Math.max(0, Math.min(1, elapsed / 7));
}

export default function WorldMap({ events, selected, onSelect, daysBack }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const zoomRef      = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [land, setLand]           = useState<GeoJsonObject | null>(null);
  const [transform, setTransform] = useState<ZoomTransform>(d3.zoomIdentity);
  const { width: w, height: h }   = useResize(containerRef);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res  = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json');
        const topo: Topology = await res.json();
        if (cancelled) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLand(topojson.feature(topo, (topo.objects as any).land));
      } catch (e) { console.error('world-atlas', e); }
    })();
    return () => { cancelled = true; };
  }, []);

  // Set up zoom behavior — but disable user pan/drag/scroll interaction.
  // Only programmatic zoom (zoomToEvent) is allowed.
  useEffect(() => {
    if (!svgRef.current || w === 0 || h === 0) return;
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 6])
      .on('zoom', (e: d3.D3ZoomEvent<SVGSVGElement, unknown>) => setTransform(e.transform));

    // Attach zoom behavior (needed for programmatic calls) but disable all user gestures
    d3.select(svgRef.current)
      .call(zoom)
      .on('wheel.zoom',     null)   // disable scroll zoom
      .on('mousedown.zoom', null)   // disable drag pan
      .on('touchstart.zoom', null)  // disable touch
      .on('dblclick.zoom',  null);  // disable double-click

    zoomRef.current = zoom;
    return () => { d3.select(svgRef.current!).on('.zoom', null); };
  }, [w, h]);

  // Zoom to selected event, or zoom out if selected is empty
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current || w === 0 || h === 0) return;

    // Empty string = zoom out to world view
    if (!selected) {
      d3.select(svgRef.current)
        .transition().duration(600).ease(d3.easeCubicInOut)
        .call(zoomRef.current.transform, d3.zoomIdentity);
      return;
    }

    const ev = events.find(e => e.id === selected);
    if (!ev) return;

    // Use same scale formula as render
    const scale = Math.min(w / (2 * Math.PI), h / Math.PI) * 0.92;
    const projection = d3.geoEquirectangular().scale(scale).translate([w / 2, h / 2]);
    const [sx, sy] = projection([ev.lon, ev.lat]) ?? [w / 2, h / 2];

    const targetScale = 3.5;
    const tx = w / 2 - targetScale * sx;
    const ty = h / 2 - targetScale * sy;
    const target = d3.zoomIdentity.translate(tx, ty).scale(targetScale);

    d3.select(svgRef.current)
      .transition().duration(700).ease(d3.easeCubicInOut)
      .call(zoomRef.current.transform, target);
  }, [selected, events, w, h]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scale so the full world fits in both dimensions with a small margin.
  // Equirectangular: world width = scale * 2π, world height = scale * π
  // We want: scale * 2π ≤ w  AND  scale * π ≤ h
  // So scale = min(w / (2π), h / π) * padding
  const mapScale = Math.min(w / (2 * Math.PI), h / Math.PI) * 0.92;
  const proj    = d3.geoEquirectangular().scale(mapScale).translate([w/2, h/2]);
  const pathGen = d3.geoPath(proj);
  const px      = (ll: [number,number]): [number,number] => proj(ll) ?? [0,0];
  const grat    = d3.geoGraticule().step([15,15]);

  return (
    <div ref={containerRef} className="map-root">
      <div className="map-reticle tl"/><div className="map-reticle tr"/>
      <div className="map-reticle bl"/><div className="map-reticle br"/>

      <svg ref={svgRef} width={w} height={h} className="map-svg">
        <defs>
          {(['critical','high','medium','low'] as Severity[]).map(s => (
            <radialGradient key={s} id={`heat-${s}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={severityColor(s)} stopOpacity="0.9"/>
              <stop offset="40%"  stopColor={severityColor(s)} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={severityColor(s)} stopOpacity="0"/>
            </radialGradient>
          ))}
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(120,160,210,0.04)" strokeWidth="0.5"/>
          </pattern>
        </defs>

        <rect width={w} height={h} fill="url(#grid-pattern)"/>

        <g transform={transform.toString()}>
          {/* Graticule */}
          {land && <path d={pathGen(grat()) ?? ''} fill="none" stroke="rgba(120,160,210,0.08)" strokeWidth="0.5"/>}
          <line x1={px([-180,0])[0]} y1={px([-180,0])[1]} x2={px([180,0])[0]} y2={px([180,0])[1]}
            stroke="rgba(0,212,255,0.12)" strokeWidth="0.8" strokeDasharray="2 4"/>
          <line x1={px([0,-85])[0]} y1={px([0,-85])[1]} x2={px([0,85])[0]} y2={px([0,85])[1]}
            stroke="rgba(0,212,255,0.08)" strokeWidth="0.6" strokeDasharray="2 4"/>

          {/* Land */}
          {land && <path d={pathGen(land as Parameters<typeof pathGen>[0]) ?? ''}
            fill="rgba(30,45,74,0.35)" stroke="rgba(140,170,210,0.45)" strokeWidth="0.6" strokeLinejoin="round"/>}


          {/* ── STORM TRACKS ──────────────────────────────────────────── */}
          {events.filter(e => e.path && e.path.length >= 2).map(ev => {
            const visible  = ev.detectedDaysAgo <= daysBack;
            const progress = pathProgress(ev, daysBack);
            const color    = severityColor(ev.severity);
            const { haloR, glowPx, opacity: glowOp } = severityGlow(ev.severity);
            const screenPts = ev.path!.map(pt => px(pt));
            const total     = screenPts.length - 1;
            const scaled    = Math.max(0, Math.min(1, progress)) * total;
            const segIdx    = Math.min(Math.floor(scaled), total - 1);

            const [curLon, curLat] = interpolatePath(ev.path!, progress);
            const [cx, cy]         = px([curLon, curLat]);

            // Icon rotation — clamped so text never goes upside-down
            const p0  = screenPts[segIdx];
            const p1  = screenPts[Math.min(segIdx + 1, total)];
            const rot = bearing(p0, p1);

            // Direction vector arrow — scale inversely with zoom so visual size stays constant
            const arrowLen = 22 / transform.k;
            const rad = rot * (Math.PI / 180);
            const ax  = cx + Math.cos(rad) * arrowLen;
            const ay  = cy + Math.sin(rad) * arrowLen;
            // Arrowhead perpendicular points
            const headLen = 6 / transform.k;
            const perpRad = rad + Math.PI;
            const hx1 = ax + Math.cos(perpRad + 0.4) * headLen;
            const hy1 = ay + Math.sin(perpRad + 0.4) * headLen;
            const hx2 = ax + Math.cos(perpRad - 0.4) * headLen;
            const hy2 = ay + Math.sin(perpRad - 0.4) * headLen;

            const pastPts   = screenPts.slice(0, segIdx + 2);
            const futurePts = screenPts.slice(segIdx + 1);
            const toD = (pts: [number,number][]) =>
              pts.map((p,i) => `${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

            const scale    = ICON_SIZE / VIEWBOX;
            const iconPath = KIND_PATHS[ev.kind];
            const isSel    = selected === ev.id;

            return (
              <g key={`storm-${ev.id}`} style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
                {/* Tracks */}
                {pastPts.length >= 2 && (
                  <path d={toD(pastPts)} fill="none" stroke={color}
                    strokeWidth="1.5" strokeOpacity="0.65" strokeLinecap="round"/>
                )}
                {futurePts.length >= 2 && (
                  <path d={toD(futurePts)} fill="none" stroke={color}
                    strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 3" strokeLinecap="round"/>
                )}
                {screenPts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r={1.5}
                    fill={i <= segIdx + 1 ? color : 'rgba(255,255,255,0.15)'}/>
                ))}

                {/* Halo */}
                <circle cx={cx} cy={cy} r={haloR}
                  fill={`url(#heat-${ev.severity})`}
                  className={`heat-breathe sev-${ev.severity}`}
                  style={{ animationDelay: `${(ev.lon + 180) / 60}s`, opacity: glowOp }}/>

                {/* Direction vector arrow — drawn in screen space, never flips */}
                <line x1={cx} y1={cy} x2={ax} y2={ay}
                  stroke={color} strokeWidth="1.5" strokeOpacity="0.75" strokeLinecap="round"/>
                <polygon
                  points={`${ax},${ay} ${hx1},${hy1} ${hx2},${hy2}`}
                  fill={color} opacity="0.85"/>

                {/* Icon — rotated toward movement direction */}
                <g
                  transform={`translate(${cx},${cy}) rotate(${rot})`}
                  className="marker-group"
                  onClick={() => visible && onSelect(ev.id)}
                  style={{ cursor: visible ? 'pointer' : 'default', pointerEvents: visible ? 'auto' : 'none' }}
                >
                  {isSel && (
                    <>
                      <circle r={16} fill="none" stroke={color} strokeWidth="1" opacity="0.6" className="marker-ring"/>
                      <circle r={24} fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" className="marker-ring delay"/>
                    </>
                  )}
                  <circle r={isSel ? 11 : 9}
                    fill={isSel ? color : 'rgba(10,14,26,0.85)'}
                    stroke={color} strokeWidth={isSel ? 0 : 1.5}
                    style={{ filter: `drop-shadow(0 0 ${glowPx}px ${color})` }}/>
                  <g transform={`translate(${-ICON_HALF},${-ICON_HALF}) scale(${scale})`}>
                    <path d={iconPath} fill="none"
                      stroke={isSel ? '#0A0E1A' : color}
                      strokeWidth={isSel ? 2 : 1.5}
                      strokeLinecap="round" strokeLinejoin="round"/>
                    {ev.kind === 'cyclone' && (
                      <circle cx={12} cy={12} r={3} fill="none"
                        stroke={isSel ? '#0A0E1A' : color} strokeWidth={isSel ? 2 : 1.5}/>
                    )}
                  </g>
                </g>

                {/* Label — only when selected, outside rotated group so it never flips */}
                {isSel && (
                  <g transform={`translate(${cx + 14}, ${cy - 10})`}
                    style={{ pointerEvents: 'none' }}>
                    <rect x={-2} y={-8} width={68} height={20} fill="rgba(6,9,18,0.82)" rx={2}/>
                    <text fill={color} fontSize="8" fontFamily="JetBrains Mono,monospace" fontWeight="600" y={0}>{ev.id}</text>
                    <text fill="rgba(240,244,255,0.65)" fontSize="8" fontFamily="Inter,sans-serif" y={10}>{ev.name}</text>
                  </g>
                )}
              </g>
            );
          })}


          {/* ── STATIC EVENTS (no path) ──────────────────────────────── */}
          {events.filter(e => !e.path).map(ev => {
            const [x, y]   = px([ev.lon, ev.lat]);
            const isSel    = selected === ev.id;
            const color    = severityColor(ev.severity);
            const { haloR, glowPx, opacity: glowOp } = severityGlow(ev.severity);
            const visible  = ev.detectedDaysAgo <= daysBack;
            const scale    = ICON_SIZE / VIEWBOX;
            const iconPath = KIND_PATHS[ev.kind];

            return (
              <g key={`ev-${ev.id}`}
                style={{ opacity: visible ? 1 : 0, visibility: visible ? 'visible' : 'hidden', transition: 'opacity 0.8s ease' }}>

                {/* Halo — fixed absolute size by severity */}
                <circle cx={x} cy={y} r={haloR}
                  fill={`url(#heat-${ev.severity})`}
                  className={`heat-breathe sev-${ev.severity}`}
                  style={{ animationDelay: `${(ev.lon + 180) / 60}s`, opacity: glowOp }}/>

                {/* Icon marker */}
                <g transform={`translate(${x},${y})`} className="marker-group"
                  onClick={() => visible && onSelect(ev.id)}
                  style={{ cursor: visible ? 'pointer' : 'default', pointerEvents: visible ? 'auto' : 'none' }}>

                  {isSel && (
                    <>
                      <circle r={16} fill="none" stroke={color} strokeWidth="1" opacity="0.6" className="marker-ring"/>
                      <circle r={24} fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" className="marker-ring delay"/>
                    </>
                  )}
                  <circle r={isSel ? 11 : 9}
                    fill={isSel ? color : 'rgba(10,14,26,0.85)'}
                    stroke={color} strokeWidth={isSel ? 0 : 1.5}
                    style={{ filter: `drop-shadow(0 0 ${glowPx}px ${color})` }}/>
                  <g transform={`translate(${-ICON_HALF},${-ICON_HALF}) scale(${scale})`}>
                    <path d={iconPath} fill="none"
                      stroke={isSel ? '#0A0E1A' : color}
                      strokeWidth={isSel ? 2 : 1.5}
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  {isSel && (
                    <g transform="translate(14,-10)" style={{ pointerEvents: 'none' }}>
                      <rect x={-2} y={-8} width={68} height={20} fill="rgba(6,9,18,0.82)" rx={2}/>
                      <text fill={color} fontSize="8" fontFamily="JetBrains Mono,monospace" fontWeight="600" y={0}>{ev.id}</text>
                      <text fill="rgba(240,244,255,0.65)" fontSize="8" fontFamily="Inter,sans-serif" y={10}>{ev.name}</text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}
        </g>

        {/* Fixed overlay */}
        <g transform="translate(16,24)" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="rgba(0,212,255,0.6)">
          <text>EQUIRECTANGULAR · WGS-84</text>
          <text y="12" fill="rgba(240,244,255,0.4)">COMPOSITE · SENTINEL-2 · LANDSAT-9 · GOES-18</text>
        </g>
      </svg>

      {!land && (
        <div className="map-loading">
          <div className="map-loading-grid"/>
          <div className="map-loading-text">ACQUIRING SATELLITE FEED</div>
        </div>
      )}
    </div>
  );
}
