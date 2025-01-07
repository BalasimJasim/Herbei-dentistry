import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageProvider from "./providers/LanguageProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import Contact from "./pages/Contact";
import PatientPortal from "./pages/PatientPortal";
import OralHygiene from "./pages/education/OralHygiene";
import DentalProcedures from "./pages/education/DentalProcedures";
import DentalImplants from "./pages/education/DentalImplants";
import AllOnXSolutions from "./pages/education/AllOnXSolutions";
import "./App.css";
import "./styles/rtl.css";
import { isRTL } from "./utils/rtl";
import i18n from "./i18n/i18n";
import AdminRoute from "./components/AdminRoute";
import AdminRegistration from "./components/AdminRegistration";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminErrorBoundary from "./components/AdminErrorBoundary";
import AppointmentList from "./components/AppointmentList";
import { I18nextProvider } from "react-i18next";
import AdminKeyboardShortcut from "./components/AdminKeyboardShortcut";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ProtectedRoute from "./components/ProtectedRoute";
import PortalDashboard from "./pages/PortalDashboard";

// Create a separate component for the app content
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location]);

  return (
    <div className={`app ${isLoading ? "loading" : ""}`}>
      <AdminKeyboardShortcut />
      <Navbar />
      <main>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/register" element={<AdminRegistration />} />
          </Route>

          <Route path="/patient-portal" element={<PatientPortal />} />
          <Route
            path="/portal-dashboard"
            element={
              <ProtectedRoute>
                <PortalDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to={`/${i18n.language}`} />} />

          <Route path="/:lang">
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="appointments">
              <Route index element={<Appointments />} />
              <Route
                path="confirmation"
                element={<AppointmentConfirmation />}
              />
            </Route>
            <Route path="contact" element={<Contact />} />
            <Route path="patient-portal" element={<PatientPortal />} />
            <Route
              path="portal-dashboard"
              element={
                <ProtectedRoute>
                  <PortalDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="education">
              <Route path="oral-hygiene" element={<OralHygiene />} />
              <Route path="procedures" element={<DentalProcedures />} />
              <Route path="implants" element={<DentalImplants />} />
              <Route path="all-on-x" element={<AllOnXSolutions />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={<Navigate to={`/${i18n.language}`} replace />}
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        rtl={isRTL(i18n.language)}
      />
      <AppointmentList />
    </div>
  );
};

// Main App component
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <LanguageProvider>
              <AppContent />
            </LanguageProvider>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </I18nextProvider>
  );
}

export default App;
