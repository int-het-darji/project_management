import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/sidebar/Sidebar";
import Project from "../pages/project";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Sidebar />} /> */}
        {/* <Route path="/" element={<Sidebar />} /> */}
        <Route path="/users" element={<Project />} />
        <Route path="/projects" element={<Project />} />
      </Route>
    </Routes>
  );
}
