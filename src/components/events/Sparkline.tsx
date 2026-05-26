interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
  width?: number;
}

export default function Sparkline({ data, color, height = 24, width = 110 }: SparklineProps) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 2) + 1;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as [number, number];
  });

  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const dArea = d + ` L${pts[pts.length - 1][0]},${height} L${pts[0][0]},${height} Z`;
  const last = pts[pts.length - 1];
  const gradId = `sg-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} className="spark">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={dArea} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.2" />
      <circle cx={last[0]} cy={last[1]} r="1.8" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}
