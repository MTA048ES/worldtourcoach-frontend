import { Calendar, Clock, Zap, Droplet, ChevronRight, Bike, Activity, Heart } from 'lucide-react';

const workoutTypes = {
  descanso: { icon: Heart, label: 'Recuperación', color: '#34d399', bg: 'bg-[#1a2a1a]' },
  z2: { icon: Activity, label: 'Resistencia', color: '#60a5fa', bg: 'bg-[#1a2a4a]' },
  sweetspot: { icon: Zap, label: 'Sweet Spot', color: '#fbbf24', bg: 'bg-[#2a2a1a]' },
  ftp: { icon: Zap, label: 'FTP', color: '#f97316', bg: 'bg-[#2a1a1a]' },
  vo2: { icon: Zap, label: 'VO2 Max', color: '#ef4444', bg: 'bg-[#2a0a0a]' },
  sprint: { icon: Bike, label: 'Sprint', color: '#a855f7', bg: 'bg-[#1a0a2a]' },
};

const PlanCard = ({ decision, entreno }) => {
  const isDescanso = decision.tipo === 'descanso';
  const tipo = decision.tipo?.toLowerCase() || 'z2';
  const workout = workoutTypes[tipo] || workoutTypes.z2;
  const intensidad = Math.round((decision.intensidad || 0) * 100);
  const Icon = workout.icon;

  const getIntensityBars = () => {
    const bars = 10;
    const filled = Math.round((intensidad / 100) * bars);
    return Array.from({ length: bars }, (_, i) => ({
      filled: i < filled,
      color: i < filled * 0.3 ? '#34d399' : i < filled * 0.6 ? '#fbbf24' : '#ef4444'
    }));
  };

  return (
    <div className="bg-gradient-to-br from-[#111827] to-[#0f1624] border border-[#1a2233] rounded-2xl overflow-hidden hover:border-[#2a3a5a] transition-all duration-300 shadow-xl shadow-[#0a0e17]">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-[#1a2233] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-xl ${workout.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-4 h-4" style={{ color: workout.color }} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">Entrenamiento de hoy</h3>
            <p className="text-[9px] text-[#6b7a9f] truncate">Generado por IA · SSOT</p>
          </div>
        </div>
        <span className={`badge-primary flex-shrink-0 ${isDescanso ? 'bg-[#1a2a1a] text-[#34d399]' : workout.bg}`} style={{ color: isDescanso ? '#34d399' : workout.color }}>
          {isDescanso ? '🧘 RECUPERACIÓN' : `🎯 ${workout.label.toUpperCase()}`}
        </span>
      </div>

      {isDescanso ? (
        <div className="text-center py-8 px-5">
          <div className="text-4xl mb-3">🧘</div>
          <h3 className="text-xl font-bold text-[#34d399] mb-2">DESCANSO TOTAL</h3>
          <p className="text-[#9ca3af] text-sm mb-1 break-words">{decision.motivo || 'Recuperación prioritaria'}</p>
          <p className="text-[#6b7a9f] text-xs">💡 Movilidad suave · Foam rolling · Hidratación</p>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          {/* Intensity map */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] text-[#6b7a9f] uppercase tracking-wider font-semibold">Intensidad</span>
              <span className="text-xs font-bold" style={{ color: workout.color }}>{intensidad}% FTP</span>
            </div>
            <div className="flex gap-0.5 h-6">
              {getIntensityBars().map((bar, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all duration-500"
                  style={{
                    background: bar.filled ? `linear-gradient(to top, ${bar.color}, ${bar.color}88)` : '#1a2233',
                    opacity: bar.filled ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[7px] text-[#4b5563] mt-0.5">
              <span>Z1</span><span>Z2</span><span>Z3</span><span>Z4</span><span>Z5</span><span>Z6</span>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="bg-[#0a0e17] rounded-xl p-2.5 text-center border border-[#1a2233]">
              <p className="text-[8px] text-[#6b7a9f] uppercase tracking-wider">Duración</p>
              <p className="text-sm font-bold text-white">{decision.durMin || 0} min</p>
              <p className="text-[8px] text-[#4b5563]">{decision.reps || 1} reps</p>
            </div>
            <div className="bg-[#0a0e17] rounded-xl p-2.5 text-center border border-[#1a2233]">
              <p className="text-[8px] text-[#6b7a9f] uppercase tracking-wider">TSS</p>
              <p className="text-sm font-bold text-[#fbbf24]">{entreno.tssEsperado || 0}</p>
              <p className="text-[8px] text-[#4b5563]">IF {entreno.ifEsperado || '0.00'}</p>
            </div>
            <div className="bg-[#0a0e17] rounded-xl p-2.5 text-center border border-[#1a2233]">
              <p className="text-[8px] text-[#6b7a9f] uppercase tracking-wider">Vatios</p>
              <p className="text-sm font-bold text-[#60a5fa]">{entreno.wLow || 0}-{entreno.wHigh || 0}W</p>
              <p className="text-[8px] text-[#4b5563]">Rango</p>
            </div>
            <div className="bg-[#0a0e17] rounded-xl p-2.5 text-center border border-[#1a2233]">
              <p className="text-[8px] text-[#6b7a9f] uppercase tracking-wider">Tipo</p>
              <p className="text-sm font-bold text-[#34d399]">{decision.tipo?.toUpperCase() || 'Z2'}</p>
              <p className="text-[8px] text-[#4b5563]">{decision.prioridad || 'Base'}</p>
            </div>
          </div>

          {/* Notes - with text wrapping and overflow handling */}
          {decision.notaHidratacion && (
            <div className="flex items-start gap-2 bg-[#0a0e17] rounded-xl px-3 py-2 text-xs text-[#60a5fa] border border-[#1a2233] mb-2">
              <Droplet className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span className="break-words">{decision.notaHidratacion}</span>
            </div>
          )}

          {decision.motivo && (
            <div className="text-[10px] text-[#6b7a9f] mb-3 max-h-16 overflow-y-auto break-words leading-relaxed">
              🧠 {decision.motivo}
            </div>
          )}

          {/* Action button */}
          <button className="w-full btn-primary text-xs py-2">
            Ver detalles
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanCard;