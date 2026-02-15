import { useState, useMemo } from "react";
import StatusPill from "../common/StatusPill";
// const statusColor = {
//   pending: "bg-gray-100 text-gray-700",
//   active: "bg-blue-100 text-blue-700",
//   completed: "bg-green-100 text-green-700",
// };

const PAGE_SIZE = 8;

const ProjectProgressTable = ({ projects = [] }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(projects.length / PAGE_SIZE)
  );

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return projects.slice(start, start + PAGE_SIZE);
  }, [projects, page]);

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-[520px]">
      {/* HEADER */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">
          Project Progress
        </h3>

        <span className="text-xs text-gray-400">
          {projects.length} projects
        </span>
      </div>

      {/* TABLE SCROLL AREA */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-100">
            <tr className="text-gray-500">
              <th className="text-left px-5 py-3">Project</th>
              <th className="text-center px-5 py-3">Status</th>
              <th className="px-5 py-3">Progress</th>
              <th className="text-center px-5 py-3">Completed</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedProjects.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-14 text-gray-400"
                >
                  No projects found
                </td>
              </tr>
            )}

            {paginatedProjects.map((p) => {
              const progress = Number(p.progress) || 0;

              return (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {p.name}
                  </td>

                  <td className="text-center px-5">
                     <StatusPill status={p.status} />
                  </td>

                  <td className="px-5 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                      {progress}%
                    </p>
                  </td>

                  <td className="text-center px-5 py-3 text-gray-700">
                    {p.completed_activities}/{p.total_activities}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION (ALWAYS VISIBLE) */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-xs rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-xs rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressTable;
