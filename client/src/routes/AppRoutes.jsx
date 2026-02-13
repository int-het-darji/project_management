import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/sidebar/Sidebar";
import Users from "../pages/Users";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Users />} />
        {/* <Route path="/" element={<Sidebar />} /> */}
      </Route>
    </Routes>
  );
}
