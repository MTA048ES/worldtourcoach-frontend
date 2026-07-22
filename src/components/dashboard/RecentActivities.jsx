import { useState, useEffect } from 'react';
import { 
  Activity, Bike, ChevronRight, Clock, MapPin, Zap, Gauge, 
  TrendingUp, X, Navigation, Flag, BarChart3, Mountain, 
  Heart, Droplet, Wind, Thermometer 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from 'recharts';

const activityColors = {
  Ride: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', icon: Bike },
  VirtualRide: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', icon: Bike },
  Run: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: Activity },
  Workout: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: Zap },
  default: { bg: 'bg-slate-800/60', text: 'text-slate-300', border: 'border-slate-700/50', icon: Activity },
};

const generateTimeSeries = (duration) => {
  const points = Math.min(50, Math.max(20, Math.floor(duration / 2)));
  return Array.from({ length: points }, (_, i) => {
    const p = i / points;
    return {
      time: `${Math.floor(p * duration)}'`,
      power: Math.round(200 + 60 * Math.sin(p * Math.PI * 5) + (Math.random() > 0.85 ? 100 : 0)),
      hr: Math.round(145 + 20 * Math.sin(p * Math.PI * 3) + Math.random() * 8),
      cadence: Math.round(85 + 8 * Math.sin(p * Math.PI * 4) + Math.random() * 4),
      altitude: Math.round(850 + 80 * Math.sin(p * Math.PI * 2) + Math.random() * 15),
      speed: Math.round(30 + 4 * Math.sin(p * Math.PI * 3) + Math.random() * 2),
    };
  });
};

const zonePowerData = [
  { zone: 'Z1', pct: 12, color: '#3b82f6', label: 'Recuperación' },
  { zone: 'Z2', pct: 32, color: '#10b981', label: 'Base' },
  { zone: 'Z3', pct: 28, color: '#f59e0b', label: 'Tempo' },
  { zone: 'Z4', pct: 18, color: '#f97316', label: 'Umbral' },
  { zone: 'Z5', pct: 8, color: '#ef4444', label: 'VO2 Max' },
  { zone: 'Z6', pct: 2, color: '#a855f7', label: 'Anaeróbico' },
  { zone: 'Z7', pct: 0, color: '#dc2626', label: 'Neuromuscular' },
];

const zoneHRData = [
  { zone: 'Z1', pct: 15, color: '#3b82f6', label: 'Recuperación' },
  { zone: 'Z2', pct: 28, color: '#10b981', label: 'Base' },
  { zone: 'Z3', pct: 30, color: '#f59e0b', label: 'Tempo' },
  { zone: 'Z4', pct: 17, color: '#f97316', label: 'Umbral' },
  { zone: 'Z5', pct: 8, color: '#ef4444', label: 'VO2 Max' },
];

const lapsData = [
  { lap: 1, time: '12:34', dist: '15.2 km', power: '245W', hr: '148 bpm', tss: 45 },
  { lap: 2, time: '11:45', dist: '14.8 km', power: '268W', hr: '156 bpm', tss: 52 },
  { lap: 3, time: '13:02', dist: '15.5 km', power: '238W', hr: '152 bpm', tss: 48 },
  { lap: 4, time: '10:58', dist: '14.1 km', power: '275W', hr: '160 bpm', tss: 55 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}{entry.name === 'Potencia' ? 'W' : entry.name === 'FC' ? ' bpm' : entry.name === 'Cadencia' ? ' rpm' : entry.name === 'Altitud' ? ' m' : ' km/h'}
        </p>
      ))}
    </div>
  );
};

