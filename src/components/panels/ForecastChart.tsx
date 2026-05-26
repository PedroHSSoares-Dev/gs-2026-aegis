import { useMemo } from 'react';
import PanelHead from '../ui/PanelHead';

const W = 360, H = 130;

// Pre-generated deterministic forecast data
const FORECAST_PTS = (() => {
  const arr: number[] = [];
  // Seeded values derived from the prototype formula with fixed noise
  const noiseSeeds = [0.3,-0.1,0.4,-0.2,0.1,-0.3,0.2,0.4,-0.1,0.3,-0.2,0.1,
    0.4,-0.3,0.2,-0.1,0.3,0.4,-0.2,0.1,-0.3,0.2,0.3,-0.4,0.1,-0.2,0.4,-0.1,
    0.3,-0.2,0.1,0.4,-0.3,0.2,-0.1,0.3,-0.4,0.1,0.2,-0.3,0.4,-0.1,0.3,-0.2,
    0.1,-0.4,0.3,0.2];
  for (let i = 0; i < 48; i++) {
    const t = i / 47;
    const base = 50 + Math.sin(i * 0.4) * 8 + Math.sin(i * 0.12) * 12 + t * 18;
    arr.push(base + noiseSeeds[i] * 4);
  }
  return arr;
})();

export default function ForecastChart() {
  const pts = FORECAST_PTS;
  const max = 100, min = 30;

  const toXY = (v: number, i: number): [number, number] => [
    (i / (pts.length - 1)) * (W - 24) + 16,
    H - ((v - min) / (max - min)) * (H - 28) - 14,
  ];

  const { obsPath, fcPath, bandPath, nowX } = useMemo(() => {
    const observed = pts.slice(0, 28);
    const forecast = pts.slice(27);
    const obsPath = observed.map((v, i) => `${i === 0 ? 'M' : 'L'}${toXY(v, i).join(',')}`).join(' ');
    const fcPath = forecast.map((v, i) => `${i === 0 ? 'M' : 'L'}${toXY(v, i + 27).join(',')}`).join(' ');
    const upper = forecast.map((v, i) => toXY(v + 8 + i * 0.4, i + 27));
    const lower = [...forecast.map((v, i) => toXY(v - 8 - i * 0.4, i + 27))].reverse();
    const bandPath = 'M' + upper.map(p => p.join(',')).join(' L') + ' L' + lower.map(p => p.join(',')).join(' L') + ' Z';
    const nowX = toXY(pts[27], 27)[0];
    return { obsPath, fcPath, bandPath, nowX };
  }, []);

  return (
    <div className="panel panel-trend">
      <PanelHead title="48H FORECAST" sub="ML model · ENSEMBLE-04" />
      <div className="forecast">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <line key={t} x1={16} y1={14 + t * (H - 28)} x2={W - 8} y2={14 + t * (H - 28)} stroke="rgba(240,244,255,0.05)" />
          ))}
          {[100, 75, 50, 25].map((y, i) => (
            <text key={y} x={6} y={14 + (i / 3) * (H - 28) + 3} fontFamily="JetBrains Mono,monospace" fontSize="7" fill="rgba(240,244,255,0.3)">{y}</text>
          ))}
          <path d={bandPath} fill="rgba(0,212,255,0.1)" />
          <path d={obsPath} fill="none" stroke="#00D4FF" strokeWidth="1.5" />
          <path d={fcPath} fill="none" stroke="#00D4FF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
          <line x1={nowX} y1={14} x2={nowX} y2={H - 14} stroke="rgba(255,255,255,0.2)" strokeDasharray="2 3" />
          <text x={nowX + 4} y={22} fontFamily="JetBrains Mono,monospace" fontSize="7" fill="rgba(255,255,255,0.4)">NOW</text>
          {['-24h', '-12h', '0', '+12h', '+24h'].map((l, i) => (
            <text key={l} x={16 + (i / 4) * (W - 24)} y={H - 2} fontFamily="JetBrains Mono,monospace" fontSize="7" fill="rgba(240,244,255,0.3)" textAnchor="middle">{l}</text>
          ))}
        </svg>
        <div className="forecast-legend">
          <span><span className="dot" style={{ background: '#00D4FF' }} /> Observed</span>
          <span><span className="dot dashed" style={{ borderColor: '#00D4FF' }} /> Predicted</span>
          <span><span className="dot band" /> 95% CI</span>
        </div>
      </div>
    </div>
  );
}
