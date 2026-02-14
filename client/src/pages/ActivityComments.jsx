import { useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import { FiMessageCircle } from "react-icons/fi";

export default function ActivityComments() {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);

  const [commentText, setCommentText] = useState("");

  // 🔹 Dummy comments (simulate DB response)
  const dummyComments = [
    {
      id: "c1",
      user: "Het",
      message: "Initial database schema created.",
      createdAt: "2026-02-10T10:00:00Z",
    },
    {
      id: "c2",
      user: "Dev",
      message: "Added activity timeline structure.",
      createdAt: "2026-02-11T13:20:00Z",
    },
    {
      id: "c3",
      user: "Het",
      message: "Working on UI cards now.",
      createdAt: "2026-02-12T09:45:00Z",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Comment:", commentText);

    setCommentText("");
    setOpenModal(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Activity Comments
          </h1>
          <p className="text-gray-500 text-sm">
            Activity ID: {id}
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FiMessageCircle />
          Add Comment
        </button>
      </div>

      {/* COMMENTS LIST */}
      <div className="bg-white rounded-2xl shadow divide-y mb-20">

        {dummyComments.map((comment) => (
          <div key={comment.id} className="p-5 flex justify-between items-start">

            {/* LEFT MESSAGE */}
            <div className="max-w-[80%]">
              <p className="text-gray-700">{comment.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>

            {/* RIGHT USER */}
            <div className="text-sm text-gray-500 whitespace-nowrap">
              by <span className="font-medium text-gray-700">{comment.user}</span>
            </div>

          </div>
        ))}

      </div>

      {/* MODAL — CREATE COMMENT */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Add Comment
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          <textarea
            rows="4"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            className="border rounded-lg px-4 py-2 resize-none focus:outline-none"
            required
          />

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
              Post Comment
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}