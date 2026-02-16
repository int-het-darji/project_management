import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { adminMenu, userMenu } from "../conifg/menu.config";

export default function MainLayout() {

  // simulate login user
  // const user = { role: "admin" };
  const user = localStorage.getItem('role')
  const links = user == "admin" ? adminMenu : userMenu;
  console.log(user)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar links={links} />

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}