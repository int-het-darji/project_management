import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Project() {

  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
  });

  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();
  const role = "admin";
  const token = localStorage.getItem("token");

  // ================= FETCH PROJECTS =================
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= CREATE PROJECT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FRONTEND VALIDATION
    if (!formData.name.trim()) {
      return toast.error("Project name is required");
    }

    if (formData.name.trim().length < 3) {
      return toast.error("Project name must be at least 3 characters");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        {
          name: formData.name.trim(),
          description: formData.desc.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // SUCCESS
      toast.success("Project created successfully");

      // ADD WITHOUT REFRESH
      setProjects((prev) => [res.data.project, ...prev]);

      setOpenModal(false);
      setFormData({ name: "", desc: "" });

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this project?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Project deleted");

  
      setProjects((prev) => prev.filter((p) => p.id !== id));

    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-screen overflow-x-auto no-scrollbar">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
          <p className="text-gray-500 text-sm">
            Manage and create your projects
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          + Create Project
        </button>
      </div>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Project name"
              className="border rounded-lg px-4 py-2"
              required
              minLength={3}
            />

            <textarea
              rows="4"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Project description"
              className="border rounded-lg px-4 py-2"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toast.error("Delete clicked (not implemented)");
                  // alert("delete clicked");
                  // Replace with actual delete logic and error handling
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                type="submit"
                className="bg-blue-500 text-white py-2 px-5 rounded-lg hover:bg-blue-600"
              >
                Create Project
              </button>
            </div>

          </form>
        </div>
      </Modal>

    
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer relative"
            onClick={() => navigate(`/${role}/projects/${project.id}`)}
          >
            {/* DELETE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(project.id);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <FiTrash2 size={18} />
            </button>

            {/* TITLE */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {project.name}
            </h3>

            {/* DESC */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* DATE */}
            <div className="text-xs text-gray-400 border-t pt-3">
              Created at {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}