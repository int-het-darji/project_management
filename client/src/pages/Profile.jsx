import { useState } from "react";
import Modal from "../components/Modal";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCalendar,
  FiEdit2,
  FiLock,
} from "react-icons/fi";

export default function Profile() {
  // fake user data (replace later with API)
  const user = {
    name: "Het Darji",
    email: "het@example.com",
    role: "User",
    joinedAt: "2026-01-12",
  };

  /* ---------------- PASSWORD MODAL STATE ---------------- */

  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setError("All fields are required");
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      setError("New password and confirm password do not match");
      return;
    }

    console.log("Password Change:", passwords);

    // reset & close
    setPasswords({ current: "", newPass: "", confirm: "" });
    setError("");
    setOpenPasswordModal(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {user.name}
            </h1>
            <p className="text-gray-500 text-sm">
              Personal account information
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm">
          <FiEdit2 />
          Edit Profile
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Details</h2>

        <div className="grid grid-cols-2 gap-y-6 gap-x-10 text-sm">

          <div className="flex items-start gap-3">
            <FiUser className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiMail className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Email Address</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiShield className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Role</p>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiCalendar className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Joined On</p>
              <p className="font-medium">{user.joinedAt}</p>
            </div>
          </div>

        </div>
      </div>

      {/* SECURITY CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Security</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Password</p>
            <p className="text-sm text-gray-400">Update your account password</p>
          </div>

          <button
            onClick={() => setOpenPasswordModal(true)}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      <Modal isOpen={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FiLock className="text-gray-500" />
          Change Password
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPass"
              value={passwords.newPass}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setOpenPasswordModal(false)}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Update Password
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
