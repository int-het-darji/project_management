import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/admin/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Users from "../pages/Users";
import Project from "../pages/project";
import Logout from "../pages/Logout";
import ProjectDetail from "../pages/projectDetail";
import ActivityDetail from "../pages/ActivityDetail";
import Profile from "../pages/Profile";
import Progress from "../pages/progress/Progress";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC (Login at /) */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* LOGOUT */}
      <Route path="/logout" element={<Logout />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        element={
          <ProtectedRoute role="admin">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/projects" element={<Project />} />
        <Route path="/admin/projects/:id" element={<ProjectDetail />} />
        <Route
          path="/admin/projects/activity/:id"
          element={<ActivityDetail />}
        />
        <Route path="/admin/progress" element={<Progress />} />
      </Route>

      {/* ================= USER ROUTES ================= */}
      <Route
        element={
          <ProtectedRoute role="user">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/user/my-projects" element={<Project />} />
        <Route path="/user/projects/:id" element={<ProjectDetail />} />
        <Route
          path="/user/projects/activity/:id"
          element={<ActivityDetail />}
        />
        <Route path="/user/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
