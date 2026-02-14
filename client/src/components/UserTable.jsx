import { useState, useEffect } from "react";
import { FaTrash, FaSearch, FaUsers, FaEllipsisV, FaKey } from "react-icons/fa";
import Modal from "./Modal";
import { userValidation } from "../utils/userValidation";
import api from "../api/axios";

const UserTable = ({ users = [], mode = "users", projectId = null, fetchUsers }) => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);


    const displayedUsers = filteredUsers.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Frontend delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      setLoading(true);
      await api.delete(`/users/${id}`);
      // Refresh the users list after successful delete
      if (fetchUsers) {
        await fetchUsers();
      }
      setOpenMenuId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  // Frontend assign toggle
  const handleAssignToggle = async (id) => {
    try {
      setLoading(true);
      // You'll need to create this endpoint if you want to persist assignments
      // await api.patch(`/users/${id}/assign`, { projectId, assigned: !users.find(u => u.id === id).is_assigned });
      
      // Optimistic update
      setFilteredUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_assigned: !u.is_assigned } : u
        )
      );

      console.log("Assign toggle:", id, "Project:", projectId);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating assignment");
      // Revert optimistic update on error
      if (fetchUsers) {
        await fetchUsers();
      }
    } finally {
      setLoading(false);
    }
  };


    const handlePasswordReset = async () => {
    const errors = userValidation({
      name: "temp",
      username: "temp_user",
      email: "temp@email.com",
      password: newPassword,
    });

    if (errors.password) {
      setPasswordError(errors.password);
      return;
    }

    try {
      setLoading(true);
      await api.patch(`/users/${resetUser.id}/reset-password`, {
        password: newPassword
      });
      
      // Refresh users list to get updated data
      if (fetchUsers) {
        await fetchUsers();
      }

      setResetUser(null);
      setNewPassword("");
      setPasswordError("");
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <FaUsers size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            User Management
                        </h2>
                    </div>
                </div>

                <div className="relative w-full md:w-72">
                    <FaSearch
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm table-fixed">
                    <thead>
                        <tr className="border-b text-gray-500 bg-gray-50">
                            <th className="py-3 px-4 text-left font-semibold">Username</th>
                            <th className="py-3 px-4 text-left font-semibold">Name</th>
                            <th className="py-3 px-4 text-left font-semibold">Email</th>
                            <th className="py-3 px-4 text-left font-semibold">Role</th>
                            {mode === "users" && (
                                <th className="py-3 px-4 text-left font-semibold">Created At</th>
                            )}
                            <th className="py-3 px-4 text-right font-semibold w-40">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td
                                    colSpan={mode === "users" ? 6 : 5}
                                    className="text-center py-8 text-gray-400"
                                >
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {!loading && displayedUsers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={mode === "users" ? 6 : 5}
                                    className="text-center py-8 text-gray-400"
                                >
                                    No users found
                                </td>
                            </tr>
                        )} 
                            {!loading && displayedUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="group border-b hover:bg-gray-50 transition"
                                >
                                    <td className="py-4 px-4 font-medium text-gray-800">
                                        {user.username}
                                    </td>

                                    <td className="py-4 px-4 font-medium text-gray-800">
                                        {user.name || "-"}
                                    </td>

                                    <td className="py-4 px-4 text-gray-600 truncate">
                                        {user.email}
                                    </td>

                                    <td className="py-4 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${
                                                user.role === "admin"
                                                    ? "bg-purple-100 text-purple-600"
                                                    : "bg-green-100 text-green-600"
                                            }`}
                                        >
                                            {user.role}
                                        </span>

                                    </td>

                                    {mode === "users" && (
                                        <td className="py-4 px-4 text-gray-500">
                                            {formatDate(user.created_at)}
                                        </td>
                                    )}

                                    <td className="py-4 px-4 text-right relative">
                                        {mode === "users" && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setOpenMenuId(
                                                            openMenuId === user.id ? null : user.id
                                                        )
                                                    }
                                                    className="text-gray-500 hover:text-gray-700"
                                                    disabled={loading}
                                                >
                                                    <FaEllipsisV />
                                                </button>

                                                {openMenuId === user.id && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md z-20">
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                                                            disabled={loading}
                                                        >
                                                            <FaTrash size={12} /> Delete
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setResetUser(user);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-blue-600"
                                                            disabled={loading}
                                                        >
                                                            <FaKey size={12} /> Reset Password
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {mode === "project" && (
                                            <button
                                                onClick={() => handleAssignToggle(user.id)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition inline-block
                                                ${user.is_assigned
                                                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                                                        : "bg-green-100 text-green-600 hover:bg-green-200"
                                                    }
                                                `}
                                                disabled={loading}
                                                >
                                                {user.is_assigned ? "Unassign" : "Assign"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Total Users: {displayedUsers.length}</span>
            </div>

            <Modal isOpen={!!resetUser} onClose={() => setResetUser(null)}>
                <h2 className="text-lg font-semibold mb-4">
                    Reset Password for {resetUser?.username}
                </h2>

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordError("");
                    }}
                    className={`w-full border rounded-xl px-4 py-2 mb-2 focus:ring-2 outline-none
                        ${passwordError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}
                    `}
                />
                {passwordError && (
                    <p className="text-sm text-red-500 mb-3">{passwordError}</p>
                )}

                <button
                    onClick={handlePasswordReset}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                    disabled={loading || !newPassword}
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </Modal>
        </div>
    );
};

export default UserTable;