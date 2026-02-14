import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // not logged in
  if (!token) return <Navigate to="/login" replace />;

  // role based restriction
  if (role && role !== userRole) {
    // redirect based on actual role
    if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (userRole === "user") return <Navigate to="/user/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
