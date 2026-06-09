import { useState, useEffect } from 'react';
import PanelHead from '../ui/PanelHead';

interface ModelMeta {
  trained_at?: string;
  samples?: number;
  test_rmse?: number;
  r2?: number;
  top_features?: { name: string; importance: number }[];
  version?: string;
}

export default function ModelMetaPanel() {
  const [meta, setMeta] = useState<ModelMeta | null>(null);

  useEffect(() => {
    import('../../data/modelMeta.json')
      .then(m => setMeta(m.default as ModelMeta))
      .catch(() => setMeta(null));
  }, []);

  const features = meta?.top_features?.slice(0, 3) ?? [];
  const maxImp   = features.reduce((m, f) => Math.max(m, f.importance), 0.001);

  return (
    <div className="panel" style={{ flex: 1, minHeight: 0 }}>
      <PanelHead title="ML MODEL" sub={meta?.version ? `v${meta.version}` : 'not loaded'} />

      {!meta ? (
        <div style={{ padding: '12px 16px', color: 'rgba(240,244,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
          <div>Pipeline output not found.</div>
          <div style={{ marginTop: 6, opacity: 0.6 }}>Run: python aegis_pipeline.py</div>
        </div>
      ) : (
        <div style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: 'rgba(240,244,255,0.6)' }}>
            {meta.trained_at && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.5 }}>TRAINED</span>
                <span>{new Date(meta.trained_at).toLocaleDateString()}</span>
              </div>
            )}
            {meta.samples != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.5 }}>SAMPLES</span>
                <span>{meta.samples.toLocaleString()}</span>
              </div>
            )}
            {meta.test_rmse != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.5 }}>TEST RMSE</span>
                <span style={{ color: '#00D4FF' }}>{meta.test_rmse.toFixed(3)}</span>
              </div>
            )}
            {meta.r2 != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.5 }}>R²</span>
                <span style={{ color: '#5EE0C2' }}>{meta.r2.toFixed(4)}</span>
              </div>
            )}
          </div>

          {features.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ color: 'rgba(240,244,255,0.35)', fontSize: 10, marginBottom: 6, letterSpacing: '0.08em' }}>TOP FEATURES</div>
              {features.map(f => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{ flex: 1, fontSize: 10, color: 'rgba(240,244,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {f.name}
                  </div>
                  <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(f.importance / maxImp) * 100}%`,
                      background: '#00D4FF',
                      borderRadius: 2,
                    }} />
                  </div>
                  <div style={{ width: 36, textAlign: 'right', color: 'rgba(240,244,255,0.4)', fontSize: 10 }}>
                    {(f.importance * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
