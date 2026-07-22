const CircularProgress = ({ value, max = 100, size = 80, strokeWidth = 6, color = '#60a5fa', label, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, max) / max) * circumference;

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="bg-circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        {children || (
          <>
            <span className="text-lg font-bold" style={{ color }}>{value}{max <= 1 ? '' : '%'}</span>
            {label && <span className="text-[8px] text-[#6b7a9f] mt-0.5">{label}</span>}
          </>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;