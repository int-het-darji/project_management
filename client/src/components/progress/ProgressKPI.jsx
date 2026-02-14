const ProgressKPI = ({ projects }) => {
  const total = projects.length;
  const completed = projects.filter(p => p.progress === 100).length;
  const onTrack = projects.filter(p => p.progress >= 60).length;

  const avgProgress =
    total === 0
      ? 0
      : Math.round(
          projects.reduce((acc, p) => acc + (p.progress || 0), 0) / total
        );

  const cards = [
    { label: "Total Projects", value: total },
    { label: "Completed Projects", value: completed },
    { label: "On-Track Projects", value: onTrack },
    { label: "Average Progress", value: `${avgProgress}%` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white p-4 rounded-xl shadow-sm border"
        >
          <p className="text-xs text-gray-500">{c.label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProgressKPI;
