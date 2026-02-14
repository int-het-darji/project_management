const statusColor = {
  pending: "bg-gray-100 text-gray-700",
  active: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const ProjectProgressTable = ({ projects = [] }) => {
  if (!projects.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-sm text-gray-500">
        No projects found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-[420px]">
      {/* HEADER */}
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-800">
          Project Progress
        </h3>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 text-gray-500 z-10">
            <tr>
              <th className="text-left px-4 py-3">Project</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Completed</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {p.name}
                </td>

                <td className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="px-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${p.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {p.progress || 0}%
                  </p>
                </td>

                <td className="text-center">
                  {p.completed_activities}/{p.total_activities}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectProgressTable;
