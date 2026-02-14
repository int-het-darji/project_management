import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22C55E", "#6366F1", "#38BDF8", "#EF4444"];

const TasksChart = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-700">Tasks</h2>
        <p className="text-xs text-gray-400">Current status</p>
      </div>

      <div className="flex justify-center">
        <PieChart width={260} height={220}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default TasksChart;
