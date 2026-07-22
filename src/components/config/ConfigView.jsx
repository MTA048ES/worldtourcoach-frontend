import { Settings } from 'lucide-react';

const ConfigView = ({ data }) => (
  <div className="max-w-7xl mx-auto animate-fade-in-up">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <Settings className="w-6 h-6 text-[#60a5fa]" />
      Configuración
    </h2>
    <div className="bg-[#111827] border border-[#1a2233] rounded-2xl p-5">
      <div className="space-y-4">
        <div className="flex justify-between py-2 border-b border-[#1a2233]">
          <span className="text-[#6b7a9f]">FTP</span>
          <span className="font-medium">{data?.config?.ftp || 240}W</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1a2233]">
          <span className="text-[#6b7a9f]">Peso</span>
          <span className="font-medium">{data?.config?.weight || 64} kg</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1a2233]">
          <span className="text-[#6b7a9f]">Edad</span>
          <span className="font-medium">{data?.config?.age || 43} años</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1a2233]">
          <span className="text-[#6b7a9f]">Objetivo</span>
          <span className="font-medium text-[#fbbf24]">{data?.config?.objetivo || 296}W</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[#6b7a9f]">Motor de decisión</span>
          <span className="font-medium text-[#34d399]">✅ Single Source of Truth</span>
        </div>
      </div>
    </div>
  </div>
);

export default ConfigView;