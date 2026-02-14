import SidebarItem from "./SidebarItem";

export default function Sidebar({ links }) {
  let date = new Date()

  const longDayName = date.toLocaleString('en-US', { weekday: 'long' });

  if(!links){
    return
  } 

  return (
    <aside className="w-64 h-screen shadow-2xl bg-white flex flex-col justify-between p-4">
      
      {/* TOP */}
      <div>
        <h1 className="text-2xl font-semibold mb-8">{longDayName}</h1>

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
      <div className="flex flex-col gap-2 pt-6 border-t">
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