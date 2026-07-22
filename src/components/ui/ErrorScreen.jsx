import { XCircle, RefreshCw } from 'lucide-react';

const ErrorScreen = ({ error, onRetry }) => (
  <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center p-4">
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-[#0a0e17]">
      <XCircle className="w-12 h-12 text-[#ef4444] mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white text-center mb-2">Error de conexión</h2>
      <p className="text-[#9ca3af] text-sm text-center mb-4">No se pudo conectar con el backend.</p>
      <div className="bg-[#0a0e17] rounded-lg p-3 mb-4">
        <p className="text-[#6b7a9f] text-xs font-mono break-all">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#3b82f6]/20 hover:shadow-[#3b82f6]/40"
      >
        <RefreshCw className="w-4 h-4" />
        Reintentar
      </button>
    </div>
  </div>
);

export default ErrorScreen;