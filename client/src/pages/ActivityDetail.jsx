import { useParams } from "react-router-dom";
import ActivityComments from "./ActivityComments";
import {
  FiFileText,
  FiClock,
  FiUser,
  FiHash,
  FiLayers,
  FiCheckCircle,
} from "react-icons/fi";
import ActivityTimeline from "./ActivityTimeline";

export default function ActivityDetail() {
  const { id } = useParams();

  const activity = {
    id,
    project_id: 12,
    title: "Design login page",
    description:
      "Created responsive login UI and added validation styling for errors and success states.",
    created_by: "Het Darji",
    created_at: "2026-02-14 10:30 AM",
    status: "todo",
  };

  const statusStyles = {
    todo: "bg-gray-100 text-gray-600",
    in_progress: "bg-blue-100 text-blue-600",
    done: "bg-green-100 text-green-600",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
          <FiCheckCircle className="text-gray-500" />
          {activity.title}
        </h1>

        <span
          className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${statusStyles[activity.status]}`}
        >
          {activity.status.replace("_", " ")}
        </span>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FiFileText className="text-gray-400" />
          Description
        </h2>

        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {activity.description || "No description provided"}
        </p>
      </div>

      {/* DETAILS GRID */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Details</h2>

        <div className="grid grid-cols-2 gap-y-6 gap-x-10 text-sm">

          {/* Created By */}
          <div className="flex items-start gap-3">
            <FiUser className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Created By</p>
              <p className="font-medium">{activity.created_by}</p>
            </div>
          </div>

          {/* Project */}
          <div className="flex items-start gap-3">
            <FiLayers className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Project</p>
              <p className="font-medium">#{activity.project_id}</p>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-start gap-3">
            <FiClock className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Created At</p>
              <p className="font-medium">{activity.created_at}</p>
            </div>
          </div>

          {/* Activity ID */}
          <div className="flex items-start gap-3">
            <FiHash className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Activity ID</p>
              <p className="font-medium break-all">{activity.id}</p>
            </div>
          </div>

        </div>
      </div>
      <ActivityTimeline />

      <ActivityComments />
    </div>
  );
}
