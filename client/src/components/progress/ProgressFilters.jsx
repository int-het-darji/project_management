import { FiDownload } from "react-icons/fi";
import api from "../../api/axios";

const ProgressFilters = ({ filters, setFilters }) => {
  const handleExport = async () => {
    try {
      const response = await api.get(
        "/admin/progress/export",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "project-progress.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("CSV export failed", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4 items-end">
      {/* PROJECT FILTER */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">
          Project
        </label>
        <input
          value={filters.project}
          onChange={(e) =>
            setFilters({ ...filters, project: e.target.value })
          }
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
          placeholder="Project name"
        />
      </div>

      {/* USER FILTER */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">
          User
        </label>
        <input
          value={filters.user}
          onChange={(e) =>
            setFilters({ ...filters, user: e.target.value })
          }
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
        />
      </div>

      {/* DATE FROM */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">
          From
        </label>
        <input
          type="date"
          value={filters.from}
          onChange={(e) =>
            setFilters({ ...filters, from: e.target.value })
          }
          className="px-3 py-2 text-sm rounded-lg border border-gray-200"
        />
      </div>

      {/* DATE TO */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">
          To
        </label>
        <input
          type="date"
          value={filters.to}
          onChange={(e) =>
            setFilters({ ...filters, to: e.target.value })
          }
          className="px-3 py-2 text-sm rounded-lg border border-gray-200"
        />
      </div>

      {/* EXPORT */}
      <button
        onClick={handleExport}
        className="ml-auto flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
      >
        <FiDownload />
        Export CSV
      </button>
    </div>
  );
};

export default ProgressFilters;
