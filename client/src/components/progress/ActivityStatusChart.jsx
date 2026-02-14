import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = {
  todo: "#CBD5E1",
  in_progress: "#FBBF24",
  review: "#60A5FA",
  done: "#22C55E",
};

const ActivityStatusChart = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col h-[360px]">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Activity Status Distribution
      </h3>

      {/* IMPORTANT: height must be fixed */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              outerRadius={90}
              label
            >
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={COLORS[entry.status]}
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

export default ActivityStatusChart;
