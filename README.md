# 🚴 World Tour Coach

Plataforma avanzada de monitorización y análisis para ciclismo, basada en el concepto **Single Source of Truth** — un único motor de decisión que consolida datos de entrenamiento, fatiga, forma, clima y más para generar el plan de entrenamiento óptimo cada día.

---

## ✨ Características

- **Dashboard en tiempo real** con métricas clave: TSB, CTL, ATL, Readiness, HRV
- **Plan de entrenamiento diario** generado por IA según el estado del atleta
- **Gráfico de evolución de carga** (últimos 14 días)
- **Clima en vivo** para ajustar la hidratación y el esfuerzo
- **Actividades recientes** con métricas detalladas (TSS, NP, AP, IF, VI)
- **Vista de progreso FTP** con barra de evolución
- **Sidebar responsive** con navegación por pestañas
- **Tema oscuro** con diseño moderno y animaciones suaves

---

## 🛠️ Tecnologías

| Tecnología | Versión |
|-----------|---------|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 |
| Recharts | 3 |
| Lucide React | 1 |

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── layout/          # Header, Sidebar
│   ├── dashboard/       # DashboardView, WidgetCard, PlanCard, etc.
│   ├── actividades/     # ActividadesView
│   ├── progreso/        # ProgresoView
│   ├── entrenos/        # EntrenosView
│   ├── config/          # ConfigView
│   ├── modals/          # ActivityModal
│   └── ui/              # LoadingScreen, ErrorScreen, MetricItem
├── hooks/               # useAthleteState (fetch con timeout)
├── utils/               # constants (API_URL, colores, defaults)
├── App.jsx              # Componente principal
├── main.jsx             # Punto de entrada
└── index.css            # Estilos globales Tailwind
```

---

## 🚀 Inicio rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://worldtourcoach-backend-production-c14a.up.railway.app
```

---

## 📡 API

El frontend consume el backend desplegado en Railway:

```
GET /api/estado
```

Devuelve el estado completo del atleta: métricas de carga, plan del día, clima, actividades, configuración y consejos.

---

## 🧠 Concepto: Single Source of Truth

World Tour Coach centraliza todas las variables del entrenamiento en un único motor de decisión:

1. **Carga aguda (ATL)** — fatiga de los últimos 7 días
2. **Carga crónica (CTL)** — forma de las últimas 6 semanas
3. **Balance (TSB)** — diferencia entre forma y fatiga
4. **Readiness** — preparación basada en HRV y sueño
5. **Clima** — temperatura, viento y lluvia
6. **Historial** — actividades recientes y tendencias

El motor genera: `generateWorkout(tipo, duración, intensidad, TSS, hidratación)`

---

## 📄 Licencia

Uso privado — Proyecto personal