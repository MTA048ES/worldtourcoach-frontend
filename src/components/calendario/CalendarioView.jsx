import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Bike, Activity, Zap, Clock, TrendingUp } from 'lucide-react';

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const CalendarioView = ({ data }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  // Get real activities from backend
  const activities = data?.datos?.activities || [];

  // Group activities by day of month
  const activitiesByDay = useMemo(() => {
    const map = {};
    activities.forEach(act => {
      const d = new Date(act.start_date_local);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(act);
      }
    });
    return map;
  }, [activities, currentMonth, currentYear]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else { setCurrentMonth(currentMonth - 1); }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else { setCurrentMonth(currentMonth + 1); }
    setSelectedDay(null);
  };

  const isToday = (day) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  // Build calendar grid
  const calendarDays = [];
  for (let i = 0; i < startOffset; i++) {
    calendarDays.push({ day: daysInPrevMonth - startOffset + i + 1, otherMonth: true });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, otherMonth: false, activities: activitiesByDay[day] || [] });
  }
  while (calendarDays.length % 7 !== 0) {
    const nextDay = calendarDays.length - startOffset - daysInMonth + 1;
    calendarDays.push({ day: nextDay, otherMonth: true });
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const selectedActivities = selectedDay ? activitiesByDay[selectedDay] || [] : [];
  const monthTss = Object.values(activitiesByDay).flat().reduce((sum, a) => sum + (a.icu_training_load || 0), 0);
  const monthCount = Object.values(activitiesByDay).flat().length;

  const getActivityColor = (type) => {
    const colors = { Ride: '#60a5fa', VirtualRide: '#60a5fa', Run: '#34d399', Workout: '#fbbf24' };
    return colors[type] || '#9ca3af';
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#60a5fa]" />
            Calendario
          </h2>
          <p className="text-xs text-[#6b7a9f] mt-1">{monthCount} actividades este mes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1a2233] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="btn-icon"><ChevronLeft className="w-5 h-5 text-[#6b7a9f]" /></button>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">{monthNames[currentMonth]} {currentYear}</h3>
              <p className="text-[10px] text-[#6b7a9f]">{monthCount} actividades</p>
            </div>
            <button onClick={nextMonth} className="btn-icon"><ChevronRight className="w-5 h-5 text-[#6b7a9f]" /></button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {dayNames.map(name => (
              <div key={name} className="text-center text-[10px] text-[#4b5563] font-semibold uppercase py-1">{name}</div>
            ))}
          </div>

          <div className="space-y-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((cell, ci) => {
                  const hasActs = cell.activities.length > 0 && !cell.otherMonth;
                  return (
                    <button key={ci} onClick={() => !cell.otherMonth && setSelectedDay(cell.day)}
                      className={`cal-day ${cell.otherMonth ? 'other' : ''} ${isToday(cell.day) ? 'today' : ''} ${selectedDay === cell.day && !cell.otherMonth ? 'selected' : ''} ${hasActs ? 'has-activity' : ''}`}>
                      {cell.day}
                      {hasActs && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {cell.activities.slice(0, 3).map((a, i) => (
                            <span key={i} className="w-1 h-1 rounded-full" style={{ background: getActivityColor(a.type) }} />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected day details */}
        <div className="bg-[#111827] border border-[#1a2233] rounded-2xl p-5">
          {selectedDay ? (
            <div className="animate-fade-in">
              <h3 className="text-sm font-semibold text-[#9ca3af] mb-1">{selectedDay} de {monthNames[currentMonth]}</h3>
              <p className="text-[10px] text-[#4b5563] mb-4">{selectedActivities.length} actividades</p>

              {selectedActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-[#4b5563]">
                  <CalendarDays className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-xs">Sin actividades</p>
                  <p className="text-[9px] mt-1">Día de descanso</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedActivities.map((act, idx) => {
                    const d = new Date(act.start_date_local);
                    const tss = Math.round(act.icu_training_load || 0);
                    const dist = act.distance ? (act.distance / 1000).toFixed(1) : '0';
                    const dur = act.moving_time ? Math.round(act.moving_time / 60) : 0;
                    const color = getActivityColor(act.type);
                    return (
                      <div key={idx} className="rounded-xl border border-[#1a2233] p-3 bg-[#0a0e17]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                            <Bike className="w-4 h-4" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{act.name || 'Ciclismo'}</p>
                            <p className="text-[9px] text-[#6b7a9f]">{d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <span className="text-sm font-bold" style={{ color }}>{tss} TSS</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-[#6b7a9f]">
                          <span>{dist} km</span>
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {dur} min</span>
                          <span>{Math.round(act.icu_weighted_avg_watts || 0)}W</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#4b5563] py-8">
              <CalendarDays className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Selecciona un día</p>
              <p className="text-[10px] mt-1">Para ver las actividades</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#1a2233]">
            <h4 className="text-[10px] text-[#6b7a9f] uppercase tracking-wider mb-3 font-semibold">Resumen mensual</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span className="text-[#6b7a9f]">Total actividades</span><span className="font-medium text-white">{monthCount}</span></div>
              <div className="flex justify-between text-xs"><span className="text-[#6b7a9f]">TSS total</span><span className="font-medium text-[#fbbf24]">{Math.round(monthTss)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-[#6b7a9f]">Días con actividad</span><span className="font-medium text-[#34d399]">{Object.keys(activitiesByDay).length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioView;