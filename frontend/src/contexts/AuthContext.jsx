import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          console.log("Restored auth state:", { userData });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData, token) => {
    try {
      console.log("Login attempt with:", {
        userData,
        hasToken: !!token,
      });

      if (!userData.email || !userData.userId) {
        throw new Error("Missing required user data");
      }

      // Store token
      localStorage.setItem("token", token);

      // Store normalized user data
      const normalizedUserData = {
        userId: userData.userId,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
      };

      console.log("Storing auth data:", {
        user: normalizedUserData,
        tokenPrefix: token.substring(0, 20),
      });

      localStorage.setItem("user", JSON.stringify(normalizedUserData));
      setUser(normalizedUserData);

      return true;
    } catch (error) {
      console.error("Login error in context:", error);
      await logout();
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/patient-portal");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
