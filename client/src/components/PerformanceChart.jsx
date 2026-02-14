import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const PerformanceChart = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-700">Performance</h2>
        <p className="text-xs text-gray-400">Monthly progress</p>
      </div>

      <LineChart width={520} height={240} data={data}>
        <CartesianGrid stroke="#eee" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="achieved"
          stroke="#FB7185"
          strokeWidth={3}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#6366F1"
          strokeWidth={3}
        />
      </LineChart>
    </div>
  );
};

export default PerformanceChart;
