import TrendIndicator from '../ui/TrendIndicator';

const WidgetCard = ({ label, value, color, icon: Icon, subtitle, detail, trend, progress }) => {
  const getGlowClass = () => {
    if (color === '#34d399') return 'glow-green';
    if (color === '#fbbf24') return 'glow-yellow';
    if (color === '#ef4444') return 'glow-red';
    return 'glow-blue';
  };

  return (
    <div className={`bg-[#111827] border border-[#1a2233] rounded-2xl p-5 hover:border-[#2a3a5a] transition-all duration-300 hover:shadow-2xl hover:shadow-[#0a0e17] group ${getGlowClass()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#1a2233] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex items-center gap-1">
          {trend !== undefined && <TrendIndicator value={trend} className="mt-0.5" />}
          <span className="text-[10px] text-[#4b5563] font-mono">{detail}</span>
        </div>
      </div>

      <p className="text-2xl font-bold tracking-tight mb-1" style={{ color }}>
        {value}
      </p>

      <div className="flex items-center justify-between">
        <p className="widget-label text-[#6b7a9f]">{label}</p>
        <span className="text-[11px] text-[#6b7a9f] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          {subtitle}
        </span>
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 bg-[#1a2233] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                background: `linear-gradient(90deg, ${color}88, ${color})`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetCard;