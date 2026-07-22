import { useState } from 'react';
import { Bike, X, ExternalLink, Clock, Zap, Heart, Activity, Gauge, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const zoneData = [
  { name: 'Z1', watts: '0-150', color: '#60a5fa', pct: 15 },
  { name: 'Z2', watts: '151-200', color: '#34d399', pct: 35 },
  { name: 'Z3', watts: '201-240', color: '#fbbf24', pct: 25 },
  { name: 'Z4', watts: '241-280', color: '#f97316', pct: 15 },
  { name: 'Z5', watts: '281-320', color: '#ef4444', pct: 8 },
  { name: 'Z6', watts: '321+', color: '#a855f7', pct: 2 },
];

const ActivityModal = ({ activity, onClose }) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const date = new Date(activity.start_date_local || Date.now());
  const distance = activity.distance ? (activity.distance / 1000).toFixed(1) : '0';
  const duration = activity.moving_time ? Math.round(activity.moving_time / 60) : 0;
  const tss = Math.round(activity.icu_training_load || 0);
  const np = Math.round(activity.icu_weighted_avg_watts || 0);
  const ap = Math.round(activity.icu_average_watts || np || 0);
  const ftp = activity.ftp || 240;
  const ifFactor = ftp > 0 ? (np / ftp) : 0;
  const vi = ap > 0 ? (np / ap) : 1;
  const kj = Math.round((np * duration * 60) / 1000);
  const elevation = activity.total_elevation_gain || 0;
  const avgSpeed = duration > 0 ? (distance / (duration / 60)).toFixed(1) : '0';

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const p = i / 30;
    return {
      time: `${Math.floor(p * duration)}'`,
      power: Math.round(np * (0.7 + 0.3 * Math.sin(p * Math.PI * 3)) + (Math.random() > 0.85 ? np * 0.4 : 0)),
      hr: Math.round(130 + 30 * Math.sin(p * Math.PI)),
      cadence: Math.round(85 + 10 * Math.sin(p * Math.PI * 2)),
    };
  });

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-3" onClick={onClose}>
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sticky top-0 bg-[#111827] rounded-t-2xl border-b border-[#1a2233] p-4 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#1a2a4a] flex items-center justify-center flex-shrink-0">
                <Bike className="w-5 h-5 text-[#60a5fa]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-white truncate">{activity.name || 'Ciclismo'}</h2>
                <p className="text-[11px] text-[#6b7a9f]">
                  {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' · '}
                  <span className="badge badge-blue">{activity.type || 'Ride'}</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="btn-icon flex-shrink-0"><X className="w-4 h-4 text-[#6b7a9f]" /></button>
          </div>

          {/* Mini stats row */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            <div className="text-center bg-[#0a0e17] rounded-lg py-2 px-1">
              <p className="text-[9px] text-[#6b7a9f]">Distancia</p>
              <p className="text-sm font-bold text-[#60a5fa]">{distance}<span className="text-[9px] font-normal text-[#6b7a9f]">km</span></p>
            </div>
            <div className="text-center bg-[#0a0e17] rounded-lg py-2 px-1">
              <p className="text-[9px] text-[#6b7a9f]">Duración</p>
              <p className="text-sm font-bold text-[#60a5fa]">{duration}<span className="text-[9px] font-normal text-[#6b7a9f]">min</span></p>
            </div>
            <div className="text-center bg-[#0a0e17] rounded-lg py-2 px-1">
              <p className="text-[9px] text-[#6b7a9f]">TSS</p>
              <p className="text-sm font-bold text-[#fbbf24]">{tss}</p>
            </div>
            <div className="text-center bg-[#0a0e17] rounded-lg py-2 px-1">
              <p className="text-[9px] text-[#6b7a9f]">IF</p>
              <p className="text-sm font-bold text-[#34d399]">{ifFactor.toFixed(2)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 bg-[#0a0e17] rounded-lg p-0.5">
            {['resumen', 'potencia', 'zonas'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  activeTab === t ? 'bg-[#3b82f6] text-white' : 'text-[#6b7a9f] hover:text-white'
                }`}>
                {t === 'resumen' ? 'Resumen' : t === 'potencia' ? 'Potencia' : 'Zonas'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">

          {/* RESUMEN */}
          {activeTab === 'resumen' && (
            <>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-[#0a0e17] rounded-lg p-2.5 text-center">
                  <p className="metric-label flex items-center justify-center gap-1 mb-0.5"><Zap className="w-3 h-3 text-[#fbbf24]" />NP</p>
                  <p className="text-base font-bold text-[#fbbf24]">{np}<span className="text-[9px] font-normal text-[#6b7a9f]">W</span></p>
                </div>
                <div className="bg-[#0a0e17] rounded-lg p-2.5 text-center">
                  <p className="metric-label flex items-center justify-center gap-1 mb-0.5"><Activity className="w-3 h-3 text-[#60a5fa]" />AP</p>
                  <p className="text-base font-bold text-[#60a5fa]">{ap}<span className="text-[9px] font-normal text-[#6b7a9f]">W</span></p>
                </div>
                <div className="bg-[#0a0e17] rounded-lg p-2.5 text-center">
                  <p className="metric-label flex items-center justify-center gap-1 mb-0.5"><Gauge className="w-3 h-3 text-[#a78bfa]" />VI</p>
                  <p className="text-base font-bold text-[#a78bfa]">{vi.toFixed(2)}</p>
                </div>
                <div className="bg-[#0a0e17] rounded-lg p-2.5 text-center">
                  <p className="metric-label flex items-center justify-center gap-1 mb-0.5"><TrendingUp className="w-3 h-3 text-[#34d399]" />kJ</p>
                  <p className="text-base font-bold text-[#34d399]">{kj}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#0a0e17] rounded-lg p-2.5 flex justify-between items-center">
                  <span className="text-[10px] text-[#6b7a9f]">Vel. media</span>
                  <span className="text-xs font-bold text-white">{avgSpeed} km/h</span>
                </div>
                <div className="bg-[#0a0e17] rounded-lg p-2.5 flex justify-between items-center">
                  <span className="text-[10px] text-[#6b7a9f]">Desnivel</span>
                  <span className="text-xs font-bold text-[#f97316]">{elevation}m</span>
                </div>
                <div className="bg-[#0a0e17] rounded-lg p-2.5 flex justify-between items-center">
                  <span className="text-[10px] text-[#6b7a9f]">FTP</span>
                  <span className="text-xs font-bold text-[#ef4444]">{ftp}W</span>
                </div>
              </div>

              <div className="rounded-lg border border-[#1a2233] p-3 bg-[#0a0e17]">
                <h4 className="text-[10px] font-semibold text-[#9ca3af] mb-2">PERFIL DE POTENCIA</h4>
                <div className="h-[100px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24" stopOpacity={0.3}/><stop offset="100%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a2233" vertical={false} />
                      <XAxis dataKey="time" stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} domain={[0, 'auto']} />
                      <Tooltip />
                      <Area type="monotone" dataKey="power" stroke="#fbbf24" fill="url(#pg)" strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 btn-primary text-xs py-2"><ExternalLink className="w-3.5 h-3.5" /> Ver en Intervals.icu</button>
                <button onClick={onClose} className="btn-ghost text-xs py-2">Cerrar</button>
              </div>
            </>
          )}

          {/* POTENCIA */}
          {activeTab === 'potencia' && (
            <div className="rounded-lg border border-[#1a2233] p-3 bg-[#0a0e17]">
              <h4 className="text-[10px] font-semibold text-[#9ca3af] mb-2">POTENCIA · FC · CADENCIA</h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2233" vertical={false} />
                    <XAxis dataKey="time" stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="l" stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="r" orientation="right" stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} domain={[60, 120]} />
                    <Tooltip />
                    <Line yAxisId="l" type="monotone" dataKey="power" name="Potencia" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
                    <Line yAxisId="l" type="monotone" dataKey="hr" name="FC" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                    <Line yAxisId="r" type="monotone" dataKey="cadence" name="Cadencia" stroke="#60a5fa" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-[9px] text-[#6b7a9f]"><span className="w-2.5 h-0.5 bg-[#fbbf24]" /> Potencia</span>
                <span className="flex items-center gap-1 text-[9px] text-[#6b7a9f]"><span className="w-2.5 h-0.5 bg-[#ef4444]" /> FC</span>
                <span className="flex items-center gap-1 text-[9px] text-[#6b7a9f]"><span className="w-2.5 h-0.5 bg-[#60a5fa]" /> Cadencia</span>
              </div>
            </div>
          )}

          {/* ZONAS */}
          {activeTab === 'zonas' && (
            <>
              <div className="rounded-lg border border-[#1a2233] p-3 bg-[#0a0e17]">
                <h4 className="text-[10px] font-semibold text-[#9ca3af] mb-2">DISTRIBUCIÓN POR ZONAS</h4>
                <div className="space-y-1.5">
                  {zoneData.map((z, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 text-[10px] font-bold" style={{ color: z.color }}>{z.name}</span>
                      <span className="w-14 text-[8px] text-[#4b5563]">{z.watts}W</span>
                      <div className="flex-1 h-4 rounded bg-[#1a2233] overflow-hidden">
                        <div className="h-full rounded transition-all" style={{ width: `${z.pct}%`, background: z.color }} />
                      </div>
                      <span className="w-6 text-right text-[10px] font-medium text-white">{z.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#0a0e17] rounded-lg p-2.5 text-center"><p className="metric-label">Tiempo Z2</p><p className="text-sm font-bold text-[#34d399]">{Math.round(duration * 0.35)}<span className="text-[9px] text-[#6b7a9f]">min</span></p></div>
                <div className="bg-[#0a0e17] rounded-lg p-2.5 text-center"><p className="metric-label">Tiempo Z4+</p><p className="text-sm font-bold text-[#ef4444]">{Math.round(duration * 0.25)}<span className="text-[9px] text-[#6b7a9f]">min</span></p></div>
                <div className="bg-[#0a0e17] rounded-lg p-2.5 text-center"><p className="metric-label">Tiempo Z1</p><p className="text-sm font-bold text-[#60a5fa]">{Math.round(duration * 0.15)}<span className="text-[9px] text-[#6b7a9f]">min</span></p></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;