import { useState, useMemo } from 'react';
import { Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Area, Legend
} from 'recharts';

const RANGES = [
  { label: '7d', days: 7 },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="value" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(1)}
        </p>
      ))}
    </div>
  );
};

const PerformanceChart = ({ ctl, atl, tsb }) => {
  const [range, setRange] = useState('14d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const selectedRange = RANGES.find(r => r.label === range) || RANGES[1];

  const chartData = useMemo(() => {
    const days = selectedRange.days;
    const seed = (ctl || 50) * 100 + (atl || 50) * 10 + (tsb || 0);
    const pseudoRandom = (offset) => {
      const x = Math.sin(seed + offset * 1000) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: days }, (_, i) => {
      const dayIndex = days - 1 - i;
      return {
        dia: `D-${dayIndex}`,
        ctl: Math.max(10, (ctl || 50) - i * (70 / days) + (pseudoRandom(i) - 0.5) * 2),
        atl: Math.max(10, (atl || 50) - i * (50 / days) + (pseudoRandom(i) - 0.5) * 3),
        tsb: (tsb || 0) - i * (30 / days) + (pseudoRandom(i) - 0.5) * 1.5,
      };
    }).reverse();
  }, [ctl, atl, tsb, selectedRange.days]);

  const metrics = [
    { key: 'ctl', label: 'CTL', color: '#34d399', visible: selectedMetric === 'all' || selectedMetric === 'ctl' },
    { key: 'atl', label: 'ATL', color: '#ef4444', visible: selectedMetric === 'all' || selectedMetric === 'atl' },
    { key: 'tsb', label: 'TSB', color: '#fbbf24', visible: selectedMetric === 'all' || selectedMetric === 'tsb' },
  ];

  return (
    <div className="bg-[#111827] border border-[#1a2233] rounded-2xl p-4 hover:border-[#2a3a5a] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-xs font-semibold text-[#9ca3af] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            EVOLUCIÓN DE CARGA
          </h3>
          <p className="text-[9px] text-[#4b5563]">{selectedRange.days} días</p>
        </div>

        {/* Range selector */}
        <div className="flex gap-0.5 bg-[#0a0e17] rounded-lg p-0.5">
          {RANGES.map((r) => (
            <button key={r.label} onClick={() => setRange(r.label)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                range === r.label ? 'bg-[#3b82f6] text-white' : 'text-[#6b7a9f] hover:text-white'
              }`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric selector */}
      <div className="flex gap-2 mb-3">
        {metrics.map((m) => (
          <button key={m.key} onClick={() => setSelectedMetric(selectedMetric === m.key ? 'all' : m.key)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] transition-all ${
              m.visible ? 'bg-[#1a2233]' : 'opacity-50 hover:opacity-75'
            }`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
            <span className="text-[#9ca3af]">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2233" vertical={false} />
            <XAxis
              dataKey="dia"
              stroke="#4b5563"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={Math.max(1, Math.floor(chartData.length / 10))}
            />
            <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />

            {metrics.find(m => m.key === 'ctl')?.visible && (
              <Area
                type="monotone"
                dataKey="ctl"
                name="CTL"
                stroke="#34d399"
                fill="#34d399"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={false}
              />
            )}
            {metrics.find(m => m.key === 'atl')?.visible && (
              <Area
                type="monotone"
                dataKey="atl"
                name="ATL"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={false}
              />
            )}
            {metrics.find(m => m.key === 'tsb')?.visible && (
              <Line
                type="monotone"
                dataKey="tsb"
                name="TSB"
                stroke="#fbbf24"
                strokeWidth={2.5}
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 pt-2 border-t border-[#1a2233]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 rounded bg-[#34d399]" />
          <span className="text-[9px] text-[#6b7a9f]">CTL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 rounded bg-[#ef4444]" />
          <span className="text-[9px] text-[#6b7a9f]">ATL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-[#fbbf24]" />
          <span className="text-[9px] text-[#6b7a9f]">TSB</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
