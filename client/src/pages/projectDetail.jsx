import { useParams } from "react-router-dom";
import {
  FiCalendar,
  FiUser,
  FiClock,
  FiFlag,
  FiHash,
  FiFileText,
} from "react-icons/fi";
import UserTable from "../components/UserTable";

export default function ProjectDetail() {
  const { id } = useParams();

  const project = {
    id,
    title: "Ecommerce Website",
    desc: "Online store with cart and payment integration including admin dashboard and order tracking.",
    createdBy: "Admin",
    assignedTo: "Het Darji",
    status: "In Progress",
    startDate: "2026-02-01",
    endDate: "2026-03-01",
    createdAt: "2026-01-28",
    updatedAt: "2026-02-10",
  };

  const statusColor =
    project.status === "Completed"
      ? "bg-green-100 text-green-600"
      : project.status === "Pending"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-blue-100 text-blue-600";

  return (
    <div className="max-w-6xl mx-auto space-y-8 h-screen no-scrollbar overflow-x-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <FiFileText className="text-gray-500" />
            {project.title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Project workspace overview
          </p>
        </div>

        <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {project.status}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">

        {/* LEFT SIDE */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FiFileText className="text-gray-400" />
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {project.desc}
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <FiCalendar className="text-gray-400" />
              Timeline
            </h2>

            <div className="grid grid-cols-2 gap-6 text-sm">

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiClock className="text-gray-500" />
                </div>
                <div>
                  <p className="text-gray-400">Start Date</p>
                  <p className="font-medium">{project.startDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiFlag className="text-gray-500" />
                </div>
                <div>
                  <p className="text-gray-400">End Date</p>
                  <p className="font-medium">{project.endDate}</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* People */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <FiUser className="text-gray-400" />
              People
            </h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Created By</span>
                <span className="font-medium">{project.createdBy}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Assigned To</span>
                <span className="font-medium">{project.assignedTo}</span>
              </div>

            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <FiHash className="text-gray-400" />
              Details
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400">Created At</span>
                <span>{project.createdAt}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Updated At</span>
                <span>{project.updatedAt}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Project ID</span>
                <span>#{project.id}</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      <UserTable 
        users={project.assigned_users || []} 
        mode="project" 
        projectId={project.id}
        // fetchUsers={fetchProjectDetails}
      />

    </div>
  );
}
