import { zoneLabel } from '../../lib/riskUtils';

interface RiskGaugeProps {
  value: number; // 0–100
}

export default function RiskGauge({ value }: RiskGaugeProps) {
  const cx = 100, cy = 90, r = 70;

  const polar = (a: number): [number, number] => [
    cx + r * Math.cos((a * Math.PI) / 180),
    cy + r * Math.sin((a * Math.PI) / 180),
  ];

  // Static background arc segment
  const arcSeg = (from: number, to: number, color: string, width: number) => {
    const [x1, y1] = polar(from);
    const [x2, y2] = polar(to);
    const large = to - from > 180 ? 1 : 0;
    return (
      <path
        d={`M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}`}
        fill="none" stroke={color} strokeWidth={width} strokeLinecap="butt"
      />
    );
  };

  // Filled arc from -180 to the current value position
  const valueAngle = -180 + (value / 100) * 180;
  const [vx, vy] = polar(valueAngle);
  const filledArc = value > 0 ? (
    <path
      d={`M${polar(-180)[0]},${polar(-180)[1]} A${r},${r} 0 ${value > 50 ? 1 : 0} 1 ${vx},${vy}`}
      fill="none"
      stroke={zoneLabel(value).color}
      strokeWidth="8"
      strokeLinecap="butt"
      opacity="0.55"
    />
  ) : null;

  // Needle angle: -90° = left (0), +90° = right (100)
  const needleAngle = -90 + (value / 100) * 180;

  const { label: zLabel, color: zColor } = zoneLabel(value);

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 100" width="100%">
        {/* Background arc */}
        {arcSeg(-180, 0, 'rgba(255,255,255,0.06)', 10)}
        {/* Static color ramp segments */}
        {arcSeg(-180, -135, '#5EE0C2', 8)}
        {arcSeg(-135, -90,  '#00D4FF', 8)}
        {arcSeg(-90,  -45,  '#FFB547', 8)}
        {arcSeg(-45,    0,  '#FF6B35', 8)}
        {/* Filled progress overlay */}
        {filledArc}
        {/* Tick marks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const a = -180 + i * 18;
          const [x1, y1] = polar(a);
          const r2 = r - 14;
          const x2 = cx + r2 * Math.cos((a * Math.PI) / 180);
          const y2 = cy + r2 * Math.sin((a * Math.PI) / 180);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(240,244,255,0.2)" strokeWidth="1" />;
        })}
        {/* Needle */}
        <g transform={`rotate(${needleAngle} ${cx} ${cy})`}>
          <line x1={cx} y1={cy} x2={cx - r + 8} y2={cy} stroke="#F0F4FF" strokeWidth="1.5" />
          <polygon points={`${cx - r + 8},${cy - 2.5} ${cx - r - 2},${cy} ${cx - r + 8},${cy + 2.5}`} fill="#F0F4FF" />
          <circle cx={cx} cy={cy} r="5" fill="#0A0E1A" stroke={zColor} strokeWidth="1.5" />
        </g>
        {/* Zone label inside arc — no numbers */}
        <text
          x={cx} y={cy - 10}
          textAnchor="middle"
          fontFamily="JetBrains Mono,monospace"
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.12em"
          fill={zColor}
        >{zLabel}</text>
        {/* LOW / CRIT axis labels */}
        <text x="8"   y="97" fontFamily="JetBrains Mono,monospace" fontSize="7" fill="rgba(240,244,255,0.35)">LOW</text>
        <text x="192" y="97" fontFamily="JetBrains Mono,monospace" fontSize="7" fill="rgba(240,244,255,0.35)" textAnchor="end">CRIT</text>
      </svg>
    </div>
  );
}
