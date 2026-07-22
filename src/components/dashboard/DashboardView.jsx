import { TrendingUp, TrendingDown, Battery, AlertTriangle, Flame, Activity, Heart, Moon, Zap, Target, BarChart3 } from 'lucide-react';
import PlanCard from './PlanCard';
import PerformanceChart from './PerformanceChart';
import WeatherCard from './WeatherCard';
import RecentActivities from './RecentActivities';
import InsightsCard from './InsightsCard';
import CircularProgress from '../ui/CircularProgress';
import BiometricsSection from './sections/BiometricsSection';
import TrainingPlanSection from './sections/TrainingPlanSection';
import PerformanceAnalysis from './sections/PerformanceAnalysis';

const DashboardView = ({ data, onSelectActivity }) => {
  const tsb = data?.tsb || 0;
  const readiness = data?.readiness || 50;
  const ctl = data?.estado?.ctl || 50;
  const atl = data?.estado?.atl || 50;
  const weeklyTss = data?.estado?.weeklyTss || 0;
  const weeklySessions = data?.estado?.weeklySessions || 0;
  const decision = data?.decision || {};
  const entreno = data?.entreno || {};
  const weather = data?.datos?.weather || null;
  const activities = data?.datos?.activities || [];
  const consejo = data?.consejo || [];

  const status = ctl > atl && tsb > 5 ? { label: 'Productivo', color: '#10b981', icon: TrendingUp }
    : tsb > 10 ? { label: 'Recuperado', color: '#3b82f6', icon: Battery }
    : tsb < -15 ? { label: 'Sobrecarga', color: '#ef4444', icon: AlertTriangle }
    : tsb < -5 ? { label: 'Fatiga alta', color: '#f97316', icon: Flame }
    : { label: 'Mantenimiento', color: '#f59e0b', icon: Activity };

  const StatusIcon = status.icon;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-4">
      {/* Training Status Header */}
      <div className="flex items-center justify-between bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${status.color}20` }}>
            <StatusIcon className="w-5 h-5" style={{ color: status.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">Training Status</h1>
              <span className="badge" style={{ background: `${status.color}20`, color: status.color }}>{status.label}</span>
            </div>
            <p className="text-[10px] text-slate-400">TSB {tsb.toFixed(1)} · {weeklySessions} ses/sem · {Math.round(weeklyTss)} TSS</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="status-dot green" />
          <span className="text-[10px] text-emerald-400 font-medium">SSOT v10.2</span>
        </div>
      </div>

      {/* Row 1: Core Metrics (4 columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* TSB */}
        <div className="card">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">TSB</span>
            {tsb > 0 ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
          </div>
          <p className="text-xl font-bold tracking-tight" style={{ color: tsb > 0 ? '#10b981' : tsb > -10 ? '#f59e0b' : '#ef4444' }}>{tsb.toFixed(1)}</p>
          <p className="text-[9px] text-slate-500">{tsb > 0 ? 'Recuperado' : tsb > -10 ? 'Equilibrado' : 'Fatigado'}</p>
        </div>

        {/* Readiness */}
        <div className="card">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Readiness</span>
            <Battery className="w-3 h-3" style={{ color: readiness > 70 ? '#10b981' : readiness > 50 ? '#f59e0b' : '#ef4444' }} />
          </div>
          <div className="flex items-center gap-2">
            <CircularProgress value={readiness} size={40} strokeWidth={4} color={readiness > 70 ? '#10b981' : readiness > 50 ? '#f59e0b' : '#ef4444'} />
            <div><p className="text-base font-bold text-white">{readiness}%</p><p className="text-[9px] text-slate-500">Body Battery</p></div>
          </div>
        </div>

        {/* CTL */}
        <div className="card">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">CTL</span>
            <span className="text-[8px] text-slate-500">Forma</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">{ctl.toFixed(1)}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="progress-bar flex-1"><div className="progress-bar-fill bg-emerald-500" style={{ width: `${Math.min(100, ctl)}%` }} /></div>
            <span className="text-[9px] text-slate-500">{ctl > atl ? '📈' : '📉'}</span>
          </div>
        </div>

        {/* ATL */}
        <div className="card">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">ATL</span>
            <span className="text-[8px] text-slate-500">Fatiga</span>
          </div>
          <p className="text-xl font-bold" style={{ color: atl > 70 ? '#ef4444' : '#f59e0b' }}>{atl.toFixed(1)}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="progress-bar flex-1"><div className="progress-bar-fill" style={{ width: `${Math.min(100, atl)}%`, background: atl > 70 ? '#ef4444' : '#f59e0b' }} /></div>
            <span className="text-[9px] text-slate-500">{atl > 70 ? '⚠️' : '✅'}</span>
          </div>
        </div>
      </div>

      {/* Row 2: Biometrics + Training Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4">
          <BiometricsSection data={data} />
        </div>
        <div className="lg:col-span-8">
          <TrainingPlanSection data={data} />
        </div>
      </div>

      {/* Row 3: PMC Chart + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <PerformanceAnalysis data={data} />
        </div>
        <div className="lg:col-span-4">
          <WeatherCard weather={weather} />
        </div>
      </div>

      {/* Row 4: Activities + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <RecentActivities activities={activities} onSelect={onSelectActivity} />
        </div>
        <div className="lg:col-span-5">
          <InsightsCard consejo={consejo} data={data} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;