const RecentActivities = ({ activities, onSelect }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activeTab, setActiveTab] = useState('cronologia');

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setSelectedActivity(null); };
    if (selectedActivity) { window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }
  }, [selectedActivity]);

  if (activities.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <Activity className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium text-slate-400">No hay actividades recientes</p>
          <p className="text-xs mt-1">Sincroniza con Intervals.icu para ver tus entrenos</p>
        </div>
      </div>
    );
  }

  const getTssColor = (t) => {
    if (t >= 150) return 'text-red-400';
    if (t >= 100) return 'text-orange-400';
    if (t >= 50) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            Actividades Recientes
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">{activities.length} entrenos sincronizados</p>
        </div>
        <button className="text-[10px] text-orange-400 hover:text-orange-300 font-medium">Ver todas →</button>
      </div>

      {/* Activities List */}
      <div className="space-y-2.5 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
        {activities.slice(0, 8).map((act, idx) => {
          const type = act.type || 'Ride';
          const style = activityColors[type] || activityColors.default;
          const Icon = style.icon;
          const date = new Date(act.start_date_local || Date.now());
          const tss = Math.round(act.icu_training_load || 0);
          const distance = act.distance ? (act.distance / 1000).toFixed(1) : '0';
          const duration = act.moving_time ? Math.round(act.moving_time / 60) : 0;
          const avgWatts = Math.round(act.icu_weighted_avg_watts || 0);

          return (
            <button
              key={idx}
              onClick={() => setSelectedActivity(act)}
              className={`w-full p-4 rounded-xl flex items-center justify-between transition-all duration-200 border cursor-pointer ${style.bg} ${style.border} hover:border-slate-600 hover:bg-slate-800/30 group`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0 border ${style.border}`}>
                  <Icon className="w-5 h-5" style={{ color: style.text.includes('orange') ? '#f97316' : style.text.includes('emerald') ? '#10b981' : style.text.includes('yellow') ? '#f59e0b' : '#94a3b8' }} />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-orange-400 transition-colors">{act.name || 'Ciclismo'}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400">
                      {date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[#475569]">·</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${style.bg} ${style.text} font-medium border ${style.border}`}>
                      {type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Distancia</p>
                  <p className="text-sm font-bold text-slate-200">{distance}<span className="text-[10px] text-slate-500 ml-0.5">km</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Tiempo</p>
                  <p className="text-sm font-bold text-slate-200">{duration}<span className="text-[10px] text-slate-500 ml-0.5">min</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Potencia</p>
                  <p className="text-sm font-bold text-orange-400">{avgWatts}<span className="text-[10px] text-slate-500 ml-0.5">W</span></p>
                </div>
                <div className="text-right min-w-[3rem]">
                  <p className="text-[10px] text-slate-500">TSS</p>
                  <p className={`text-sm font-bold ${getTssColor(tss)}`}>{tss}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-3" onClick={() => setSelectedActivity(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 rounded-t-2xl border-b border-slate-800 p-4 z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                    <Bike className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-white truncate">{selectedActivity.name || 'Villatorres Ciclismo 114km'}</h2>
                    <p className="text-[11px] text-slate-400">
                      {new Date(selectedActivity.start_date_local).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}
                      <span className="text-orange-400">{selectedActivity.type || 'Ride'}</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedActivity(null)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors flex-shrink-0">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Key Metrics Badges */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-3">
                <div className="bg-slate-800/50 rounded-lg py-1.5 px-2 text-center border border-slate-700/50">
                  <p className="text-[8px] text-slate-400">Potencia Media</p>
                  <p className="text-xs font-bold text-orange-400">{Math.round(selectedActivity.icu_average_watts || 210)}W</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg py-1.5 px-2 text-center border border-slate-700/50">
                  <p className="text-[8px] text-slate-400">Potencia Máx</p>
                  <p className="text-xs font-bold text-red-400">{Math.round(450 + Math.random() * 200)}W</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg py-1.5 px-2 text-center border border-slate-700/50">
                  <p className="text-[8px] text-slate-400">NP</p>
                  <p className="text-xs font-bold text-orange-400">{Math.round(selectedActivity.icu_weighted_avg_watts || 245)}W</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg py-1.5 px-2 text-center border border-slate-700/50">
                  <p className="text-[8px] text-slate-400">FC Media</p>
                  <p className="text-xs font-bold text-red-400">{Math.round(145 + Math.random() * 10)}bpm</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg py-1.5 px-2 text-center border border-slate-700/50">
                  <p className="text-[8px] text-slate-400">FC Máx</p>
                  <p className="text-xs font-bold text-red-400">{Math.round(175 + Math.random() * 15)}bpm</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg py-1.5 px-2 text-center border border-slate-700/50">
                  <p className="text-[8px] text-slate-400">Cadencia</p>
                  <p className="text-xs font-bold text-blue-400">{Math.round(85 + Math.random() * 10)}rpm</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg py-1.5 px-2 text-center border border-slate-700/50">
                  <p className="text-[8px] text-slate-400">Velocidad</p>
                  <p className="text-xs font-bold text-blue-400">{Math.round(28 + Math.random() * 5)}km/h</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg py-1.5 px-2 text-center border border-slate-700/50">
                  <p className="text-[8px] text-slate-400">Desnivel</p>
                  <p className="text-xs font-bold text-emerald-400">{Math.round(800 + Math.random() * 400)}m</p>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div className="bg-slate-800/30 rounded-lg py-1.5 px-2 text-center border border-slate-700/30">
                  <p className="text-[8px] text-slate-400">TSS</p>
                  <p className="text-xs font-bold text-orange-400">{Math.round(selectedActivity.icu_training_load || 150)}</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg py-1.5 px-2 text-center border border-slate-700/30">
                  <p className="text-[8px] text-slate-400">IF</p>
                  <p className="text-xs font-bold text-emerald-400">{(selectedActivity.icu_weighted_avg_watts / 240 || 0.75).toFixed(2)}</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg py-1.5 px-2 text-center border border-slate-700/30">
                  <p className="text-[8px] text-slate-400">Trabajo</p>
                  <p className="text-xs font-bold text-yellow-400">{Math.round((selectedActivity.icu_weighted_avg_watts || 245) * (selectedActivity.moving_time / 60 || 90) / 1000)}kJ</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg py-1.5 px-2 text-center border border-slate-700/30">
                  <p className="text-[8px] text-slate-400">Tiempo &gt; FTP</p>
                  <p className="text-xs font-bold text-red-400">{Math.round((selectedActivity.moving_time / 60 || 90) * 0.25)}min</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-3 bg-slate-800/50 rounded-lg p-0.5 overflow-x-auto">
                {[
                  { id: 'cronologia', label: 'Cronología', icon: TrendingUp },
                  { id: 'mapa', label: 'Mapa', icon: Navigation },
                  { id: 'zonas', label: 'Zonas', icon: BarChart3 },
                  { id: 'laps', label: 'Laps', icon: Flag },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                      activeTab === tab.id ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}>
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-3">
              {activeTab === 'cronologia' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                    <h4 className="text-[10px] font-semibold text-slate-400 mb-2">POTENCIA · FC · CADENCIA · ALTITUD</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateTimeSeries(90)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis dataKey="time" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                          <YAxis yAxisId="power" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                          <YAxis yAxisId="hr" orientation="right" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} domain={[100, 180]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line yAxisId="power" type="monotone" dataKey="power" name="Potencia" stroke="#f97316" strokeWidth={1.5} dot={false} />
                          <Line yAxisId="hr" type="monotone" dataKey="hr" name="FC" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                          <Line yAxisId="power" type="monotone" dataKey="cadence" name="Cadencia" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                          <Line yAxisId="power" type="monotone" dataKey="altitude" name="Altitud" stroke="#10b981" strokeWidth={1.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-2.5 h-0.5 bg-orange-500 rounded" /> Potencia</span>
                      <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-2.5 h-0.5 bg-red-500 rounded" /> FC</span>
                      <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-2.5 h-0.5 bg-blue-500 rounded" /> Cadencia</span>
                      <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-2.5 h-0.5 bg-emerald-500 rounded" /> Altitud</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mapa' && (
                <div className="animate-fade-in">
                  <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                    <h4 className="text-[10px] font-semibold text-slate-400 mb-2">MAPA DE RECORRIDO</h4>
                    <div className="h-[300px] bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <svg viewBox="0 0 400 300" className="w-full h-full">
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="400" height="300" fill="#1e293b" />
                        <rect width="400" height="300" fill="url(#grid)" />
                        <path d="M 50 250 Q 100 200 150 220 T 250 150 T 350 100" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="50" cy="250" r="6" fill="#10b981" />
                        <text x="50" y="270" textAnchor="middle" fill="#94a3b8" fontSize="10">Inicio</text>
                        <circle cx="350" cy="100" r="6" fill="#ef4444" />
                        <text x="350" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10">Fin</text>
                        {[80, 120, 160, 200, 240, 280, 320].map((y, i) => (
                          <circle key={i} cx={60 + i * 40} cy={y} r="4" fill="#f97316" opacity={0.6} />
                        ))}
                      </svg>
                      <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
                        <p className="text-[10px] text-slate-400">Distancia total</p>
                        <p className="text-sm font-bold text-white">114.2 km</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 text-center">Vista previa del recorrido · Integración con Mapbox/Leaflet</p>
                  </div>
                </div>
              )}

              {activeTab === 'zonas' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                    <h4 className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Zonas de Potencia</h4>
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
                  <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                    <h4 className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Zonas de Frecuencia Cardíaca</h4>
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

              {activeTab === 'laps' && (
                <div className="animate-fade-in">
                  <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-[9px] text-slate-400 uppercase tracking-wider p-2">Lap</th>
                          <th className="text-[9px] text-slate-400 uppercase tracking-wider p-2">Tiempo</th>
                          <th className="text-[9px] text-slate-400 uppercase tracking-wider p-2">Distancia</th>
                          <th className="text-[9px] text-slate-400 uppercase tracking-wider p-2">Potencia</th>
                          <th className="text-[9px] text-slate-400 uppercase tracking-wider p-2">FC</th>
                          <th className="text-[9px] text-slate-400 uppercase tracking-wider p-2 text-right">TSS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lapsData.map((lap, i) => (
                          <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                            <td className="p-2 text-xs font-bold text-white">{lap.lap}</td>
                            <td className="p-2 text-xs text-slate-300">{lap.time}</td>
                            <td className="p-2 text-xs text-slate-300">{lap.dist}</td>
                            <td className="p-2 text-xs text-orange-400 font-medium">{lap.power}</td>
                            <td className="p-2 text-xs text-red-400">{lap.hr}</td>
                            <td className="p-2 text-xs text-right font-bold text-yellow-400">{lap.tss}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;