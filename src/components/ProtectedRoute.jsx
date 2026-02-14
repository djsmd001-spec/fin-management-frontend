import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  // Role check only if role prop passed
  if (role && user.role !== role) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}
