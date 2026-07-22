import { useState, useEffect } from 'react';
import './index.css';

// ─── COMPONENTES ───
function App() {
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://worldtourcoach-backend-production-c14a.up.railway.app';

  useEffect(() => {
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
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0e17]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1f2937] border-t-[#60a5fa] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#9ca3af]">Cargando World Tour Coach...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0e17] p-4">
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 max-w-md w-full">
          <h2 className="text-red-400 text-lg font-bold mb-2">⚠️ Error de conexión</h2>
          <p className="text-[#9ca3af] text-sm mb-4">No se pudo conectar con el backend.</p>
          <p className="text-[#6b7a9f] text-xs font-mono break-all">{error}</p>
          <p className="text-[#6b7a9f] text-xs mt-2">URL: {API_URL}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const data = estado;
  const tsb = data?.tsb || 0;
  const readiness = data?.readiness || 50;
  const ctl = data?.estado?.ctl || 50;
  const atl = data?.estado?.atl || 50;
  const decision = data?.decision || { tipo: 'descanso', durMin: 0, intensidad: 0 };
  const entreno = data?.entreno || { tssEsperado: 0, wLow: 0, wHigh: 0 };
  const weather = data?.datos?.weather || null;
  const activities = data?.datos?.activities || [];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8edf5] p-4 md:p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-[#1a2233]">
        <h1 className="text-xl font-bold text-[#60a5fa]">🚴 WORLD TOUR COACH</h1>
        <div className="flex items-center gap-3 text-sm text-[#9ca3af]">
          <span>{new Date().toLocaleDateString('es-ES')}</span>
          <span className="bg-[#1a2233] px-3 py-1 rounded-full text-[#60a5fa] text-xs">v10.1</span>
        </div>
      </header>

      {/* WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center hover:border-[#60a5fa] transition cursor-default">
          <div className={`text-2xl font-bold ${tsb > 0 ? 'text-[#34d399]' : tsb > -10 ? 'text-[#fbbf24]' : 'text-[#ef4444]'}`}>{tsb.toFixed(1)}</div>
          <div className="text-xs text-[#9ca3af] mt-1">TSB</div>
          <div className={`text-xs mt-1 ${tsb > 0 ? 'text-[#34d399]' : tsb > -10 ? 'text-[#fbbf24]' : 'text-[#ef4444]'}`}>
            {tsb > 0 ? '▲ Fresco' : tsb > -10 ? '● Equilibrado' : '▼ Fatigado'}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center hover:border-[#60a5fa] transition cursor-default">
          <div className={`text-2xl font-bold ${readiness > 70 ? 'text-[#34d399]' : readiness > 50 ? 'text-[#fbbf24]' : 'text-[#ef4444]'}`}>{readiness}/100</div>
          <div className="text-xs text-[#9ca3af] mt-1">Readiness</div>
          <div className="text-xs text-[#9ca3af] mt-1">{readiness > 70 ? '🟢 Alta' : readiness > 50 ? '🟡 Media' : '🔴 Baja'}</div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center hover:border-[#60a5fa] transition cursor-default">
          <div className="text-2xl font-bold text-[#34d399]">{ctl.toFixed(1)}</div>
          <div className="text-xs text-[#9ca3af] mt-1">CTL (Forma)</div>
          <div className="text-xs text-[#9ca3af] mt-1">{ctl > atl ? '📈 Subiendo' : '📉 Bajando'}</div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center hover:border-[#60a5fa] transition cursor-default">
          <div className={`text-2xl font-bold ${atl > 70 ? 'text-[#ef4444]' : 'text-[#fbbf24]'}`}>{atl.toFixed(1)}</div>
          <div className="text-xs text-[#9ca3af] mt-1">ATL (Fatiga)</div>
          <div className="text-xs text-[#9ca3af] mt-1">{atl > 70 ? '⚠️ Alta' : '✅ Controlada'}</div>
        </div>
      </div>

      {/* PLAN DE HOY */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-[#9ca3af]">🚴 Plan de hoy</h3>
          <span className="text-xs text-[#60a5fa] cursor-pointer hover:underline">Ver detalles</span>
        </div>
        {decision.tipo === 'descanso' ? (
          <div className="text-center py-4">
            <div className="text-xl font-bold text-[#34d399]">🧘 DESCANSO TOTAL</div>
            <div className="text-sm text-[#9ca3af] mt-1">{decision.motivo || 'Recuperación prioritaria'}</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-lg font-bold text-[#fbbf24]">{decision.tipo.toUpperCase()}</div>
              <div className="text-xs text-[#9ca3af]">{decision.reps > 0 ? decision.reps + 'x' + decision.durMin + 'min' : decision.durMin + 'min continuos'}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#60a5fa]">{Math.round(decision.intensidad * 100)}%</div>
              <div className="text-xs text-[#9ca3af]">Intensidad FTP</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#fbbf24]">{entreno.tssEsperado}</div>
              <div className="text-xs text-[#9ca3af]">TSS</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#34d399]">{entreno.wLow}-{entreno.wHigh}W</div>
              <div className="text-xs text-[#9ca3af]">Vatios</div>
            </div>
          </div>
        )}
        {decision.notaHidratacion && (
          <div className="mt-3 text-sm text-[#60a5fa]">{decision.notaHidratacion}</div>
        )}
      </div>

      {/* CLIMA */}
      {weather && (
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <span className="text-2xl">{typeof weather.temp === 'number' ? (weather.temp > 35 ? '🔥' : weather.temp > 30 ? '🌡️' : weather.temp > 25 ? '☀️' : '✅') : '🌤️'}</span>
            <span>{weather.temp || 'N/D'}°C</span>
            <span className="text-[#9ca3af]">💨 {weather.wind || 0} km/h</span>
            <span className="text-[#9ca3af]">🌧️ {weather.rain || 0} mm</span>
            <span className="text-[#9ca3af]">{weather.description || ''}</span>
          </div>
        </div>
      )}

      {/* ACTIVIDAD DE HOY */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-[#9ca3af]">📅 Actividad de hoy</h3>
        </div>
        {activities.length > 0 ? (
          <div className="flex items-center gap-4 p-3 bg-[#0a0e17] rounded-lg border-l-4 border-[#34d399]">
            <span className="text-xl">🚴</span>
            <div className="flex-1">
              <div className="font-medium">{activities[0].name || 'Ciclismo'}</div>
              <div className="text-sm text-[#9ca3af]">
                {(activities[0].distance / 1000).toFixed(1)} km · {Math.round(activities[0].moving_time / 60)} min
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-[#fbbf24]">{Math.round(activities[0].icu_training_load || 0)} TSS</div>
              <div className="text-sm text-[#9ca3af]">{Math.round(activities[0].icu_weighted_avg_watts || 0)}W</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-[#4b5563] text-sm">No has entrenado todavía hoy</div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-8 text-center text-xs text-[#4b5563] border-t border-[#1a2233] pt-4">
        World Tour Coach v10.1 · Conectado al backend
      </div>
    </div>
  );
}

export default App;