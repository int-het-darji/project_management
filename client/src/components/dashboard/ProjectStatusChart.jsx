import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  pending: "#F59E0B",
  active: "#6366F1",
  completed: "#22C55E",
};

const ProjectStatusChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="text-sm font-medium mb-3">Project Status</h3>
        <p className="text-sm text-gray-500">No project data</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-sm font-medium mb-3">Project Status</h3>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name] || "#CBD5E1"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectStatusChart;
