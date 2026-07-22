import { Bike } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
    <div className="text-center animate-fade-in-up">
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 border-4 border-[#1a2233] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#60a5fa] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bike className="w-6 h-6 text-[#60a5fa]" />
        </div>
      </div>
      <p className="mt-4 text-[#9ca3af] font-medium">Cargando World Tour Coach</p>
      <p className="text-xs text-[#4b5563] mt-1">Conectando con el motor de decisión</p>
    </div>
  </div>
);

export default LoadingScreen;