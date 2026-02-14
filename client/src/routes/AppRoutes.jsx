import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/admin/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Users from "../pages/Users";
import Project from "../pages/project";
import Logout from "../pages/Logout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* Logout Route */}
      <Route path="/logout" element={<Logout />} />

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/projects" element={<Project />} />
      </Route>
    </Routes>
  );
}
