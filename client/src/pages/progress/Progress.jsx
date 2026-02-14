import { useEffect, useState } from "react";
import api from "../../api/axios";

import ProgressKPI from "../../components/progress/ProgressKPI";
import ProjectProgressTable from "../../components/progress/ProjectProgressTable";
import ActivityStatusChart from "../../components/progress/ActivityStatusChart";
import UserProgressTable from "../../components/progress/UserProgressTable";

const Progress = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/progress").then((res) => {
      console.log("PROGRESS API 👉", res.data);
      setData(res.data);
    });
  }, []);

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Loading progress…
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 bg-[#F6F8FB] overflow-hidden">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Progress Overview
        </h1>
        <p className="text-sm text-gray-500">
          Detailed tracking of projects, activities, and users
        </p>
      </div>

      {/* KPI */}
      <ProgressKPI projects={data.projects} />

      {/* CHART + USERS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ActivityStatusChart data={data.activityStatus} />
        <UserProgressTable users={data.users} />
      </div>

      {/* PROJECT TABLE */}
      <ProjectProgressTable projects={data.projects} />
    </div>
  );
};

export default Progress;
