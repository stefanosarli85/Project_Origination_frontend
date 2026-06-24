import { Navigate } from "react-router-dom";
 
export function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
 
export function PublicRoute({ children }) {
  const user = localStorage.getItem("user");
  if (user) {
    return <Navigate to="/landing" replace />;
  }
  return children;
}