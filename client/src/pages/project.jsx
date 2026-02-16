// import { FiTrash2 } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import Modal from "../components/Modal";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function Project() {

//   const [openModal, setOpenModal] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     desc: "",
//   });

//   const [projects, setProjects] = useState([]);


//   const navigate = useNavigate();
//   const role = localStorage.getItem('role')

//   const token = localStorage.getItem("token");
//   // ================= FETCH PROJECTS =================
//   const fetchProjects = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/projects", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setProjects(res.data);
//     } catch (err) {
//       toast.error("Failed to load projects");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // ================= HANDLE INPUT =================
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ================= CREATE PROJECT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // FRONTEND VALIDATION
//     if (!formData.name.trim()) {
//       return toast.error("Project name is required");
//     }

//     if (formData.name.trim().length < 3) {
//       return toast.error("Project name must be at least 3 characters");
//     }

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/projects",
//         {
//           name: formData.name.trim(),
//           description: formData.desc.trim(),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // SUCCESS
//       toast.success("Project created successfully");

//       // ADD WITHOUT REFRESH
//       setProjects((prev) => [res.data.project, ...prev]);

//       setOpenModal(false);
//       setFormData({ name: "", desc: "" });

//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create project");
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Delete this project?");

//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/projects/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("Project deleted");

  
//       setProjects((prev) => prev.filter((p) => p.id !== id));

//     } catch (err) {
//       toast.error("Failed to delete project");
//     }
//   };

//   return (
//     <div className="h-screen max-w-3xl mx-auto overflow-x-auto no-scrollbar">

//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
//           <p className="text-sm text-gray-500">
//             Manage and create your projects
//           </p>
//         </div>

//        {role === "admin" && (
//   <button
//     onClick={() => setOpenModal(true)}
//     className="px-5 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
//   >
//     + Create Project
//   </button>
// )}
//       </div>

//       <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
//         <div className="p-6 bg-white shadow-sm rounded-2xl">

//           <h2 className="mb-4 text-xl font-semibold">Create New Project</h2>

//           <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Project name"
//               className="px-4 py-2 border rounded-lg"
//               required
//               minLength={3}
//             />

//             <textarea
//               rows="4"
//               name="desc"
//               value={formData.desc}
//               onChange={handleChange}
//               placeholder="Project description"
//               className="px-4 py-2 border rounded-lg"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setOpenModal(false)}
//                 className="px-5 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                 }}
//                 type="submit"
//                 className="px-5 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//               >
//                 Create Project
//               </button>
//             </div>

//           </form>
//         </div>
//       </Modal>

    
//       <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
//         {projects.map((project) => (
//           <div
//             key={project.id}
//             className="relative p-5 transition bg-white shadow-sm cursor-pointer rounded-2xl hover:shadow-md"
//             onClick={() => navigate(`/${role}/projects/${project.id}`)}
//           >
//             {/* DELETE */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleDelete(project.id);
//               }}
//               className="absolute text-gray-400 top-4 right-4 hover:text-red-500"
//             >
//               <FiTrash2 size={18} />
//             </button>

//             {/* TITLE */}
//             <h3 className="mb-2 text-lg font-semibold text-gray-800">
//               {project.name}
//             </h3>

//             {/* DESC */}
//             <p className="mb-4 text-sm text-gray-600 line-clamp-3">
//               {project.description}
//             </p>

//             {/* DATE */}
//             <div className="pt-3 text-xs text-gray-400 border-t">
//               Created at {new Date(project.created_at).toLocaleDateString()}
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }



import { FiTrash2, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Project() {
  const [openModal, setOpenModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();
  
  // Get user role from localStorage
  const userRole = localStorage.getItem('role') || 'user';

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // The backend will handle role-based filtering automatically
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      await api.post('/projects', formData);
      toast.success("Project created successfully");
      setOpenModal(false);
      setFormData({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating project");
    }
  };

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/projects/${projectId}`);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting project");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="h-screen max-w-6xl p-6 mx-auto overflow-x-auto no-scrollbar">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Projects
          </h1>
          <p className="text-sm text-gray-500">
            {userRole === 'admin' 
              ? 'Manage and create your projects' 
              : 'View your assigned projects'}
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 px-5 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FiPlus size={18} />
            Create Project
          </button>
        )}
      </div>

      {/* Create Project Modal - Only for admin */}
      {userRole === 'admin' && (
        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Create New Project
            </h1>
            <p className="text-sm text-gray-500">
              Add a new project for your team to start collaborating.
            </p>
          </div>

          <div className="p-8 bg-white shadow-sm rounded-2xl">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name..."
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write something about the project..."
                  className="px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-5 py-2 text-gray-600 transition border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Project Cards */}
      <div className="mb-8">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          {userRole === 'admin' ? 'All Projects' : 'My Assigned Projects'}
        </h2>

        {projects.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl">
            <p className="text-gray-500">
              {userRole === 'admin' 
                ? 'No projects created yet' 
                : 'No projects assigned to you yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="relative p-5 transition bg-white shadow-sm cursor-pointer rounded-2xl hover:shadow-md group"
                onClick={() => navigate(`/${userRole}/projects/${project.id}`)}
              >
                {/* Delete button - Only for admin */}
                {userRole === 'admin' && (
                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    className="absolute text-gray-400 transition opacity-0 top-4 right-4 hover:text-red-500 group-hover:opacity-100"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}

                {/* Title */}
                <h3 className="pr-8 mb-2 text-lg font-semibold text-gray-800">
                  {project.name}
                </h3>

                {/* Description */}
                <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                  {project.description || "No description provided"}
                </p>

                {/* Status Badge */}
                <div className="mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'completed' ? 'bg-green-100 text-green-600' :
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {project.status || 'pending'}
                  </span>
                </div>

                {/* Created By */}
                <div className="pt-3 text-xs text-gray-400 border-t">
                  Created by {project.created_by_name || 'Unknown'}
                </div>

                {/* Assignment indicator for users */}
                {userRole !== 'admin' && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                      Assigned to you
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}