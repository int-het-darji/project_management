import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  todo: "#CBD5E1",
  in_progress: "#FBBF24",
  review: "#60A5FA",
  done: "#22C55E",
};

const ActivityStatusChart = ({ data = [] }) => {
  const chartData = data.map((d) => ({
    status: d.status,
    count: Number(d.count),
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-[360px]">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Activity Status
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            outerRadius={100}
            label
          >
            {chartData.map((e) => (
              <Cell
                key={e.status}
                fill={COLORS[e.status]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityStatusChart;
