import { Target, Droplet } from 'lucide-react';

const EntrenosView = ({ data }) => {
  const decision = data?.decision || { tipo: 'descanso' };
  const entreno = data?.entreno || {};
  const isDescanso = decision.tipo === 'descanso';

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Target className="w-6 h-6 text-[#60a5fa]" />
        Entrenos
      </h2>
      <div className="bg-[#111827] border border-[#1a2233] rounded-2xl p-5">
        {isDescanso ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🧘</div>
            <h3 className="text-xl font-bold text-[#34d399]">Día de descanso</h3>
            <p className="text-[#9ca3af] mt-2">Recuperación activa</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0a0e17] rounded-xl p-4 text-center border border-[#1a2233]">
                <p className="text-xs text-[#6b7a9f]">Tipo</p>
                <p className="text-lg font-bold text-[#fbbf24]">{decision.tipo?.toUpperCase() || 'Z2'}</p>
              </div>
              <div className="bg-[#0a0e17] rounded-xl p-4 text-center border border-[#1a2233]">
                <p className="text-xs text-[#6b7a9f]">Estructura</p>
                <p className="text-lg font-bold text-[#60a5fa]">{decision.reps || 1}x{decision.durMin || 0}min</p>
              </div>
              <div className="bg-[#0a0e17] rounded-xl p-4 text-center border border-[#1a2233]">
                <p className="text-xs text-[#6b7a9f]">Intensidad</p>
                <p className="text-lg font-bold text-[#34d399]">{Math.round((decision.intensidad || 0) * 100)}%</p>
              </div>
              <div className="bg-[#0a0e17] rounded-xl p-4 text-center border border-[#1a2233]">
                <p className="text-xs text-[#6b7a9f]">TSS</p>
                <p className="text-lg font-bold text-[#fbbf24]">{entreno.tssEsperado || 0}</p>
              </div>
            </div>
            {decision.notaHidratacion && (
              <div className="flex items-center gap-2 bg-[#0a0e17] rounded-xl px-4 py-3 text-sm text-[#60a5fa] border border-[#1a2233]">
                <Droplet className="w-4 h-4" />
                <span>{decision.notaHidratacion}</span>
              </div>
            )}
            <div className="bg-[#0a0e17] rounded-xl p-4 border border-[#1a2233]">
              <p className="text-xs text-[#6b7a9f] mb-2">Motivo</p>
              <p className="text-sm text-[#e8edf5]">{decision.motivo || 'Plan base'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrenosView;