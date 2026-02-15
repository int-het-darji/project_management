import { NavLink } from "react-router-dom";
import { FiLayers } from "react-icons/fi";
import SidebarItem from "./SidebarItem";

export default function Sidebar({ links }) {
  if (!links) return null;

  return (
    <aside className="w-64 h-screen bg-white flex flex-col justify-between px-4 py-6 shadow-lg">
      
      {/* TOP */}
      <div>
        {/* LOGO */}
        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-3 mb-10 px-2 hover:opacity-90 transition"
        >
          <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <FiLayers size={20} />
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-gray-900">
              PMS
            </h1>
            <p className="text-xs text-gray-500">
              Project Management
            </p>
          </div>
        </NavLink>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          {links
            .filter((l) => !l.bottom)
            .map((link) => (
              <SidebarItem
                key={link.label}
                to={link.to}
                icon={link.icon}
                label={link.label}
              />
            ))}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col gap-2 pt-6 border-t border-gray-200">
        {links
          .filter((l) => l.bottom)
          .map((link) => (
            <SidebarItem
              key={link.label}
              to={link.to}
              icon={link.icon}
              label={link.label}
            />
          ))}
      </div>
    </aside>
  );
}
