import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  todo: "#6366F1",        
  in_progress: "#F59E0B", 
  done: "#22C55E",       
};

const ActivityStatusChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="text-sm font-medium mb-3">Activity Status</h3>
        <p className="text-sm text-gray-500">No activity data</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-sm font-medium mb-3">Activity Status</h3>

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

      <div className="flex justify-center gap-4 mt-4 text-xs">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[d.name] }}
            />
            {d.name.replace("_", " ")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityStatusChart;
