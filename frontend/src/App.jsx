import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LanguageProvider from './providers/LanguageProvider'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Appointments from './pages/Appointments'
import AppointmentConfirmation from './pages/AppointmentConfirmation'
import Contact from './pages/Contact'
import PatientPortal from './pages/PatientPortal'
import './App.css'
import './styles/rtl.css'
import { isRTL } from './utils/rtl'
import i18n from './i18n/i18n'
import AdminRoute from './components/AdminRoute'
import AdminRegistration from './components/AdminRegistration'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'
import AdminErrorBoundary from './components/AdminErrorBoundary'
import AppointmentList from "./components/AppointmentList";
import { I18nextProvider } from "react-i18next";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <LanguageProvider>
              <div className="app">
                <Navbar />
                <main>
                  <Routes>
                    <Route
                      path="/admin/*"
                      element={
                        <AdminErrorBoundary>
                          <Routes>
                            <Route path="login" element={<AdminLogin />} />
                            <Route element={<AdminRoute />}>
                              <Route
                                path="dashboard"
                                element={<AdminDashboard />}
                              />
                              <Route
                                path="register"
                                element={<AdminRegistration />}
                              />
                            </Route>
                          </Routes>
                        </AdminErrorBoundary>
                      }
                    />
                    <Route path="/" element={<Home />} />
                    <Route path="/:lang" element={<Home />} />
                    <Route path="/:lang/about" element={<About />} />
                    <Route path="/:lang/services" element={<Services />} />
                    <Route
                      path="/:lang/appointments"
                      element={<Appointments />}
                    />
                    <Route
                      path="/:lang/appointments/confirmation"
                      element={<AppointmentConfirmation />}
                    />
                    <Route path="/:lang/contact" element={<Contact />} />
                    <Route
                      path="/:lang/patient-portal"
                      element={<PatientPortal />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
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
            </LanguageProvider>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </I18nextProvider>
  );
}

export default App
