import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute check:", {
    isAuthenticated: !!user,
    loading,
    path: location.pathname,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/patient-portal" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
