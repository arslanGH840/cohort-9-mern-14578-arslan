import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      let tokenWasSuperseded = false;

      try {
        const response = await axiosInstance.get("/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (localStorage.getItem("token") !== storedToken) {
          tokenWasSuperseded = true;
          return;
        }

        setUser(response.data.data.user);
        setToken(storedToken);
      } catch (error) {
        if (localStorage.getItem("token") === storedToken) {
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        } else {
          tokenWasSuperseded = true;
        }
      } finally {
        if (!tokenWasSuperseded) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem("token", authToken);
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
