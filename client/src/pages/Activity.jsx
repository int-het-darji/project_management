import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { FiPlusCircle } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

export default function Activity({ projectId }) {

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [activities, setActivities] = useState([]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem('role')

  // ================= FETCH ACTIVITIES =================
  const fetchActivities = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/projects/${projectId}/activities`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setActivities(res.data);
  } catch (err) {
    toast.error("Failed to load activities");
  }
};

  useEffect(() => {
    if (projectId) fetchActivities();
  }, [projectId]);

  // ================= FORM =================
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= CREATE ACTIVITY =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!formData.title.trim())
      return toast.error("Activity title required");

    if (formData.title.trim().length < 3)
      return toast.error("Minimum 3 characters required");

    try {
      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/activities`,
        {
          title: formData.title,
          description: formData.desc,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Activity created 🎉");

      setFormData({ title: "", desc: "" });
      setOpenModal(false);
      fetchActivities(); // reload
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Activities
          </h1>
          <p className="text-gray-500 text-sm">
            Track project updates and progress logs
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FiPlusCircle />
          Create Activity
        </button>
      </div>

      {/* ACTIVITY CARDS */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400">
          No activities yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() =>
                navigate(`/${role}/projects/activity/${activity.id}`)
              }
              className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              {/* TITLE */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {activity.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                {activity.description}
              </p>

              {/* FOOTER */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="capitalize">
                  Status: {activity.status.replace("_", " ")}
                </span>
                <span>
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Create Activity
        </h2>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

          {/* TITLE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Activity Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter activity title..."
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Describe the activity..."
              className="border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Create Activity
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
