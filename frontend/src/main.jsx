import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/i18n'
import './index.css'
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
// Import component styles
import "./pages/PatientPortal.module.css";
import "./pages/Appointments.module.css";
import "./pages/Dashboard.module.css";
import "./pages/Home.module.css";
import "./pages/PortalDashboard.module.css";
import "./pages/Services.module.css";
import "./components/portal/AppointmentManagement.module.css";
import "./components/AppointmentForm.module.css";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
