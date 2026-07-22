import { LineChart as LineChartIcon } from 'lucide-react';

const ProgresoView = ({ data }) => {
  const ftp = data?.config?.ftp || 240;
  const objetivo = data?.config?.objetivo || 296;
  const progreso = Math.min(100, Math.round(((ftp - 200) / (objetivo - 200)) * 100));

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <LineChartIcon className="w-6 h-6 text-[#60a5fa]" />
        Progreso
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-[#1a2233] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Evolución FTP</h3>
          <div className="relative h-4 bg-[#1a2233] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, progreso)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-[#6b7a9f]">200W</span>
            <span className="font-bold text-[#60a5fa]">{ftp}W</span>
            <span className="text-[#6b7a9f]">{objetivo}W</span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-[#0a0e17] rounded-xl p-3 border border-[#1a2233]">
              <p className="text-2xl font-bold text-[#34d399]">{ftp}W</p>
              <p className="text-xs text-[#6b7a9f]">FTP Actual</p>
            </div>
            <div className="bg-[#0a0e17] rounded-xl p-3 border border-[#1a2233]">
              <p className="text-2xl font-bold text-[#fbbf24]">{objetivo}W</p>
              <p className="text-xs text-[#6b7a9f]">Objetivo</p>
            </div>
            <div className="bg-[#0a0e17] rounded-xl p-3 border border-[#1a2233]">
              <p className="text-2xl font-bold text-[#60a5fa]">{progreso}%</p>
              <p className="text-xs text-[#6b7a9f]">Progreso</p>
            </div>
          </div>
        </div>
        <div className="bg-[#111827] border border-[#1a2233] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Estadísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm py-2 border-b border-[#1a2233]">
              <span className="text-[#6b7a9f]">CTL</span>
              <span className="font-medium">{data?.estado?.ctl?.toFixed(1) || 0}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-[#1a2233]">
              <span className="text-[#6b7a9f]">ATL</span>
              <span className="font-medium">{data?.estado?.atl?.toFixed(1) || 0}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-[#1a2233]">
              <span className="text-[#6b7a9f]">TSB</span>
              <span className="font-medium">{data?.tsb?.toFixed(1) || 0}</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-[#6b7a9f]">Readiness</span>
              <span className="font-medium">{data?.readiness || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgresoView;