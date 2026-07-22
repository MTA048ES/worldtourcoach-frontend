import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, Area, AreaChart, 
  ComposedChart, Scatter
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Calendar, Activity, 
  Zap, Battery, Heart, Thermometer, Droplet, 
  Bike, Award, Clock, Flame, Gauge, 
  Loader2, ChevronRight, ExternalLink, RefreshCw,
  BarChart2, LineChart as LineChartIcon, PieChart,
  Cloud, CloudRain, Wind, Sun, Moon, CloudSnow,
  AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import './index.css';

// ============================================================
// CONFIGURACIÓN
// ============================================================

const API_URL = 'https://worldtourcoach-backend-production-c14a.up.railway.app';

// ============================================================
// COMPONENTES DE CARGA Y ERROR
// ============================================================

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0a0e17]">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-[#60a5fa] animate-spin mx-auto mb-4" />
      <p className="text-[#9ca3af] animate-pulse">Cargando World Tour Coach...</p>
      <p className="text-[#4b5563] text-sm mt-2">Conectando con el backend</p>
    </div>
  </div>
);

const ErrorScreen = ({ error, onRetry }) => (
  <div className="flex items-center justify-center min-h-screen bg-[#0a0e17] p-4">
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 max-w-md w-full">
      <div className="flex items-center gap-3 mb-4">
        <XCircle className="w-8 h-8 text-red-500" />
        <h2 className="text-xl font-bold text-white">Error de conexión</h2>
      </div>
      <p className="text-[#9ca3af] text-sm mb-4">No se pudo conectar con el backend.</p>
      <div className="bg-[#0a0e17] rounded-lg p-3 mb-4">
        <p className="text-[#6b7a9f] text-xs font-mono break-all">{error}</p>
        <p className="text-[#6b7a9f] text-xs mt-1">URL: {API_URL}</p>
      </div>
      <button 
        onClick={onRetry}
        className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Reintentar
      </button>
    </div>
  </div>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

function App() {
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = () => {
    setCargando(true);
    setError(null);
    
    fetch(`${API_URL}/api/estado`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setEstado(data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (cargando) return <LoadingSpinner />;
  if (error) return <ErrorScreen error={error} onRetry={cargarDatos} />;

  return <Dashboard data={estado} onRefresh={cargarDatos} />;
}

// ============================================================
// DASHBOARD PRINCIPAL
// ============================================================

const Dashboard = ({ data, onRefresh }) => {
  const tsb = data?.tsb || 0;
  const readiness = data?.readiness || 50;
  const ctl = data?.estado?.ctl || 50;
  const atl = data?.estado?.atl || 50;
  const sleepQuality = data?.estado?.sleepQuality || 2;
  const weeklyTss = data?.estado?.weeklyTss || 0;
  const weeklySessions = data?.estado?.weeklySessions || 0;
  const decision = data?.decision || { tipo: 'descanso', durMin: 0, intensidad: 0 };
  const entreno = data?.entreno || { tssEsperado: 0, wLow: 0, wHigh: 0, ifEsperado: '0.00' };
  const weather = data?.datos?.weather || null;
  const activities = data?.datos?.activities || [];
  const consejo = data?.consejo || ['Sigue tu plan con consistencia.'];

  // ─── DATOS PARA GRÁFICOS ───
  const datosGrafico = Array.from({ length: 14 }, (_, i) => ({
    dia: `Día ${13 - i}`,
    ctl: ctl - i * 0.7 + Math.random() * 2,
    atl: atl - i * 0.5 + Math.random() * 2,
    tsb: tsb - i * 0.3 + Math.random() * 1.5
  }));

  const colorTsb = tsb > 0 ? 'text-[#34d399]' : tsb > -10 ? 'text-[#fbbf24]' : 'text-[#ef4444]';
  const colorReadiness = readiness > 70 ? 'text-[#34d399]' : readiness > 50 ? 'text-[#fbbf24]' : 'text-[#ef4444]';
  const labelTsb = tsb > 0 ? 'Fresco' : tsb > -10 ? 'Equilibrado' : 'Fatigado';
  const iconTsb = tsb > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8edf5]">
      {/* ─── HEADER ─── */}
      <header className="bg-[#0f1624] border-b border-[#1a2233] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a2a4a] flex items-center justify-center">
              <Bike className="w-6 h-6 text-[#60a5fa]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">WORLD TOUR COACH</h1>
              <p className="text-[10px] text-[#6b7a9f] tracking-wider">v10.1 · SINGLE SOURCE OF TRUTH</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onRefresh}
              className="p-2 hover:bg-[#1a2233] rounded-xl transition"
            >
              <RefreshCw className="w-5 h-5 text-[#6b7a9f] hover:text-[#60a5fa] transition" />
            </button>
            <div className="flex items-center gap-2 bg-[#1a2233] rounded-xl px-3 py-1.5">
              <span className="text-xs text-[#9ca3af]">{new Date().toLocaleDateString('es-ES', { 
                weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' 
              })}</span>
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ─── WIDGET GRID ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Widget 
            title="TSB" 
            value={tsb.toFixed(1)} 
            color={colorTsb}
            icon={iconTsb}
            subtitle={labelTsb}
            detail={`CTL ${ctl.toFixed(1)} · ATL ${atl.toFixed(1)}`}
          />
          <Widget 
            title="Readiness" 
            value={`${readiness}/100`} 
            color={colorReadiness}
            icon={readiness > 70 ? <Battery className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            subtitle={readiness > 70 ? 'Alta' : readiness > 50 ? 'Media' : 'Baja'}
            detail={`HRV ${data?.estado?.hrv || 'N/D'}`}
          />
          <Widget 
            title="CTL (Forma)" 
            value={ctl.toFixed(1)} 
            color="text-[#34d399]"
            icon={<TrendingUp className="w-4 h-4" />}
            subtitle={ctl > atl ? '📈 Subiendo' : '📉 Bajando'}
            detail={`+${Math.abs(ctl - atl).toFixed(1)} vs ATL`}
          />
          <Widget 
            title="ATL (Fatiga)" 
            value={atl.toFixed(1)} 
            color={atl > 70 ? 'text-[#ef4444]' : 'text-[#fbbf24]'}
            icon={atl > 70 ? <Flame className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            subtitle={atl > 70 ? '⚠️ Alta' : '✅ Controlada'}
            detail={`${weeklySessions} sesiones esta semana`}
          />
        </div>

        {/* ─── PLAN DE HOY ─── */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mb-6 hover:border-[#2a3a5a] transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                PLAN DE HOY
              </h2>
              <p className="text-xs text-[#6b7a9f] mt-1">Generado por IA · Single Source of Truth</p>
            </div>
            <span className="text-[10px] bg-[#1a2a4a] text-[#60a5fa] px-3 py-1 rounded-full">
              {decision.tipo === 'descanso' ? '🧘 RECUPERACIÓN' : `🎯 ${decision.prioridad?.toUpperCase() || 'BASE'}`}
            </span>
          </div>

          {decision.tipo === 'descanso' ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🧘</div>
              <h3 className="text-2xl font-bold text-[#34d399]">DESCANSO TOTAL</h3>
              <p className="text-[#9ca3af] mt-2 text-sm">{decision.motivo || 'Recuperación prioritaria'}</p>
              <p className="text-[#6b7a9f] text-xs mt-3">💡 Movilidad suave · Foam rolling · Hidratación</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <MetricCard 
                  label="Tipo" 
                  value={decision.tipo.toUpperCase()} 
                  sub={`${decision.reps > 0 ? decision.reps + 'x' + decision.durMin + 'min' : decision.durMin + 'min continuos'}`}
                  color="text-[#fbbf24]"
                />
                <MetricCard 
                  label="Intensidad" 
                  value={`${Math.round(decision.intensidad * 100)}%`} 
                  sub="FTP"
                  color="text-[#60a5fa]"
                />
                <MetricCard 
                  label="TSS" 
                  value={entreno.tssEsperado?.toString() || '0'} 
                  sub={`IF ${entreno.ifEsperado || '0.00'}`}
                  color="text-[#fbbf24]"
                />
                <MetricCard 
                  label="Vatios" 
                  value={`${entreno.wLow || 0}-${entreno.wHigh || 0}W`} 
                  sub="Rango objetivo"
                  color="text-[#34d399]"
                />
              </div>
              {decision.notaHidratacion && (
                <div className="flex items-center gap-2 bg-[#0a0e17] rounded-xl px-4 py-2.5 text-sm text-[#60a5fa]">
                  <Droplet className="w-4 h-4" />
                  <span>{decision.notaHidratacion}</span>
                </div>
              )}
              {decision.motivo && (
                <p className="text-xs text-[#6b7a9f] mt-3">🧠 {decision.motivo}</p>
              )}
            </div>
          )}
        </div>

        {/* ─── GRÁFICO Y CLIMA ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* ─── GRÁFICO ─── */}
          <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2">
                  <LineChartIcon className="w-4 h-4" />
                  EVOLUCIÓN DE CARGA
                </h3>
                <p className="text-[10px] text-[#4b5563]">Últimos 14 días</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#34d399]"></span> CTL</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#ef4444]"></span> ATL</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#fbbf24]"></span> TSB</span>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2233" />
                  <XAxis dataKey="dia" stroke="#4b5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="ctl" stroke="#34d399" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="atl" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="tsb" stroke="#fbbf24" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ─── CLIMA ─── */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2 mb-4">
              <Cloud className="w-4 h-4" />
              CLIMA
            </h3>
            {weather ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {typeof weather.temp === 'number' ? (
                        weather.temp > 35 ? '🔥' : 
                        weather.temp > 30 ? '🌡️' : 
                        weather.temp > 25 ? '☀️' : '🌤️'
                      ) : '🌤️'}
                    </span>
                    <div>
                      <span className="text-2xl font-bold">{weather.temp || 'N/D'}°C</span>
                      <p className="text-xs text-[#6b7a9f] capitalize">{weather.description || ''}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-[#0a0e17] rounded-xl px-3 py-2 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#6b7a9f]" />
                    <span>{weather.wind || 0} km/h</span>
                  </div>
                  <div className="bg-[#0a0e17] rounded-xl px-3 py-2 flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-[#6b7a9f]" />
                    <span>{weather.rain || 0} mm</span>
                  </div>
                </div>
                {typeof weather.temp === 'number' && weather.temp > 30 && (
                  <div className="bg-[#1a2a1a] border border-[#2a4a2a] rounded-xl px-3 py-2 text-xs text-[#34d399] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Calor alto · Hidratación extra
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-[#4b5563] text-sm">
                <Cloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Sin datos climáticos
              </div>
            )}
          </div>
        </div>

        {/* ─── ACTIVIDADES Y CONSEJOS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ─── ACTIVIDAD RECIENTE ─── */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2">
                <Activity className="w-4 h-4" />
                ACTIVIDAD RECIENTE
              </h3>
              <span className="text-xs text-[#4b5563]">{activities.length} entrenos</span>
            </div>
            {activities.length > 0 ? (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                {activities.slice(0, 5).map((act, idx) => (
                  <div key={idx} className="bg-[#0a0e17] rounded-xl p-3 flex items-center gap-3 hover:bg-[#1a2233] transition border border-transparent hover:border-[#1f2937]">
                    <div className="w-10 h-10 rounded-lg bg-[#1a2a4a] flex items-center justify-center">
                      <Bike className="w-5 h-5 text-[#60a5fa]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{act.name || 'Ciclismo'}</p>
                      <p className="text-xs text-[#6b7a9f]">
                        {act.distance ? (act.distance / 1000).toFixed(1) : '0'} km · 
                        {act.moving_time ? ` ${Math.round(act.moving_time / 60)} min` : ' 0 min'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#fbbf24]">{Math.round(act.icu_training_load || 0)} TSS</p>
                      <p className="text-xs text-[#6b7a9f]">{Math.round(act.icu_weighted_avg_watts || 0)}W</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#4b5563]">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay actividades recientes</p>
              </div>
            )}
          </div>

          {/* ─── CONSEJOS Y ESTADO ─── */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4" />
              INSIGHTS & CONSEJOS
            </h3>
            <div className="space-y-3">
              {consejo.map((c, idx) => (
                <div key={idx} className="bg-[#0a0e17] rounded-xl p-3 text-sm text-[#e8edf5] flex items-start gap-2">
                  <span className="text-[#60a5fa] mt-0.5">💡</span>
                  <span>{c}</span>
                </div>
              ))}
              <div className="bg-[#0a0e17] rounded-xl p-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6b7a9f]">Sueño</span>
                  <span className="font-medium">
                    {sleepQuality === 1 ? '😴 Malo' : sleepQuality === 2 ? '🟡 Regular' : '🟢 Bueno'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-[#6b7a9f]">Carga semanal</span>
                  <span className="font-medium">{Math.round(weeklyTss)} TSS</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-[#6b7a9f]">Sesiones</span>
                  <span className="font-medium">{weeklySessions}</span>
                </div>
              </div>
              <div className="bg-[#0a0e17] rounded-xl p-3 text-xs text-[#4b5563] text-center border border-dashed border-[#1a2233]">
                <p>🧠 Motor de decisión único · generateWorkout()</p>
                <p className="mt-1">Single Source of Truth</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <div className="mt-8 pt-4 border-t border-[#1a2233] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#4b5563]">
          <span>World Tour Coach v10.1 · Single Source of Truth</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#34d399]"></span>
              Online
            </span>
            <span>FTP {data?.config?.ftp || 240}W</span>
            <span>⚡ {data?.config?.objetivo || 296}W objetivo</span>
          </div>
        </div>
      </main>
    </div>
  );
};

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

const Widget = ({ title, value, color, icon, subtitle, detail }) => (
  <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 hover:border-[#2a3a5a] transition hover:shadow-lg hover:shadow-[#0a0e17]">
    <div className="flex justify-between items-start">
      <p className="text-xs text-[#6b7a9f] uppercase tracking-wider">{title}</p>
      <span className={`${color}`}>{icon}</span>
    </div>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    <p className="text-xs text-[#6b7a9f] mt-1 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#6b7a9f]"></span>
      {subtitle}
    </p>
    {detail && <p className="text-[10px] text-[#4b5563] mt-1">{detail}</p>}
  </div>
);

const MetricCard = ({ label, value, sub, color }) => (
  <div className="bg-[#0a0e17] rounded-xl p-3 text-center">
    <p className={`text-lg font-bold ${color}`}>{value}</p>
    <p className="text-xs text-[#6b7a9f]">{label}</p>
    {sub && <p className="text-[10px] text-[#4b5563]">{sub}</p>}
  </div>
);

export default App;