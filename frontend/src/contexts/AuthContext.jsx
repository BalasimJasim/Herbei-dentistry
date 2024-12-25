import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session
    const storedUser = localStorage.getItem("admin");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("admin");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Demo admin credentials
    if (email === "admin@herbiedental.com" && password === "admin123") {
      const userData = { email, role: "admin" };
      localStorage.setItem("admin", JSON.stringify(userData));
      setUser(userData);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
