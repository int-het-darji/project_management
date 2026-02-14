import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Users from "../pages/Users";
import Project from "../pages/project";
import ProjectDetail from "../pages/projectDetail";
import ActivityDetail from "../pages/ActivityDetail";
import Profile from "../pages/Profile";

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
          <ProtectedRoute role="admin">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/projects" element={<Project/>} />
          <Route path="/admin/projects/:id" element={<ProjectDetail />} />
          <Route path="admin/projects/activity/:id" element={<ActivityDetail />} />
      </Route>


      {/* for User*/}

      <Route
  element={
    <ProtectedRoute role="user">
      <MainLayout />
    </ProtectedRoute>
  }
>
  {/* <Route path="/user/profile" element={<UserDashboard />} /> */}
  <Route path="/user/my-projects" element={<Project />} />
  <Route path="/user/projects/:id" element={<ProjectDetail />} />
  <Route path="/user/profile" element={<Profile />} />
  <Route path="user/projects/activity/:id" element={<ActivityDetail />} />
</Route>

    </Routes>
  );
}
