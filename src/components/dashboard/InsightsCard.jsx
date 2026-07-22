import { Heart, Moon, Brain, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const InsightsCard = ({ consejo, data }) => {
  const sleepQuality = data?.estado?.sleepQuality || 2;
  const weeklyTss = data?.estado?.weeklyTss || 0;
  const weeklySessions = data?.estado?.weeklySessions || 0;
  const hrv = data?.estado?.hrv || 'N/D';
  const stress = data?.estado?.stress || 2;

  const getSleepInfo = (quality) => {
    if (quality >= 3) return { label: 'Bueno', color: '#34d399', icon: CheckCircle, emoji: '🟢' };
    if (quality >= 2) return { label: 'Regular', color: '#fbbf24', icon: AlertTriangle, emoji: '🟡' };
    return { label: 'Malo', color: '#ef4444', icon: AlertTriangle, emoji: '🔴' };
  };

  const getStressInfo = (level) => {
    if (level <= 1) return { label: 'Bajo', color: '#34d399' };
    if (level <= 2) return { label: 'Medio', color: '#fbbf24' };
    return { label: 'Alto', color: '#ef4444' };
  };

  const sleepInfo = getSleepInfo(sleepQuality);
  const stressInfo = getStressInfo(stress);
  const SleepIcon = sleepInfo.icon;

  return (
    <div className="bg-[#111827] border border-[#1a2233] rounded-2xl p-5 hover:border-[#2a3a5a] transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2">
            <Heart className="w-4 h-4" />
            INSIGHTS & BIOMETRÍA
          </h3>
          <p className="text-[10px] text-[#4b5563]">Datos de wellness y recuperación</p>
        </div>
        <span className="text-[10px] text-[#4b5563]">Hoy</span>
      </div>

      {/* Biometrics grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-[#0a0e17] rounded-xl p-3 border border-[#1a2233]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Moon className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span className="text-[9px] text-[#6b7a9f] uppercase tracking-wider">Sueño</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">{data?.estado?.sleepHours || '--'}h</span>
            <span className="text-[10px]" style={{ color: sleepInfo.color }}>{sleepInfo.emoji} {sleepInfo.label}</span>
          </div>
        </div>
        <div className="bg-[#0a0e17] rounded-xl p-3 border border-[#1a2233]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Brain className="w-3.5 h-3.5 text-[#60a5fa]" />
            <span className="text-[9px] text-[#6b7a9f] uppercase tracking-wider">Estrés</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">{stressInfo.label}</span>
            <span className="w-2 h-2 rounded-full" style={{ background: stressInfo.color }} />
          </div>
        </div>
        <div className="bg-[#0a0e17] rounded-xl p-3 border border-[#1a2233]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Activity className="w-3.5 h-3.5 text-[#34d399]" />
            <span className="text-[9px] text-[#6b7a9f] uppercase tracking-wider">HRV</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">{hrv}</span>
            <span className="text-[10px] text-[#6b7a9f]">ms</span>
          </div>
        </div>
        <div className="bg-[#0a0e17] rounded-xl p-3 border border-[#1a2233]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span className="text-[9px] text-[#6b7a9f] uppercase tracking-wider">Carga semanal</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#fbbf24]">{Math.round(weeklyTss)}</span>
            <span className="text-[10px] text-[#6b7a9f]">TSS</span>
          </div>
        </div>
      </div>

      {/* Weekly summary bar */}
      <div className="bg-[#0a0e17] rounded-xl p-3 border border-[#1a2233] mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[#6b7a9f]">Sesiones esta semana</span>
          <span className="text-xs font-bold text-white">{weeklySessions}</span>
        </div>
        <div className="h-2 bg-[#1a2233] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] transition-all duration-1000"
            style={{ width: `${Math.min(100, (weeklySessions / 7) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-[#4b5563] mt-1">
          <span>0</span>
          <span>Meta: 7</span>
        </div>
      </div>

      {/* Tips */}
      {consejo.map((c, idx) => (
        <div key={idx} className="bg-[#0a0e17] rounded-xl p-3 text-xs text-[#e8edf5] flex items-start gap-2 border-l-2 border-[#60a5fa] mb-2 last:mb-0">
          <span className="text-[#60a5fa] mt-0.5 flex-shrink-0">💡</span>
          <span>{c}</span>
        </div>
      ))}
    </div>
  );
};

export default InsightsCard;