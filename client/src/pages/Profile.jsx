import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCalendar,
  FiEdit2,
  FiLock,
} from "react-icons/fi";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Get current user from token
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get user id
      
      const response = await api.get(`/users/${decoded.id}`);
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err.response?.data?.message || "Failed to load user data");
      toast.error(err.response?.data?.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
  
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    if (passwords.newPass.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      setPasswordLoading(true);
      
      // Call your password change endpoint
      await api.patch(`/users/${user.id}/change-password`, {
        currentPassword: passwords.current,
        newPassword: passwords.newPass
      });
      toast.success("Password updated successfully!");
      setPasswordSuccess("Password updated successfully!");
      
      // Reset form
      setPasswords({ current: "", newPass: "", confirm: "" });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setOpenPasswordModal(false);
        setPasswordSuccess("");
      }, 2000);
      
    } catch (err) {
      console.error("Password change error:", err);
      setPasswordError(err.response?.data?.message || "Failed to update password");
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Failed to load profile"}</p>
          <button
            onClick={fetchUserData}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* HEADER */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-semibold">
            {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {user.name || user.username}
            </h1>
            <p className="text-gray-500 text-sm">
              @{user.username} • Personal account information
            </p>
          </div>
        </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Details</h2>

        <div className="grid grid-cols-2 gap-y-6 gap-x-10 text-sm">

          <div className="flex items-start gap-3">
            <FiUser className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Full Name</p>
              <p className="font-medium">{user.name || "-"}</p>
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
              <span className={`px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                ${user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-green-100 text-green-600'
                }`}
              >
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiCalendar className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400">Joined On</p>
              <p className="font-medium">{formatDate(user.created_at)}</p>
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

      <Modal isOpen={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FiLock className="text-gray-500" />
          Change Password
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handlePasswordSubmit}>

          {passwordError && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="text-sm text-green-500 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
              {passwordSuccess}
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
              onChange={handlePasswordChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={passwordLoading}
              required
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
              onChange={handlePasswordChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={passwordLoading}
              required
              minLength="8"
            />
            <p className="text-xs text-gray-400">Minimum 8 characters</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={passwordLoading}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setOpenPasswordModal(false);
                setPasswords({ current: "", newPass: "", confirm: "" });
                setPasswordError("");
                setPasswordSuccess("");
              }}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              disabled={passwordLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
