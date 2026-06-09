import SensorNetwork from '../components/panels/SensorNetwork';
import ForecastChart from '../components/panels/ForecastChart';
import ModelMetaPanel from '../components/panels/ModelMetaPanel';

export default function AnalyticsPage() {
  return (
    <div className="grid analytics-grid">
      <section className="col-center">
        <div className="bottom-row" style={{ flex: 1 }}>
          <SensorNetwork />
          <ForecastChart />
        </div>
      </section>
      <aside className="col-right">
        <ModelMetaPanel />
      </aside>
    </div>
  );
}
