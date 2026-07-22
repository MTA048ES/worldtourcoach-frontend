import { Cloud, Wind, Droplet, AlertTriangle, Sun, Moon } from 'lucide-react';

const WeatherCard = ({ weather }) => {
  if (!weather) return (
    <div className="bg-[#111827] border border-[#1a2233] rounded-2xl p-5 flex flex-col items-center justify-center text-[#4b5563] h-full">
      <Cloud className="w-10 h-10 mb-2 opacity-30" />
      <span className="text-sm">Sin datos climáticos</span>
      <span className="text-[10px] mt-1">Esperando actualización...</span>
    </div>
  );

  const temp = weather.temp;
  const feelsLike = weather.feelsLike || temp;
  const isHot = typeof temp === 'number' && temp > 30;
  const isCold = typeof temp === 'number' && temp < 5;
  const emoji = typeof temp === 'number'
    ? temp > 35 ? '🔥' : temp > 30 ? '🌡️' : temp > 25 ? '☀️' : temp > 15 ? '🌤️' : temp > 5 ? '🌥️' : '❄️'
    : '🌤️';

  return (
    <div className="bg-[#111827] border border-[#1a2233] rounded-2xl p-5 hover:border-[#2a3a5a] transition-all h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#9ca3af] flex items-center gap-2">
          <Cloud className="w-4 h-4" />
          CLIMA
        </h3>
        <span className="text-[10px] text-[#4b5563]">En vivo</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-5xl">{emoji}</span>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{temp || 'N/D'}</span>
            <span className="text-lg text-[#6b7a9f]">°C</span>
          </div>
          <p className="text-xs text-[#6b7a9f] capitalize">{weather.description || ''}</p>
          {feelsLike !== temp && (
            <p className="text-[10px] text-[#4b5563]">Sensación térmica: {feelsLike}°C</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0a0e17] rounded-xl px-3 py-2.5 border border-[#1a2233]">
          <div className="flex items-center gap-2 text-[#6b7a9f] mb-1">
            <Wind className="w-3.5 h-3.5" />
            <span className="text-[10px]">Viento</span>
          </div>
          <p className="text-sm font-semibold text-white">{weather.wind || 0} km/h</p>
        </div>
        <div className="bg-[#0a0e17] rounded-xl px-3 py-2.5 border border-[#1a2233]">
          <div className="flex items-center gap-2 text-[#6b7a9f] mb-1">
            <Droplet className="w-3.5 h-3.5" />
            <span className="text-[10px]">Lluvia</span>
          </div>
          <p className="text-sm font-semibold text-white">{weather.rain || 0} mm</p>
        </div>
      </div>

      {weather.humidity && (
        <div className="mt-2 bg-[#0a0e17] rounded-xl px-3 py-2 border border-[#1a2233] flex items-center justify-between">
          <span className="text-[10px] text-[#6b7a9f]">Humedad</span>
          <span className="text-xs font-medium text-white">{weather.humidity}%</span>
        </div>
      )}

      {isHot && (
        <div className="mt-2 bg-[#1a2a1a] border border-[#2a4a2a] rounded-xl px-3 py-2 text-xs text-[#34d399] flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          Calor alto · Hidratación extra
        </div>
      )}
      {isCold && (
        <div className="mt-2 bg-[#1a1a2a] border border-[#2a2a4a] rounded-xl px-3 py-2 text-xs text-[#60a5fa] flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          Frío intenso · Capas adicionales
        </div>
      )}
    </div>
  );
};

export default WeatherCard;