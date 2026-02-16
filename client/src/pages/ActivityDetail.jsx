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
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ActivityDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [activity, setActivity] = useState(null);

  // FETCH ACTIVITY
  const fetchActivity = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/activities/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActivity(res.data);
    } catch (err) {
      toast.error("Activity not found");
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [id]);

  if (!activity) return <div className="p-10">Loading...</div>;

  const statusStyles = {
    todo: "bg-gray-100 text-gray-600",
    in_progress: "bg-blue-100 text-blue-600",
    done: "bg-green-100 text-green-600",
  };


  // for activity status 
  const statusFlow = ["todo", "in_progress", "review", "done"];

const getNextStatus = () => {
  const currentIndex = statusFlow.indexOf(activity.status);
  return statusFlow[currentIndex + 1] || null;
};

const updateStatus = async () => {
  const next = getNextStatus();
  if (!next) return toast("Activity already completed");

  try {
    const res = await axios.patch(
      `http://localhost:5000/api/activities/${activity.id}`,
      { status: next },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setActivity(res.data);
    toast.success(`Moved to ${next.replace("_", " ")}`);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update");
  }
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

          <div className="flex items-start gap-3">
            <FiUser className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Created By</p>
              <p className="font-medium">{activity.created_by_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiLayers className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Project</p>
              <p className="font-medium">#{activity.project_id}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiClock className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Created At</p>
              <p className="font-medium">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiHash className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Activity ID</p>
              <p className="font-medium break-all">{activity.id}</p>
            </div>
          </div>

        </div>
      </div>

      {/* STATUS ACTION */}
{getNextStatus() && (
  <div className="flex justify-end">
    <button
      onClick={updateStatus}
      className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition"
    >
      Move to {getNextStatus().replace("_", " ")}
    </button>
  </div>
)}

      <ActivityTimeline
  status={activity.status}
  title={activity.title}
  createdBy={activity.created_by_name}
/>
      <ActivityComments activityId={activity.id} />

    </div>
  );
}