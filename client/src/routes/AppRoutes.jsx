import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/sidebar/Sidebar";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Sidebar />} /> */}
        {/* <Route path="/" element={<Sidebar />} /> */}
      </Route>
    </Routes>
  );
}
