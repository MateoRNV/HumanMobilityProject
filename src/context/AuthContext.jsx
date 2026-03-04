import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export function AuthProvider({ children }) {
  const [profesional, setProfesional] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => setProfesional(data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setProfesional(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  async function login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Credenciales inválidas");
    }
    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    setProfesional(data.profesional);
    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setProfesional(null);
  }

  return (
    <AuthContext.Provider value={{ profesional, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
