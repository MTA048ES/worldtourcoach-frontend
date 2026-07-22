import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [mensaje, setMensaje] = useState('Cargando...');

  useEffect(() => {
    console.log('✅ App montada correctamente');
    setMensaje('¡Hola Mundo! El Dashboard funciona.');
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white flex items-center justify-center p-8">
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-[#60a5fa] mb-4">🚴 WORLD TOUR COACH</h1>
        <p className="text-xl text-[#e8edf5]">{mensaje}</p>
        <p className="text-sm text-[#9ca3af] mt-4">Versión simplificada - Depuración</p>
      </div>
    </div>
  );
}

export default App;