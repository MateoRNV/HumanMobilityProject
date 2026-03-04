import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./ui/Spinner/Spinner";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { profesional, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!profesional) return <Navigate to="/login" replace />;
  if (adminOnly && profesional.rol !== "admin") return <Navigate to="/menu" replace />;
  return children;
}
