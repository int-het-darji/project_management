export default function KpiCards({ kpis }) {
  const items = [
    ["Total Projects", kpis.totalProjects],
    ["Active Projects", kpis.activeProjects],
    ["Total Users", kpis.totalUsers],
    ["Total Activities", kpis.totalActivities],
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(([label, value]) => (
        <div key={label} className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
      ))}
    </div>
  );
}
