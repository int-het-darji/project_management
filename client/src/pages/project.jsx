import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// import Modal from "../components/Modal";

export default function Project() {

    const navigate = useNavigate();
    const projects = [
    {
      id: 2,
      title: "Ecommerce Website",
      desc: "Online store with cart and payment integration",
      createdBy: "Admin",
    },
    {
      id: 3,
      title: "Ecommerce Website",
      desc: "Online store with cart and payment integration",
      createdBy: "Admin",
    },
    {
      id: 4,
      title: "Ecommerce Website",
      desc: "Online store with cart and payment integration",
      createdBy: "Admin",
    },
    {
      id: 5,
      title: "Ecommerce Website",
      desc: "Online store with cart and payment integration",
      createdBy: "Admin",
    },
    {
      id: 6,
      title: "Ecommerce Website",
      desc: "Online store with cart and payment integration",
      createdBy: "Admin",
    },
    {
      id: 7,
      title: "Ecommerce Website",
      desc: "Online store with cart and payment integration",
      createdBy: "Admin",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto h-screen overflow-x-auto no-scrollbar">
      {/* Page Title */}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Create New Project
        </h1>
        <p className="text-gray-500 text-sm">
          Add a new project for your team to start collaborating.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm  p-8">
        <form className="flex flex-col gap-6">

          {/* Project Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter project name..."
              className="border rounded-lg px-4 py-2 focus:outline-none"
            />
          </div>

          {/* Project Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Project Description
            </label>
            <textarea
              rows="5"
              placeholder="Write something about the project..."
              className="border rounded-lg px-4 py-2 resize-none focus:outline-none"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Create Project
            </button>
          </div>

        </form>
      </div>


      <br /><br />

        {/* for project cards */}

        <div className="mb-22">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Your Projects
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer relative"
              onClick={() => navigate(`/projects/${project.id}`)}
            >

              {/* DELETE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("delete clicked");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <FiTrash2 size={18} />
              </button>

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {project.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.desc}
              </p>

              {/* CREATED BY */}
              <div className="text-xs text-gray-400 border-t pt-3">
                Created by {project.createdBy}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
