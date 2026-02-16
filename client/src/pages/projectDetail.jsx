import { useParams } from "react-router-dom";
import {
  FiCalendar,
  FiUser,
  FiClock,
  FiFlag,
  FiHash,
  FiFileText,
  FiLoader
} from "react-icons/fi";
import UserTable from "../components/UserTable";
import Activity from "./Activity";
import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-600";
      case 'in_progress':
        return "bg-blue-100 text-blue-600";
      case 'pending':
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-3 text-gray-500">
          <FiLoader className="animate-spin" size={20} />
          <span>Loading project details...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Project not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen max-w-6xl mx-auto space-y-8 overflow-x-auto no-scrollbar">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
            <FiFileText className="text-gray-500" />
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Project workspace overview
          </p>
        </div>

        <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <div className="grid items-start grid-cols-12 gap-6">

        {/* LEFT SIDE */}
        <div className="col-span-12 space-y-6 lg:col-span-8">

          {/* Description */}
          <div className="p-6 bg-white shadow-sm rounded-2xl">
            <h2 className="flex items-center gap-2 mb-3 text-lg font-semibold">
              <FiFileText className="text-gray-400" />
              Description
            </h2>
            <p className="leading-relaxed text-gray-600">
              {project.description || "No description"}
            </p>
          </div>

          {/* Timeline */}
          <div className="p-6 bg-white shadow-sm rounded-2xl">
            <h2 className="flex items-center gap-2 mb-5 text-lg font-semibold">
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
                  <p className="font-medium">
                    {formatDate(project.start_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiFlag className="text-gray-500" />
                </div>
                <div>
                  <p className="text-gray-400">End Date</p>
                  <p className="font-medium">
                    {formatDate(project.end_date)
                      ? formatDate(project.end_date)
                      : "Not set"}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 space-y-6 lg:col-span-4">

          {/* People */}
          <div className="p-6 bg-white shadow-sm rounded-2xl">
            <h2 className="flex items-center gap-2 mb-5 text-lg font-semibold">
              <FiUser className="text-gray-400" />
              People
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Created By</span>
                <span className="font-medium">
                  {project.created_by_name || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="p-6 bg-white shadow-sm rounded-2xl">
            <h2 className="flex items-center gap-2 mb-5 text-lg font-semibold">
              <FiHash className="text-gray-400" />
              Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Created At</span>
                <span>{formatDate(project.created_at)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Updated At</span>
                <span>{formatDate(project.updated_at)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Project ID</span>
                <span>#{project.id}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Activities */}
      <Activity projectId={project.id} />

      {/* Users */}
      <UserTable
        users={project.assigned_users || []}
        mode="project"
        projectId={project.id}
        fetchUsers={fetchProjectDetails}
        onAssignToggle={fetchProjectDetails}
      />

    </div>
  );
}