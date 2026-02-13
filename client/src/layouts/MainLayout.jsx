import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { adminMenu, userMenu } from "../conifg/menu.config";

export default function MainLayout() {

  // simulate login user
  const user = { role: "admin" };

  const links = user.role === "admin" ? adminMenu : userMenu;

  return (
    <div className="flex">
      <Sidebar links={links} />

      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}
