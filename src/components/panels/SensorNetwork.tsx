import PanelHead from '../ui/PanelHead';

const SENSORS: [string, number, string, string][] = [
  ['SENTINEL-2B', 99.8, 'PASS @ 14:38', '#00D4FF'],
  ['LANDSAT-9',   99.4, 'PASS @ 15:12', '#00D4FF'],
  ['GOES-18',     100,  'GEOSTATIONARY', '#5EE0C2'],
  ['MODIS-Aqua',  98.9, 'PASS @ 14:51', '#00D4FF'],
  ['ICEYE-X38',   97.2, 'PASS @ 14:44', '#FFB547'],
  ['CAPELLA-7',   99.0, 'PASS @ 15:02', '#00D4FF'],
];

export default function SensorNetwork() {
  return (
    <div className="panel panel-sensors">
      <PanelHead title="SENSOR NETWORK" sub="18 / 18 nominal" />
      <div className="sensors">
        {SENSORS.map(([name, pct, meta, color]) => (
          <div key={name} className="sensor-row">
            <div className="sensor-dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
            <div className="sensor-name">{name}</div>
            <div className="sensor-bar">
              <div className="sensor-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div className="sensor-pct">{pct.toFixed(1)}%</div>
            <div className="sensor-pass">{meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
