import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/* STATUS COLORS (ENUM SAFE) */
const statusColor = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-amber-100 text-amber-700",
  review: "bg-indigo-100 text-indigo-700",
  done: "bg-green-100 text-green-700",
};

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex flex-col">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Recent Activity
      </h3>

      {/* EMPTY STATE */}
      {!activities || activities.length === 0 ? (
        <p className="text-sm text-gray-500">
          No recent activity found
        </p>
      ) : (
        /* SCROLLABLE FEED */
        <ul className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 hover:bg-gray-50 rounded-md px-1 transition"
            >
              {/* LEFT */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {activity.username} • {activity.project}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    statusColor[activity.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {activity.status.replace("_", " ")}
                </span>
                <span className="text-xs text-gray-400">
                  {dayjs(activity.created_at).fromNow()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
