import { useState } from 'react';
import { useAthleteState } from './hooks/useAthleteState';
import LoadingScreen from './components/ui/LoadingScreen';
import ErrorScreen from './components/ui/ErrorScreen';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DashboardView from './components/dashboard/DashboardView';
import ActividadesView from './components/actividades/ActividadesView';
import ProgresoView from './components/progreso/ProgresoView';
import EntrenosView from './components/entrenos/EntrenosView';
import ConfigView from './components/config/ConfigView';
import CalendarioView from './components/calendario/CalendarioView';
import ActivityModal from './components/modals/ActivityModal';
import './index.css';

export default function App() {
  const { data, loading, error, refetch } = useAthleteState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={refetch} />;
  if (!data) return <ErrorScreen error="No se recibieron datos" onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8edf5] font-['Inter'] antialiased overflow-x-hidden">
      <Header onRefresh={refetch} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

      <main className={`transition-all duration-300 ease-in-out ${isMenuOpen ? 'lg:ml-64' : ''} px-3 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6`}>
        {activeTab === 'dashboard' && (
          <DashboardView
            data={data}
            onSelectActivity={(act) => {
              setSelectedActivity(act);
              setIsModalOpen(true);
            }}
          />
        )}
        {activeTab === 'actividades' && (
          <ActividadesView
            activities={data?.datos?.activities || []}
            onSelectActivity={(act) => {
              setSelectedActivity(act);
              setIsModalOpen(true);
            }}
          />
        )}
        {activeTab === 'progreso' && <ProgresoView data={data} />}
        {activeTab === 'entrenos' && <EntrenosView data={data} />}
        {activeTab === 'calendario' && <CalendarioView data={data} />}
        {activeTab === 'config' && <ConfigView data={data} />}
      </main>

      {isModalOpen && selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedActivity(null);
          }}
        />
      )}
    </div>
  );
}