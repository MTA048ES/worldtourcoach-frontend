import { Bike, LayoutDashboard, Bike as BikeIcon, BarChart3, CalendarDays, Settings, Zap, Bell } from 'lucide-react';

const sidebarTabs = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { id: 'entrenos', icon: BikeIcon, label: 'Entrenamientos', badge: null },
  { id: 'actividades', icon: BarChart3, label: 'Actividades', badge: null },
  { id: 'progreso', icon: Zap, label: 'Progreso', badge: null },
  { id: 'calendario', icon: CalendarDays, label: 'Calendario', badge: null },
  { id: 'config', icon: Settings, label: 'Configuración', badge: null },
];

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, unreadCount = 0 }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0f1624] border-r border-[#1a2233] z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        shadow-2xl shadow-[#0a0e17]
        flex flex-col
      `}>
        {/* Logo area */}
        <div className="p-5 border-b border-[#1a2233]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#3b82f6]/30">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">World Tour Coach</h2>
              <p className="text-[9px] text-[#6b7a9f] tracking-wider mt-0.5">v10.2 · SSOT</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] text-[#4b5563] uppercase tracking-widest px-3 mb-3 font-semibold">Menú</p>
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-gradient-to-r from-[#1a2a4a] to-transparent text-[#60a5fa]'
                    : 'text-[#6b7a9f] hover:bg-[#1a2233] hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.badge && (
                  <span className="ml-auto bg-[#60a5fa] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 rounded-full bg-gradient-to-b from-[#60a5fa] to-[#a78bfa]" />
                )}
                {tab.id === 'actividades' && unreadCount > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-[#ef4444] text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick actions */}
          <div className="mt-6 pt-4 border-t border-[#1a2233]">
            <p className="text-[9px] text-[#4b5563] uppercase tracking-widest px-3 mb-3 font-semibold">Acciones rápidas</p>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#6b7a9f] hover:bg-[#1a2233] hover:text-white transition-all duration-200">
              <Bell className="w-4 h-4" />
              <span className="text-sm">Notificaciones</span>
              <span className="ml-auto bg-[#ef4444] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                3
              </span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1a2233]">
          <div className="bg-gradient-to-r from-[#0a0e17] to-[#111827] rounded-xl p-3 border border-[#1a2233]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="text-[10px] text-[#34d399] font-medium">Sistema operativo</span>
            </div>
            <p className="text-[9px] text-[#4b5563] font-mono">generateWorkout() · SSOT</p>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex-1 h-1 bg-[#1a2233] rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-[#34d399] to-[#60a5fa] rounded-full" />
              </div>
              <span className="text-[8px] text-[#4b5563]">CPU 75%</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;