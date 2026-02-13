import {
  FiFolder,
  FiLogOut,
  FiUsers,
  FiBarChart2,
  FiCheckSquare,
  FiClipboard,
} from "react-icons/fi";

/* USER MENU */
export const userMenu = [
  { label: "My Tasks", to: "/", icon: FiCheckSquare },
  { label: "My Projects", to: "/my-projects", icon: FiClipboard },
  { label: "logout", to: '/logout', icon: FiLogOut, bottom: true }
];

/* ADMIN MENU */
export const adminMenu = [
  { label: "Users", to: "/users", icon: FiUsers },
  { label: "Projects", to: "/projects", icon: FiFolder },
  { label: "Progress", to: "/progress", icon: FiBarChart2 },
  { label: "logout", to: '/logout', icon: FiLogOut, bottom: true }
];