const UserProgressTable = ({ users }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800">
          User Workload Progress
        </h3>
      </div>

      {/* INTERNAL SCROLL */}
      <div className="max-h-[260px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 text-gray-500 z-10">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th>Projects</th>
              <th>Activities</th>
              <th>Completed</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((u) => {
              const progress =
                u.activities === 0
                  ? 0
                  : Math.round((u.completed / u.activities) * 100);

              return (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.username}</td>
                  <td className="text-center">{u.projects}</td>
                  <td className="text-center">{u.activities}</td>
                  <td className="text-center">{u.completed}</td>
                  <td className="px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {progress}%
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProgressTable;
