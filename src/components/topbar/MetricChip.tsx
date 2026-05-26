interface MetricChipProps {
  label: string;
  value: string | number;
  suffix: string;
  tone: 'warn' | 'cool' | 'alert' | 'ok';
}

export default function MetricChip({ label, value, suffix, tone }: MetricChipProps) {
  return (
    <div className={`mchip mchip-${tone}`}>
      <div className="mchip-lbl">{label}</div>
      <div className="mchip-val">
        <span className="num">{value}</span>
        <span className="suf">{suffix}</span>
      </div>
    </div>
  );
}
