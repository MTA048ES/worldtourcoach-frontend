import { useState, useEffect } from 'react';
import { Bike, Search, Bell, ChevronDown, RefreshCw, Menu, X } from 'lucide-react';

const Header = ({ onRefresh, isMenuOpen, setIsMenuOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSearch, setShowSearch] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f1624]/95 backdrop-blur-xl border-b border-[#1a2233]">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden btn-icon"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#3b82f6]/30 group-hover:shadow-[#3b82f6]/50 transition-all duration-300 group-hover:scale-105">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gradient tracking-tight leading-none">
                WORLD TOUR COACH
              </h1>
              <p className="text-[9px] text-[#6b7a9f] tracking-widest mt-0.5">SINGLE SOURCE OF TRUTH</p>
            </div>
          </div>
        </div>

        {/* Center: Date/Time */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-[#9ca3af] font-medium capitalize">{formatDate(currentTime)}</p>
            <p className="text-[10px] text-[#6b7a9f] font-mono tracking-wider">{formatTime(currentTime)} · CET</p>
          </div>
          <div className="w-px h-8 bg-[#1a2233]" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            <span className="text-[10px] text-[#34d399] font-medium">Online</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <div className="hidden sm:flex items-center bg-[#1a2233] rounded-xl px-3 py-1.5 border border-transparent focus-within:border-[#3b82f6] transition-all">
            <Search className="w-3.5 h-3.5 text-[#6b7a9f] mr-2" />
            <input
              type="text"
              placeholder="Buscar actividades..."
              className="bg-transparent text-xs text-[#e8edf5] placeholder-[#4b5563] outline-none w-32 lg:w-48"
            />
          </div>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="sm:hidden btn-icon"
          >
            <Search className="w-4 h-4 text-[#6b7a9f]" />
          </button>

          {/* Refresh */}
          <button onClick={onRefresh} className="btn-icon group">
            <RefreshCw className="w-4 h-4 text-[#6b7a9f] group-hover:text-[#60a5fa] transition-colors group-hover:rotate-180 duration-500" />
          </button>

          {/* Notifications */}
          <button className="btn-icon relative">
            <Bell className="w-4 h-4 text-[#6b7a9f] hover:text-[#60a5fa] transition-colors" />
            {notifications > 0 && (
              <span className="notification-badge bg-[#ef4444] text-white">
                {notifications}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2 ml-1 pl-2 border-l border-[#1a2233] cursor-pointer hover:bg-[#1a2233] rounded-xl px-2 py-1 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-[#3b82f6]/20">
              MT
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-[#e8edf5] leading-none">MTA048</p>
              <p className="text-[9px] text-[#6b7a9f] mt-0.5">Atleta</p>
            </div>
            <ChevronDown className="w-3 h-3 text-[#6b7a9f] hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="sm:hidden px-4 pb-3 animate-fade-in">
          <div className="flex items-center bg-[#1a2233] rounded-xl px-3 py-2 border border-[#2a3a5a]">
            <Search className="w-4 h-4 text-[#6b7a9f] mr-2" />
            <input
              type="text"
              placeholder="Buscar actividades..."
              className="bg-transparent text-sm text-[#e8edf5] placeholder-[#4b5563] outline-none w-full"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;