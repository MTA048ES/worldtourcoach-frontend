import { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ComposedChart, Bar,
  Legend
} from 'recharts';
import {
  Bike, Activity, Calendar, TrendingUp, TrendingDown,
  Battery, Zap, Flame, Droplet, Wind, Cloud, Thermometer,
  Heart, Award, Clock, BarChart2, PieChart, Settings,
  ChevronRight, ChevronDown, ExternalLink, RefreshCw,
  Loader2, AlertTriangle, CheckCircle, XCircle,
  MapPin, Navigation, Maximize2, Minimize2, Menu, X,
  Home, List, LineChart as LineChartIcon, Target
} from 'lucide-react';
import './index.css';

// ============================================================
// CONFIGURACIÓN
// ============================================================

const API_URL = 'https://worldtourcoach-backend-production-c14a.up.railway.app';

// ============================================================
// HOOKS PERSONALIZADOS
// ============================================================

const useAthleteState = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/estado`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

// ============================================================
// COMPONENTES DE CARGA Y ERROR
// ============================================================

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 border-4 border-[#1a2233] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#60a5fa] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bike className="w-6 h-6 text-[#60a5fa]" />
        </div>
      </div>
      <p className="mt-4 text-[#9ca3af] font-medium">Cargando World Tour Coach</p>
      <p className="text-xs text-[#4b5563] mt-1">Conectando con el motor de decisión</p>
    </div>
  </div>
);

const ErrorScreen = ({ error, onRetry }) => (
  <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center p-4">
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 max-w-md w-full">
      <div className="flex items-center gap-3 mb-4">
        <XCircle className="w-8 h-8 text-[#ef4444]" />
        <h2 className="text-xl font-bold text-white">Error de conexión</h2>
      </div>
      <p className="text-[#9ca3af] text-sm mb-4">No se pudo conectar con el backend.</p>
      <div className="bg-[#0a0e17] rounded-lg p-3 mb-4">
        <p className="text-[#6b7a9f] text-xs font-mono break-all">{error}</p>
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

export default function App() {
  const { data, loading, error, refetch } = useAthleteState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={refetch} />;
  if (!data) return <ErrorScreen error="No se recibieron datos" onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8edf5]">
      <Header 
        onRefresh={refetch} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMenuOpen} 
        setIsOpen={setIsMenuOpen} 
      />

      <main className={`transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-0'} p-4 md:p-6`}>
        {activeTab === 'dashboard' && (
          <DashboardView 
            data={data} 
            onSelectActivity={(act) => {
              setSelectedActivity(act);
              setIsModalOpen(true);
            }}
          />
        )}
        {activeTab === 'actividades' && (
          <ActividadesView 
            activities={data?.datos?.activities || []} 
            onSelectActivity={(act) => {
              setSelectedActivity(act);
              setIsModalOpen(true);
            }}
          />
        )}
        {activeTab === 'progreso' && (
          <ProgresoView data={data} />
        )}
        {activeTab === 'entrenos' && (
          <EntrenosView data={data} />
        )}
        {activeTab === 'config' && (
          <ConfigView data={data} />
        )}
      </main>

      {isModalOpen && selectedActivity && (
        <ActivityModal 
          activity={selectedActivity} 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedActivity(null);
          }} 
        />
      )}
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================

const Header = ({ onRefresh, isMenuOpen, setIsMenuOpen }) => (
  <header className="sticky top-0 z-50 bg-[#0f1624]/95 backdrop-blur-xl border-b border-[#1a2233]">
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 hover:bg-[#1a2233] rounded-xl transition"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2a4a] to-[#2a4a6a] flex items-center justify-center">
            <Bike className="w-5 h-5 text-[#60a5fa]" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] bg-clip-text text-transparent">
              WORLD TOUR COACH
            </h1>
            <p className="text-[10px] text-[#6b7a9f] tracking-wider">v10.1 · SINGLE SOURCE OF TRUTH</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-[#1a2233] rounded-xl transition group"
        >
          <RefreshCw className="w-4 h-4 text-[#6b7a9f] group-hover:text-[#60a5fa] transition group-hover:rotate-180" />
        </button>
        <div className="flex items-center gap-2 bg-[#1a2233] rounded-xl px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
          <span className="text-xs text-[#9ca3af] hidden sm:inline">
            {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </span>
        </div>
      </div>
    </div>
  </header>
);

// ============================================================
// SIDEBAR
// ============================================================

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'actividades', icon: List, label: 'Actividades' },
    { id: 'progreso', icon: LineChartIcon, label: 'Progreso' },
    { id: 'entrenos', icon: Target, label: 'Entrenos' },
    { id: 'config', icon: Settings, label: 'Configuración' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0f1624] border-r border-[#1a2233] z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[#1a2233]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2a4a] to-[#2a4a6a] flex items-center justify-center">
                <Bike className="w-5 h-5 text-[#60a5fa]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">WTC</h2>
                <p className="text-[9px] text-[#6b7a9f]">v10.1</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-[#1a2a4a] text-[#60a5fa] shadow-lg shadow-[#1a2a4a]/20' 
                    : 'text-[#6b7a9f] hover:bg-[#1a2233] hover:text-white'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="ml-auto w-1.5 h-8 rounded-full bg-[#60a5fa]"></div>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[#1a2233]">
            <div className="bg-[#0a0e17] rounded-xl p-3">
              <p className="text-[10px] text-[#4b5563] text-center">
                🧠 Single Source of Truth
              </p>
              <p className="text-[9px] text-[#4b5563] text-center mt-0.5">
                generateWorkout()
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// ============================================================
// DASHBOARD VIEW
// ============================================================

const DashboardView = ({ data, onSelectActivity }) => {
  const tsb = data?.tsb || 0;
  const readiness = data?.readiness || 50;
  const ctl = data?.estado?.ctl || 50;
  const atl = data?.estado?.atl || 50;
  const decision = data?.decision || { tipo: 'descanso', durMin: 0, intensidad: 0 };
  const entreno = data?.entreno || { tssEsperado: 0, wLow: 0, wHigh: 0 };
  const weather = data?.datos?.weather || null;
  const activities = data?.datos?.activities || [];
  const consejo = data?.consejo || ['Sigue tu plan con consistencia.'];

  const chartData = useMemo(() => {
    const baseCtl = ctl;
    const baseAtl = atl;
    const baseTsb = tsb;
    return Array.from({ length: 14 }, (_, i) => ({
      dia: `Día ${13 - i}`,
      ctl: Math.max(10, baseCtl - i * 0.7 + (Math.random() - 0.5) * 2),
      atl: Math.max(10, baseAtl - i * 0.5 + (Math.random() - 0.5) * 2),
      tsb: baseTsb - i * 0.3 + (Math.random() - 0.5) * 1.5
    })).reverse();
  }, [ctl, atl, tsb]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <WidgetCard
          label="TSB"
          value={tsb.toFixed(1)}
          color={tsb > 0 ? '#34d399' : tsb > -10 ? '#fbbf24' : '#ef4444'}
          icon={tsb > 0 ? TrendingUp : TrendingDown}
          subtitle={tsb > 0 ? 'Fresco' : tsb > -10 ? 'Equilibrado' : 'Fatigado'}
          detail={`CTL ${ctl.toFixed(1)} · ATL ${atl.toFixed(1)}`}
        />
        <WidgetCard
          label="Readiness"
          value={`${readiness}%`}
          color={readiness > 70 ? '#34d399' : readiness > 50 ? '#fbbf24' : '#ef4444'}
          icon={readiness > 70 ? Battery : AlertTriangle}
          subtitle={readiness > 70 ? 'Alta' : readiness > 50 ? 'Media' : 'Baja'}
          detail={`HRV ${data?.estado?.hrv || 'N/D'}`}
        />
        <WidgetCard
          label="CTL (Forma)"
          value={ctl.toFixed(1)}
          color="#34d399"
          icon={TrendingUp}
          subtitle={ctl > atl ? '📈 Subiendo' : '📉 Bajando'}
          detail={`+${Math.abs(ctl - atl).toFixed(1)} vs ATL`}
        />
        <WidgetCard
          label="ATL (Fatiga)"
          value={atl.toFixed(1)}
          color={atl > 70 ? '#ef4444' : '#fbbf24'}
          icon={atl > 70 ? Flame : Activity}
          subtitle={atl > 70 ? '⚠️ Alta' : '✅ Controlada'}
          detail={`${data?.estado?.weeklySessions || 0} sesiones/semana`}
        />
      </div>

      <PlanCard decision={decision} entreno={entreno} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard data={chartData} className="lg:col-span-2" />
        <WeatherCard weather={weather} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={activities} onSelect={onSelectActivity} />
        <InsightsCard consejo={consejo} data={data} />
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTES DE UI
// ============================================================

const WidgetCard = ({ label, value, color, icon: Icon, subtitle, detail }) => (
  <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 hover:border-[#2a3a5a] transition-all duration-300 hover:shadow-xl hover:shadow-[#0a0e17]/50 group">
    <div className="flex justify-between items-start">
      <p className="text-xs text-[#6b7a9f] uppercase tracking-wider">{label}</p>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
    <p className="text-xs text-[#6b7a9f] mt-1 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></span>
      {subtitle}
    </p>
    {detail && <p className="text-[10px] text-[#4b5563] mt-1">{detail}</p>}
  </div>
);

const PlanCard = ({ decision, entreno }) => {
  const isDescanso = decision.tipo === 'descanso';
  const intensidad = Math.round((decision.intensidad || 0) * 100);

  return (
    <div className="bg-gradient-to-br from-[#111827] to-[#0f1624] border border-[#1f2937] rounded-2xl p-6 hover:border-[#2a3a5a] transition-all duration-300">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            PLAN DE HOY
          </h2>
          <p className="text-[10px] text-[#4b5563] mt-1">Generado por IA · Single Source of Truth</p>
        </div>
        <span className="text-[10px] bg-[#1a2a4a] text-[#60a5fa] px-3 py-1 rounded-full">
          {isDescanso ? '🧘 RECUPERACIÓN' : `🎯 ${decision.prioridad?.toUpperCase() || 'BASE'}`}
        </span>
      </div>

      {isDescanso ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🧘</div>
          <h3 className="text-2xl font-bold text-[#34d399]">DESCANSO TOTAL</h3>
          <p className="text-[#9ca3af] mt-2 text-sm">{decision.motivo || 'Recuperación prioritaria'}</p>
          <p className="text-[#6b7a9f] text-xs mt-3">💡 Movilidad suave · Foam rolling · Hidratación</p>
        </div>
      ) : (
        <div className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricItem label="Tipo" value={decision.tipo.toUpperCase()} sub={`${decision.reps || 1}x${decision.durMin || 0}min`} color="#fbbf24" />
            <MetricItem label="Intensidad" value={`${intensidad}%`} sub="FTP" color="#60a5fa" />
            <MetricItem label="TSS" value={entreno.tssEsperado?.toString() || '0'} sub={`IF ${entreno.ifEsperado || '0.00'}`} color="#fbbf24" />
            <MetricItem label="Vatios" value={`${entreno.wLow || 0}-${entreno.wHigh || 0}W`} sub="Rango objetivo" color="#34d399" />
          </div>
          {decision.notaHidratacion && (
            <div className="mt-4 flex items-center gap-2 bg-[#0a0e17] rounded-xl px-4 py-2.5 text-sm text-[#60a5fa]">
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
  );
};

const MetricItem = ({ label, value, sub, color }) => (
  <div className="bg-[#0a0e17] rounded-xl p-3 text-center">
    <p className="text-lg font-bold" style={{ color }}>{value}</p>
    <p className="text-xs text-[#6b7a9f]">{label}</p>
    {sub && <p className="text-[10px] text-[#4b5563]">{sub}</p>}
  </div>
);

const ChartCard = ({ data }) => (
  <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
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
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2233" />
          <XAxis dataKey="dia" stroke="#4b5563" fontSize={10} tickLine={false} />
          <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Legend iconType="circle" />
          <Area type="monotone" dataKey="ctl" stroke="#34d399" fill="#34d399" fillOpacity={0.1} />
          <Area type="monotone" dataKey="atl" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
          <Line type="monotone" dataKey="tsb" stroke="#fbbf24" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const WeatherCard = ({ weather }) => {
  if (!weather) return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 flex items-center justify-center text-[#4b5563]">
      <Cloud className="w-8 h-8 mr-2 opacity-50" />
      <span className="text-sm">Sin datos climáticos</span>
    </div>
  );

  const temp = weather.temp;
  const isHot = typeof temp === 'number' && temp > 30;
  const isCold = typeof temp === 'number' && temp < 5;
  const emoji = typeof temp === 'number' 
    ? temp > 35 ? '🔥' : temp > 30 ? '🌡️' : temp > 25 ? '☀️' : temp > 15 ? '🌤️' : temp > 5 ? '🌥️' : '❄️'
    : '🌤️';

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2 mb-4">
        <Cloud className="w-4 h-4" />
        CLIMA
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{emoji}</span>
            <div>
              <span className="text-2xl font-bold">{temp || 'N/D'}°C</span>
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
        {isHot && (
          <div className="bg-[#1a2a1a] border border-[#2a4a2a] rounded-xl px-3 py-2 text-xs text-[#34d399] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Calor alto · Hidratación extra
          </div>
        )}
        {isCold && (
          <div className="bg-[#1a1a2a] border border-[#2a2a4a] rounded-xl px-3 py-2 text-xs text-[#60a5fa] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Frío · Protégete bien
          </div>
        )}
      </div>
    </div>
  );
};

const RecentActivities = ({ activities, onSelect }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 flex flex-col items-center justify-center text-[#4b5563] py-12">
        <Activity className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No hay actividades recientes</p>
        <p className="text-xs mt-1">Los entrenos aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2">
          <Activity className="w-4 h-4" />
          ACTIVIDAD RECIENTE
        </h3>
        <span className="text-xs text-[#4b5563]">{activities.length} entrenos</span>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {activities.slice(0, 5).map((act, idx) => {
          const date = new Date(act.start_date_local || Date.now());
          return (
            <button
              key={idx}
              onClick={() => onSelect(act)}
              className="w-full bg-[#0a0e17] rounded-xl p-3 flex items-center gap-3 hover:bg-[#1a2233] transition-all duration-200 border border-transparent hover:border-[#1f2937] group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#1a2a4a] flex items-center justify-center group-hover:scale-105 transition">
                <Bike className="w-5 h-5 text-[#60a5fa]" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">{act.name || 'Ciclismo'}</p>
                <p className="text-xs text-[#6b7a9f]">
                  {date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} · 
                  {act.distance ? ` ${(act.distance / 1000).toFixed(1)} km` : ' 0 km'} · 
                  {act.moving_time ? ` ${Math.round(act.moving_time / 60)} min` : ' 0 min'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#fbbf24]">{Math.round(act.icu_training_load || 0)} TSS</p>
                <p className="text-xs text-[#6b7a9f]">{Math.round(act.icu_weighted_avg_watts || 0)}W</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#4b5563] group-hover:text-[#60a5fa] transition" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

const InsightsCard = ({ consejo, data }) => {
  const sleepQuality = data?.estado?.sleepQuality || 2;
  const weeklyTss = data?.estado?.weeklyTss || 0;
  const weeklySessions = data?.estado?.weeklySessions || 0;

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2 mb-4">
        <Heart className="w-4 h-4" />
        INSIGHTS & CONSEJOS
      </h3>
      <div className="space-y-3">
        {consejo.map((c, idx) => (
          <div key={idx} className="bg-[#0a0e17] rounded-xl p-3 text-sm text-[#e8edf5] flex items-start gap-2 border-l-2 border-[#60a5fa]">
            <span className="text-[#60a5fa] mt-0.5">💡</span>
            <span>{c}</span>
          </div>
        ))}
        <div className="bg-[#0a0e17] rounded-xl p-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6b7a9f]">😴 Sueño</span>
            <span className="font-medium">
              {sleepQuality === 1 ? '⚠️ Malo' : sleepQuality === 2 ? '🟡 Regular' : '🟢 Bueno'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6b7a9f]">📊 Carga semanal</span>
            <span className="font-medium">{Math.round(weeklyTss)} TSS</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6b7a9f]">🚴 Sesiones</span>
            <span className="font-medium">{weeklySessions}</span>
          </div>
        </div>
        <div className="bg-[#0a0e17] rounded-xl p-3 text-[10px] text-[#4b5563] text-center border border-dashed border-[#1a2233]">
          <p>🧠 Motor de decisión único · generateWorkout()</p>
          <p className="mt-0.5">Single Source of Truth</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// OTRAS VISTAS
// ============================================================

const ActividadesView = ({ activities, onSelectActivity }) => (
  <div className="max-w-7xl mx-auto">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <List className="w-6 h-6 text-[#60a5fa]" />
      Actividades
    </h2>
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4">
      {activities.length === 0 ? (
        <div className="text-center py-12 text-[#4b5563]">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No hay actividades registradas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((act, idx) => {
            const date = new Date(act.start_date_local || Date.now());
            return (
              <button
                key={idx}
                onClick={() => onSelectActivity(act)}
                className="w-full bg-[#0a0e17] rounded-xl p-4 flex flex-wrap items-center gap-4 hover:bg-[#1a2233] transition-all duration-200 border border-transparent hover:border-[#1f2937]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1a2a4a] flex items-center justify-center">
                  <Bike className="w-6 h-6 text-[#60a5fa]" />
                </div>
                <div className="flex-1 min-w-[150px] text-left">
                  <p className="font-medium">{act.name || 'Ciclismo'}</p>
                  <p className="text-xs text-[#6b7a9f]">
                    {date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-[#6b7a9f] text-[10px]">Distancia</p>
                    <p className="font-medium">{act.distance ? (act.distance / 1000).toFixed(1) : '0'} km</p>
                  </div>
                  <div>
                    <p className="text-[#6b7a9f] text-[10px]">TSS</p>
                    <p className="font-medium text-[#fbbf24]">{Math.round(act.icu_training_load || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[#6b7a9f] text-[10px]">Potencia</p>
                    <p className="font-medium">{Math.round(act.icu_weighted_avg_watts || 0)}W</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#4b5563]" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

const ProgresoView = ({ data }) => {
  const ftp = data?.config?.ftp || 240;
  const objetivo = data?.config?.objetivo || 296;
  const progreso = Math.min(100, Math.round(((ftp - 200) / (objetivo - 200)) * 100));

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <LineChartIcon className="w-6 h-6 text-[#60a5fa]" />
        Progreso
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Evolución FTP</h3>
          <div className="relative h-4 bg-[#1a2233] rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, progreso)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-[#6b7a9f]">200W</span>
            <span className="font-bold text-[#60a5fa]">{ftp}W</span>
            <span className="text-[#6b7a9f]">{objetivo}W</span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-[#0a0e17] rounded-xl p-3">
              <p className="text-2xl font-bold text-[#34d399]">{ftp}W</p>
              <p className="text-xs text-[#6b7a9f]">FTP Actual</p>
            </div>
            <div className="bg-[#0a0e17] rounded-xl p-3">
              <p className="text-2xl font-bold text-[#fbbf24]">{objetivo}W</p>
              <p className="text-xs text-[#6b7a9f]">Objetivo</p>
            </div>
            <div className="bg-[#0a0e17] rounded-xl p-3">
              <p className="text-2xl font-bold text-[#60a5fa]">{progreso}%</p>
              <p className="text-xs text-[#6b7a9f]">Progreso</p>
            </div>
          </div>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Estadísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7a9f]">CTL</span>
              <span className="font-medium">{data?.estado?.ctl?.toFixed(1) || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7a9f]">ATL</span>
              <span className="font-medium">{data?.estado?.atl?.toFixed(1) || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7a9f]">TSB</span>
              <span className="font-medium">{data?.tsb?.toFixed(1) || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7a9f]">Readiness</span>
              <span className="font-medium">{data?.readiness || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EntrenosView = ({ data }) => {
  const decision = data?.decision || { tipo: 'descanso' };
  const entreno = data?.entreno || {};
  const isDescanso = decision.tipo === 'descanso';

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Target className="w-6 h-6 text-[#60a5fa]" />
        Entrenos
      </h2>
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
        {isDescanso ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🧘</div>
            <h3 className="text-xl font-bold text-[#34d399]">Día de descanso</h3>
            <p className="text-[#9ca3af] mt-2">Recuperación activa</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0a0e17] rounded-xl p-4 text-center">
                <p className="text-xs text-[#6b7a9f]">Tipo</p>
                <p className="text-lg font-bold text-[#fbbf24]">{decision.tipo?.toUpperCase() || 'Z2'}</p>
              </div>
              <div className="bg-[#0a0e17] rounded-xl p-4 text-center">
                <p className="text-xs text-[#6b7a9f]">Estructura</p>
                <p className="text-lg font-bold text-[#60a5fa]">{decision.reps || 1}x{decision.durMin || 0}min</p>
              </div>
              <div className="bg-[#0a0e17] rounded-xl p-4 text-center">
                <p className="text-xs text-[#6b7a9f]">Intensidad</p>
                <p className="text-lg font-bold text-[#34d399]">{Math.round((decision.intensidad || 0) * 100)}%</p>
              </div>
              <div className="bg-[#0a0e17] rounded-xl p-4 text-center">
                <p className="text-xs text-[#6b7a9f]">TSS</p>
                <p className="text-lg font-bold text-[#fbbf24]">{entreno.tssEsperado || 0}</p>
              </div>
            </div>
            {decision.notaHidratacion && (
              <div className="flex items-center gap-2 bg-[#0a0e17] rounded-xl px-4 py-3 text-sm text-[#60a5fa]">
                <Droplet className="w-4 h-4" />
                <span>{decision.notaHidratacion}</span>
              </div>
            )}
            <div className="bg-[#0a0e17] rounded-xl p-4">
              <p className="text-xs text-[#6b7a9f] mb-2">Motivo</p>
              <p className="text-sm text-[#e8edf5]">{decision.motivo || 'Plan base'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ConfigView = ({ data }) => (
  <div className="max-w-7xl mx-auto">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <Settings className="w-6 h-6 text-[#60a5fa]" />
      Configuración
    </h2>
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
      <div className="space-y-4">
        <div className="flex justify-between py-2 border-b border-[#1a2233]">
          <span className="text-[#6b7a9f]">FTP</span>
          <span className="font-medium">{data?.config?.ftp || 240}W</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1a2233]">
          <span className="text-[#6b7a9f]">Peso</span>
          <span className="font-medium">{data?.config?.weight || 64} kg</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1a2233]">
          <span className="text-[#6b7a9f]">Edad</span>
          <span className="font-medium">{data?.config?.age || 43} años</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1a2233]">
          <span className="text-[#6b7a9f]">Objetivo</span>
          <span className="font-medium text-[#fbbf24]">{data?.config?.objetivo || 296}W</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[#6b7a9f]">Motor de decisión</span>
          <span className="font-medium text-[#34d399]">✅ Single Source of Truth</span>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// MODAL DE ACTIVIDAD
// ============================================================

const ActivityModal = ({ activity, onClose }) => {
  const date = new Date(activity.start_date_local || Date.now());
  const distance = activity.distance ? (activity.distance / 1000).toFixed(1) : '0';
  const duration = activity.moving_time ? Math.round(activity.moving_time / 60) : 0;
  const tss = Math.round(activity.icu_training_load || 0);
  const watts = Math.round(activity.icu_weighted_avg_watts || 0);
  const np = watts;
  const ap = Math.round(activity.icu_average_watts || watts || 0);
  const ifFactor = activity.ftp ? (watts / activity.ftp) : (watts / 240);
  const vi = ap > 0 ? (np / ap) : 1;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bike className="w-6 h-6 text-[#60a5fa]" />
              {activity.name || 'Ciclismo'}
            </h2>
            <p className="text-sm text-[#6b7a9f] mt-1">
              {date.toLocaleDateString('es-ES', { 
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' 
              })} · {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1a2233] rounded-xl transition"
          >
            <X className="w-5 h-5 text-[#6b7a9f]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#0a0e17] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b7a9f]">Distancia</p>
            <p className="text-lg font-bold text-[#60a5fa]">{distance} km</p>
          </div>
          <div className="bg-[#0a0e17] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b7a9f]">Duración</p>
            <p className="text-lg font-bold text-[#60a5fa]">{duration} min</p>
          </div>
          <div className="bg-[#0a0e17] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b7a9f]">TSS</p>
            <p className="text-lg font-bold text-[#fbbf24]">{tss}</p>
          </div>
          <div className="bg-[#0a0e17] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b7a9f]">IF</p>
            <p className="text-lg font-bold text-[#34d399]">{ifFactor.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-[#0a0e17] rounded-xl p-4 mb-6">
          <h4 className="text-sm font-semibold text-[#9ca3af] mb-3">Métricas de potencia</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-[#6b7a9f]">NP</p>
              <p className="text-lg font-bold text-[#60a5fa]">{np}W</p>
            </div>
            <div>
              <p className="text-xs text-[#6b7a9f]">AP</p>
              <p className="text-lg font-bold text-[#60a5fa]">{ap}W</p>
            </div>
            <div>
              <p className="text-xs text-[#6b7a9f]">VI</p>
              <p className="text-lg font-bold text-[#60a5fa]">{vi.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="flex-1 bg-[#1a2a4a] hover:bg-[#2a3a5a] text-[#60a5fa] font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Ver en Intervals
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#1a2233] hover:bg-[#2a2a3a] text-[#9ca3af] font-medium py-2.5 rounded-xl transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};