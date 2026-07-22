import { useState } from 'react';
import { Activity, BarChart3, Zap, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const zonePowerData = [
  { zone: 'Z1', pct: 15, color: '#3b82f6' },
  { zone: 'Z2', pct: 35, color: '#10b981' },
  { zone: 'Z3', pct: 25, color: '#f59e0b' },
  { zone: 'Z4', pct: 15, color: '#f97316' },
  { zone: 'Z5', pct: 8, color: '#ef4444' },
  { zone: 'Z6', pct: 2, color: '#a855f7' },
];

const zoneHRData = [
  { zone: 'Z1', pct: 20, color: '#3b82f6' },
  { zone: 'Z2', pct: 30, color: '#10b981' },
  { zone: 'Z3', pct: 25, color: '#f59e0b' },
  { zone: 'Z4', pct: 15, color: '#f97316' },
  { zone: 'Z5', pct: 8, color: '#ef4444' },
  { zone: 'Z6', pct: 2, color: '#a855f7' },
];

const PerformanceAnalysis = ({ data }) => {
  const [activeTab, setActiveTab] = useState('pmc');
  const ctl = data?.estado?.ctl || 50;
  const atl = data?.estado?.atl || 50;
  const tsb = data?.tsb || 0;

  const pmcData = Array.from({ length: 30 }, (_, i) => {
    const p = i / 30;
    return {
      dia: `D-${30 - i}`,
      ctl: Math.max(10, ctl - p * 20 + Math.sin(p * 10) * 5),
      atl: Math.max(10, atl - p * 15 + Math.cos(p * 8) * 3),
      tsb: tsb - p * 10 + Math.sin(p * 6) * 2,
    };
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Análisis de Rendimiento
        </h3>
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-0.5">
          {['pmc', 'zonas'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded text-[10px] font-medium transition-all ${
                activeTab === tab ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}>
              {tab === 'pmc' ? 'PMC' : 'Zonas'}
            </button>
          ))}
        </div>
      </div>

      {/* PMC Chart */}
      {activeTab === 'pmc' && (
        <div className="space-y-3 animate-fade-in">
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pmcData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="dia" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} interval={Math.max(1, Math.floor(pmcData.length / 8))} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="ctl" name="CTL" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="atl" name="ATL" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tsb" name="TSB" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4">
            <span className="flex items-center gap-1.5 text-[9px] text-slate-400"><span className="w-3 h-0.5 bg-emerald-500 rounded" /> CTL · Forma</span>
            <span className="flex items-center gap-1.5 text-[9px] text-slate-400"><span className="w-3 h-0.5 bg-red-500 rounded" /> ATL · Fatiga</span>
            <span className="flex items-center gap-1.5 text-[9px] text-slate-400"><span className="w-3 h-0.5 bg-yellow-500 rounded" /> TSB · Balance</span>
          </div>
        </div>
      )}

      {/* Zones */}
      {activeTab === 'zonas' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h4 className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Distribución de Potencia</h4>
            <div className="space-y-1.5">
              {zonePowerData.map((z, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 text-[10px] font-bold" style={{ color: z.color }}>{z.zone}</span>
                  <div className="flex-1 h-3 bg-slate-700 rounded overflow-hidden">
                    <div className="h-full rounded transition-all" style={{ width: `${z.pct}%`, background: z.color }} />
                  </div>
                  <span className="w-8 text-right text-[10px] text-slate-300">{z.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Distribución de FC</h4>
            <div className="space-y-1.5">
              {zoneHRData.map((z, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 text-[10px] font-bold" style={{ color: z.color }}>{z.zone}</span>
                  <div className="flex-1 h-3 bg-slate-700 rounded overflow-hidden">
                    <div className="h-full rounded transition-all" style={{ width: `${z.pct}%`, background: z.color }} />
                  </div>
                  <span className="w-8 text-right text-[10px] text-slate-300">{z.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip">
      <p className="label">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="value" style={{ color: entry.color }}>{entry.name}: {entry.value.toFixed(1)}</p>
      ))}
    </div>
  );
};

export default PerformanceAnalysis;