import {
  FiFolder,
  FiLogOut,
  FiUsers,
  FiBarChart2,
  FiClipboard,
  FiUser,
} from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";

/* USER MENU */
export const userMenu = [
  { label: "Profile", to: "/user/profile", icon: FiUser },
  { label: "My Projects", to: "/user/my-projects", icon: FiClipboard },
  { label: "logout", to: '/logout', icon: FiLogOut, bottom: true }
];

/* ADMIN MENU */
export const adminMenu = [
  { label: "Dashboard", to: "/admin/dashboard", icon: RiDashboardFill },
  { label: "Users", to: "/admin/users", icon: FiUsers },
  { label: "Projects", to: "/admin/projects", icon: FiFolder },
  { label: "Progress", to: "/admin/progress", icon: FiBarChart2 },
  { label: "logout", to: '/logout', icon: FiLogOut, bottom: true }
];