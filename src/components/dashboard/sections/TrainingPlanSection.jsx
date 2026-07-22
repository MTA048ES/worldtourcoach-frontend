import { useState } from 'react';
import { Bike, Dumbbell, Heart, Utensils, ChevronRight, Clock, Zap, Target, Flame } from 'lucide-react';

const trainingPillars = {
  ciclismo: { icon: Bike, label: 'Ciclismo', color: '#f97316', bg: 'bg-orange-500/10' },
  fuerza: { icon: Dumbbell, label: 'Fuerza', color: '#ef4444', bg: 'bg-red-500/10' },
  movilidad: { icon: Heart, label: 'Movilidad', color: '#10b981', bg: 'bg-emerald-500/10' },
  nutricion: { icon: Utensils, label: 'Nutrición', color: '#f59e0b', bg: 'bg-yellow-500/10' },
};

const ciclismoData = {
  tipo: 'Sweet Spot',
  duracion: 90,
  tss: 180,
  np: 245,
  if: 0.78,
  bloques: [
    { zona: 'Z2', min: 15, watts: '180-200', desc: 'Calentamiento' },
    { zona: 'Z4', min: 20, watts: '241-280', desc: 'Sweet Spot' },
    { zona: 'Z2', min: 5, watts: '180-200', desc: 'Recuperación' },
    { zona: 'Z4', min: 20, watts: '241-280', desc: 'Sweet Spot' },
    { zona: 'Z2', min: 10, watts: '180-200', desc: 'Enfriamiento' },
  ],
  cadencia: '85-95 rpm',
  motivo: 'TSB favorable, sin fatiga acumulada. Clima óptimo.',
};

const fuerzaData = {
  fase: 'Hipertrofia',
  ejercicios: [
    { nombre: 'Sentadilla', series: 4, reps: '8-10', rm: '75%', descanso: '90s' },
    { nombre: 'Peso Muerto', series: 4, reps: '6-8', rm: '70%', descanso: '120s' },
    { nombre: 'Press Banca', series: 4, reps: '8-10', rm: '70%', descanso: '90s' },
    { nombre: 'Dominadas', series: 3, reps: '6-8', rm: 'BW', descanso: '60s' },
  ],
  rpe: 7,
};

const movilidadData = {
  tipo: 'Post-entreno',
  duracion: 15,
  ejercicios: [
    { nombre: 'Estiramiento isquios', dur: '2 min', foco: 'Piernas' },
    { nombre: 'Rotaciones lumbares', dur: '2 min', foco: 'Core' },
    { nombre: 'Movilidad cadera', dur: '3 min', foco: 'Cadera' },
    { nombre: 'Respiración diafragmática', dur: '3 min', foco: 'Recuperación' },
  ],
};

const nutricionData = {
  antes: { carbs: '60-80g', timing: '2h antes', hidratacion: '500ml' },
  durante: { carbs: '60-90g/h', sodio: '500-750mg/h', agua: '150-200ml/15min' },
  despues: { carbs: '1-1.2g/kg', proteinas: '0.3-0.4g/kg', hidratacion: '150% del peso perdido' },
};

const TrainingPlanSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState('ciclismo');
  const decision = data?.decision || ciclismoData;
  const entreno = data?.entreno || {};

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-orange-400" />
          Plan de Entrenamiento Hoy
        </h3>
        <span className="badge badge-orange">SSOT Engine</span>
      </div>

      {/* Pillar tabs */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Object.entries(trainingPillars).map(([key, pillar]) => {
          const Icon = pillar.icon;
          return (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all ${
                activeTab === key ? pillar.bg : 'bg-slate-800/50'
              }`}>
              <Icon className="w-5 h-5" style={{ color: pillar.color }} />
              <span className="text-[10px] font-medium text-slate-300">{pillar.label}</span>
            </button>
          );
        })}
      </div>

      {/* CICLISMO */}
      {activeTab === 'ciclismo' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">{decision.tipo?.toUpperCase() || 'SWEET SPOT'}</h4>
              <p className="text-[10px] text-slate-400">{decision.motivo || 'Entreno estructurado'}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-orange-400">{decision.durMin || 90}<span className="text-xs text-slate-400 ml-1">min</span></p>
              <p className="text-[9px] text-slate-500">{entreno.tssEsperado || 180} TSS</p>
            </div>
          </div>

          {/* Intensity map */}
          <div className="flex gap-0.5 h-8">
            {ciclismoData.bloques?.map((blk, i) => {
              const intensity = blk.zona === 'Z2' ? 30 : blk.zona === 'Z4' ? 70 : 20;
              return (
                <div key={i} className="flex-1 rounded-sm" style={{
                  background: `linear-gradient(to top, #f97316, #fbbf24)`,
                  opacity: intensity / 100,
                }} title={`${blk.zona}: ${blk.min}min`} />
              );
            })}
          </div>

          {/* Blocks detail */}
          <div className="space-y-1.5">
            {ciclismoData.bloques?.map((blk, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-800/30 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-orange-400">{blk.zona}</span>
                  <span className="text-xs text-slate-300">{blk.desc}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span>{blk.min} min</span>
                  <span>{blk.watts}W</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center bg-slate-800/30 rounded-lg py-2">
              <p className="text-[9px] text-slate-400">NP</p>
              <p className="text-sm font-bold text-orange-400">{ciclismoData.np || 245}W</p>
            </div>
            <div className="text-center bg-slate-800/30 rounded-lg py-2">
              <p className="text-[9px] text-slate-400">IF</p>
              <p className="text-sm font-bold text-yellow-400">{ciclismoData.if || 0.78}</p>
            </div>
            <div className="text-center bg-slate-800/30 rounded-lg py-2">
              <p className="text-[9px] text-slate-400">Cadencia</p>
              <p className="text-sm font-bold text-blue-400">{ciclismoData.cadencia || '85-95'}</p>
            </div>
          </div>
        </div>
      )}

      {/* FUERZA */}
      {activeTab === 'fuerza' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">{fuerzaData.fase}</h4>
              <p className="text-[10px] text-slate-400">RPE objetivo: {fuerzaData.rpe}/10</p>
            </div>
            <Dumbbell className="w-5 h-5 text-red-400" />
          </div>
          <div className="space-y-1.5">
            {fuerzaData.ejercicios.map((ej, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-800/30 rounded-lg px-3 py-2.5">
                <div>
                  <p className="text-xs font-medium text-white">{ej.nombre}</p>
                  <p className="text-[9px] text-slate-400">{ej.series} series · {ej.reps} reps · {ej.rm}</p>
                </div>
                <span className="text-[10px] text-slate-400">Descanso: {ej.descanso}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOVILIDAD */}
      {activeTab === 'movilidad' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">{movilidadData.tipo}</h4>
              <p className="text-[10px] text-slate-400">{movilidadData.duracion} minutos · Enfocado en recuperación</p>
            </div>
            <Heart className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="space-y-1.5">
            {movilidadData.ejercicios.map((ej, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-800/30 rounded-lg px-3 py-2">
                <div>
                  <p className="text-xs font-medium text-white">{ej.nombre}</p>
                  <p className="text-[9px] text-slate-400">{ej.foco}</p>
                </div>
                <span className="text-[10px] text-emerald-400">{ej.dur}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NUTRICIÓN */}
      {activeTab === 'nutricion' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Estrategia Nutricional</h4>
            <Utensils className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-2">
            <div className="bg-slate-800/30 rounded-lg p-3">
              <p className="text-[10px] text-yellow-400 font-semibold mb-1">ANTES DEL ENTRENO</p>
              <p className="text-xs text-slate-300">Carbohidratos: {nutricionData.antes.carbs}</p>
              <p className="text-[10px] text-slate-400">Timing: {nutricionData.antes.timing} · Hidratación: {nutricionData.antes.hidratacion}</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3">
              <p className="text-[10px] text-orange-400 font-semibold mb-1">DURANTE</p>
              <p className="text-xs text-slate-300">Carbs: {nutricionData.durante.carbs} · Sodio: {nutricionData.durante.sodio}</p>
              <p className="text-[10px] text-slate-400">Agua: {nutricionData.durante.agua}</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3">
              <p className="text-[10px] text-emerald-400 font-semibold mb-1">DESPUÉS</p>
              <p className="text-xs text-slate-300">Carbs: {nutricionData.despues.carbs} · Proteínas: {nutricionData.despues.proteinas}</p>
              <p className="text-[10px] text-slate-400">Hidratación: {nutricionData.despues.hidratacion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPlanSection;