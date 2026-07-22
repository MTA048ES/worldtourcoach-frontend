import { useState, useMemo } from 'react';
import { List, Activity, Bike, ChevronRight, Search, Filter, Clock, Calendar, Zap, ArrowUpDown } from 'lucide-react';

const activityColors = {
  Ride: { bg: 'bg-[#1a2a4a]', text: 'text-[#60a5fa]', icon: Bike },
  VirtualRide: { bg: 'bg-[#1a2a4a]', text: 'text-[#60a5fa]', icon: Bike },
  Run: { bg: 'bg-[#1a2a1a]', text: 'text-[#34d399]', icon: Activity },
  Workout: { bg: 'bg-[#2a2a1a]', text: 'text-[#fbbf24]', icon: Zap },
  default: { bg: 'bg-[#1a2233]', text: 'text-[#9ca3af]', icon: Activity },
};

const ActividadesView = ({ activities, onSelectActivity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');

  const types = useMemo(() => {
    const typeSet = new Set(activities.map(a => a.type || 'Ride'));
    return ['all', ...Array.from(typeSet)];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(a => (a.type || 'Ride') === filterType);
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a =>
        (a.name || '').toLowerCase().includes(term) ||
        (a.type || '').toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.start_date_local || 0) - new Date(a.start_date_local || 0);
      }
      if (sortBy === 'tss') {
        return (b.icu_training_load || 0) - (a.icu_training_load || 0);
      }
      if (sortBy === 'distance') {
        return (b.distance || 0) - (a.distance || 0);
      }
      return 0;
    });

    return result;
  }, [activities, searchTerm, sortBy, filterType]);

  const getTssColor = (t) => {
    if (t >= 150) return 'text-[#ef4444]';
    if (t >= 100) return 'text-[#f97316]';
    if (t >= 50) return 'text-[#fbbf24]';
    return 'text-[#34d399]';
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <List className="w-6 h-6 text-[#60a5fa]" />
            Actividades
          </h2>
          <p className="text-xs text-[#6b7a9f] mt-1">{activities.length} actividades registradas</p>
        </div>
        <button className="btn-ghost text-xs flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Filtros
        </button>
      </div>

      {/* Search and filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[200px] flex items-center bg-[#1a2233] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#3b82f6] transition-all">
          <Search className="w-4 h-4 text-[#6b7a9f] mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar actividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm text-[#e8edf5] placeholder-[#4b5563] outline-none w-full"
          />
        </div>

        <div className="flex gap-1 bg-[#0a0e17] rounded-xl p-1">
          {types.slice(0, 4).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filterType === type
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-[#6b7a9f] hover:text-white hover:bg-[#1a2233]'
              }`}
            >
              {type === 'all' ? 'Todas' : type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-[#0a0e17] rounded-xl p-1">
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
              sortBy === 'date' ? 'bg-[#1a2233] text-white' : 'text-[#6b7a9f] hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3" />
            Fecha
          </button>
          <button
            onClick={() => setSortBy('tss')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
              sortBy === 'tss' ? 'bg-[#1a2233] text-white' : 'text-[#6b7a9f] hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3" />
            TSS
          </button>
        </div>
      </div>

      {/* Activities list */}
      <div className="bg-[#111827] border border-[#1a2233] rounded-2xl p-5">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 text-[#4b5563]">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No hay actividades</p>
            <p className="text-[10px] mt-1">
              {searchTerm ? 'Intenta con otros filtros' : 'Los entrenos aparecerán aquí'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredActivities.map((act, idx) => {
              const type = act.type || 'Ride';
              const style = activityColors[type] || activityColors.default;
              const Icon = style.icon;
              const date = new Date(act.start_date_local || Date.now());
              const tss = Math.round(act.icu_training_load || 0);

              return (
                <button
                  key={idx}
                  onClick={() => onSelectActivity(act)}
                  className="w-full bg-[#0a0e17] rounded-xl p-4 flex flex-wrap items-center gap-4 hover:bg-[#1a2233] transition-all duration-200 border border-transparent hover:border-[#1f2937] group"
                >
                  <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-[180px] text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{act.name || 'Ciclismo'}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${style.bg} ${style.text} font-medium`}>
                        {type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[#6b7a9f] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      {act.distance && (
                        <span className="text-[10px] text-[#6b7a9f]">
                          {(act.distance / 1000).toFixed(1)} km
                        </span>
                      )}
                      {act.moving_time && (
                        <span className="text-[10px] text-[#6b7a9f] flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {Math.round(act.moving_time / 60)} min
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-[#6b7a9f] text-[9px]">TSS</p>
                      <p className={`font-bold text-sm ${getTssColor(tss)}`}>{tss}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[#6b7a9f] text-[9px]">Potencia</p>
                      <p className="font-bold text-sm text-[#60a5fa]">{Math.round(act.icu_weighted_avg_watts || 0)}W</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#4b5563] group-hover:text-[#60a5fa] transition-colors" />
                </button>
              );
            })}
          </div>
        )}

        {/* Pagination info */}
        {filteredActivities.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#1a2233] flex justify-between text-[10px] text-[#4b5563]">
            <span>Mostrando {filteredActivities.length} de {activities.length} actividades</span>
            <span>Ordenado por: {sortBy === 'date' ? 'fecha' : sortBy === 'tss' ? 'TSS' : 'distancia'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActividadesView;