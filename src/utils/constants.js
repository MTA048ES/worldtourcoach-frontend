export const API_URL = import.meta.env.VITE_API_URL || 'https://worldtourcoach-backend-production-c14a.up.railway.app';

export const COLORS = {
  primary: '#60a5fa',
  secondary: '#a78bfa',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#ef4444',
  surface: '#111827',
  surfaceAlt: '#0a0e17',
  border: '#1a2233',
  borderHover: '#2a3a5a',
  text: '#e8edf5',
  textMuted: '#9ca3af',
  textDim: '#6b7a9f',
  textDark: '#4b5563',
};

export const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'actividades', label: 'Actividades' },
  { id: 'progreso', label: 'Progreso' },
  { id: 'entrenos', label: 'Entrenos' },
  { id: 'config', label: 'Configuración' },
];

export const DEFAULT_FTP = 240;
export const DEFAULT_OBJETIVO = 296;
export const DEFAULT_WEIGHT = 64;
export const DEFAULT_AGE = 43;