import { useEffect, useState } from "react";
import api from "../../api/axios";

import KpiCards from "../../components/dashboard/KpiCards";
import ActivityStatusChart from "../../components/dashboard/ActivityStatusChart";
import ProjectStatusChart from "../../components/dashboard/ProjectStatusChart";
import ProjectGrowthChart from "../../components/dashboard/ProjectGrowthChart";
import RecentActivity from "../../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="p-6">Loading dashboard…</div>;

  return (
    <div className="p-6 bg-[#F6F8FB] min-h-screen space-y-6">
      <KpiCards kpis={data.kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityStatusChart data={data.charts.activityStatus} />
        <ProjectStatusChart data={data.charts.projectStatus} />
        <ProjectGrowthChart data={data.charts.projectGrowth} />
      </div>

      <RecentActivity activities={data.recentActivities} />
    </div>
  );
}
