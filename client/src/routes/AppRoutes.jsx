import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Users from "../pages/Users";
import Project from "../pages/project";
import ProjectDetail from "../pages/projectDetail";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
     <Route element={<AuthLayout />}>
<Route path="/login" element={<Login />} />
</Route>

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/users" element={<Users />} />
          <Route path="/projects" element={<Project/>} />
          <Route path="/projects/:id" element={<ProjectDetail />} />

      </Route>
    </Routes>
  );
}
