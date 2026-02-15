import { useEffect, useState } from "react";
import api from "../../api/axios";

import ProgressKPI from "../../components/progress/ProgressKPI";
import ProjectProgressTable from "../../components/progress/ProjectProgressTable";
import ActivityStatusChart from "../../components/progress/ActivityStatusChart";
import UserProgressTable from "../../components/progress/UserProgressTable";
import ProgressFilters from "../../components/progress/ProgressFilters";
import useDebounce from "../../hooks/useDebounce";

const Progress = () => {
  const [data, setData] = useState(null);

  const [filters, setFilters] = useState({
    project: "",
    user: "",
    from: "",
    to: "",
  });

  const debouncedFilters = useDebounce(filters, 400);

  const fetchProgress = async () => {
    const res = await api.get("/admin/progress", {
      params: debouncedFilters,
    });
    setData(res.data);
  };

  useEffect(() => {
    fetchProgress();
  }, [debouncedFilters]);

  const handleExport = () => {
    if (!data?.projects?.length) return;

    const headers = [
      "Project Name",
      "Status",
      "Total Activities",
      "Completed Activities",
      "Progress (%)",
    ];

    const rows = data.projects.map((p) => [
      p.name,
      p.status,
      p.total_activities,
      p.completed_activities,
      `${p.progress}%`,
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "project-progress.csv";
    a.click();
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading progress…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Progress Overview
        </h1>
        <p className="text-sm text-gray-500">
          Detailed tracking of projects, activities, and users
        </p>
      </div>

      <ProgressKPI projects={data.projects} />

      <ProgressFilters
        filters={filters}
        setFilters={setFilters}
        onExport={handleExport}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ActivityStatusChart data={data.activityStatus} />
        <UserProgressTable users={data.users} />
      </div>

      <div className="flex-1 min-h-0">
        <ProjectProgressTable projects={data.projects} />
      </div>
    </div>
  );
};

export default Progress;
