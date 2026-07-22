import { Moon, Brain, Heart, Activity, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const sleepData = [
  { name: 'Lun', deep: 1.5, rem: 1.2, light: 2.8 },
  { name: 'Mar', deep: 1.8, rem: 1.5, light: 2.5 },
  { name: 'Mié', deep: 1.2, rem: 1.0, light: 3.0 },
  { name: 'Jue', deep: 2.0, rem: 1.8, light: 2.2 },
  { name: 'Vie', deep: 1.6, rem: 1.3, light: 2.6 },
  { name: 'Sáb', deep: 2.2, rem: 2.0, light: 2.3 },
  { name: 'Dom', deep: 1.9, rem: 1.6, light: 2.5 },
];

const hrvTrend = [
  { day: 'Lun', value: 45 },
  { day: 'Mar', value: 48 },
  { day: 'Mié', value: 42 },
  { day: 'Jue', value: 50 },
  { day: 'Vie', value: 47 },
  { day: 'Sáb', value: 52 },
  { day: 'Dom', value: 49 },
];

const BiometricsSection = ({ data }) => {
  const sleepScore = data?.estado?.sleepScore || 72;
  const sleepHours = data?.estado?.sleepHours || 7.2;
  const hrv = data?.estado?.hrv || 45;
  const hrvTrendVal = data?.estado?.hrvTrend || 'stable';
  const bodyBattery = data?.estado?.readiness || 65;
  const stress = data?.estado?.stress || 2;
  const rhr = data?.estado?.rhr || 52;

  const getSleepColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getHrvStatus = (val, trend) => {
    if (trend === 'up') return { label: 'Alto', color: '#10b981', icon: TrendingUp };
    if (trend === 'down') return { label: 'Bajo', color: '#ef4444', icon: TrendingDown };
    return { label: 'Equilibrado', color: '#3b82f6', icon: Minus };
  };

  const hrvStatus = getHrvStatus(hrv, hrvTrendVal);
  const HrvIcon = hrvStatus.icon;

  const getStressColor = (level) => {
    if (level <= 1) return '#10b981';
    if (level <= 2) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-4">
      {/* Sleep & Recovery Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Moon className="w-4 h-4 text-purple-400" />
            Sueño y Recuperación
          </h3>
          <span className="text-[10px] text-slate-500">Últimos 7 días</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Sleep Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sleep Score</span>
              <span className="text-lg font-bold" style={{ color: getSleepColor(sleepScore) }}>{sleepScore}</span>
            </div>
            <div className="progress-bar mb-2">
              <div className="progress-bar-fill" style={{ width: `${sleepScore}%`, background: getSleepColor(sleepScore) }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>0</span>
              <span>100</span>
            </div>
          </div>

          {/* Sleep Hours */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">Horas totales</span>
            <p className="text-2xl font-bold text-white">{sleepHours}<span className="text-sm text-slate-400 ml-1">h</span></p>
            <p className="text-[9px] text-slate-500 mt-1">Objetivo: 8h</p>
          </div>
        </div>

        {/* Sleep phases chart */}
        <div className="mt-4">
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="deep" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Profundo" />
                <Area type="monotone" dataKey="rem" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} name="REM" />
                <Area type="monotone" dataKey="light" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Ligero" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-2 h-2 rounded-sm bg-indigo-500" /> Profundo</span>
            <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-2 h-2 rounded-sm bg-purple-500" /> REM</span>
            <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-2 h-2 rounded-sm bg-blue-500" /> Ligero</span>
          </div>
        </div>
      </div>

      {/* HRV & Body Battery */}
      <div className="grid grid-cols-2 gap-4">
        {/* HRV */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">HRV</span>
            <HrvIcon className="w-3.5 h-3.5" style={{ color: hrvStatus.color }} />
          </div>
          <p className="text-2xl font-bold text-white">{hrv}<span className="text-xs text-slate-400 ml-1">ms</span></p>
          <p className="text-[10px] mt-1" style={{ color: hrvStatus.color }}>{hrvStatus.label}</p>
          <div className="h-[60px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hrvTrend}>
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Battery */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Body Battery</span>
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{bodyBattery}<span className="text-xs text-slate-400 ml-1">%</span></p>
          <div className="progress-bar mt-2">
            <div className="progress-bar-fill bg-gradient-to-r from-yellow-500 to-orange-500" style={{ width: `${bodyBattery}%` }} />
          </div>
          <p className="text-[9px] text-slate-500 mt-1">Readiness para entrenar</p>
        </div>
      </div>

      {/* Stress & RHR */}
      <div className="card">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-400" />
          Estrés y Frecuencia en Reposo
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Nivel de estrés</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(stress / 5) * 100}%`, background: getStressColor(stress) }} />
              </div>
              <span className="text-sm font-bold text-white">{stress}/5</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Frecuencia en reposo (RHR)</span>
            <p className="text-xl font-bold text-white">{rhr}<span className="text-xs text-slate-400 ml-1">bpm</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip">
      <p className="label">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="value" style={{ color: entry.color }}>{entry.name}: {entry.value.toFixed(1)}h</p>
      ))}
    </div>
  );
};

export default BiometricsSection;