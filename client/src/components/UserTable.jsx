import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaSearch, FaUsers, FaEllipsisV, FaKey } from "react-icons/fa";
import Modal from "./Modal";
import { userValidation } from "../utils/userValidation";
import api from "../api/axios";
import debounce from "lodash/debounce";

const UserTable = ({ users = [], mode = "users", projectId = null, fetchUsers, onAssignToggle }) => {
  const [search, setSearch] = useState("");
  const [displayedUsers, setDisplayedUsers] = useState(users);
  const [searchLoading, setSearchLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (mode === "users") {
        await searchUsers(searchTerm);
      } else if (mode === "project" && projectId) {
        await searchProjectUsers(searchTerm);
      }
    }, 500),
    [mode, projectId]
  );

  // Search users in users mode
   const searchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      // If search is empty, fetch all users
      if (fetchUsers) {
        await fetchUsers();
      }
      return;
    }

    try {
      setSearchLoading(true);
      const { data } = await api.get(`/users?search=${encodeURIComponent(searchTerm)}`);
      setDisplayedUsers(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error searching users");
    } finally {
      setSearchLoading(false);
    }
  };

  // Search users in project mode
  const searchProjectUsers = async (searchTerm) => {
    if (!projectId) return;

    try {
      setSearchLoading(true);
      const { data } = await api.get(`/projects/${projectId}?search=${encodeURIComponent(searchTerm)}`);
      setDisplayedUsers(data.assigned_users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error searching users");
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    if (mode === "users" || (mode === "project" && projectId)) {
      debouncedSearch(value);
    }
  };

  // Update displayed users when parent users prop changes
  useEffect(() => {
    setDisplayedUsers(users);
  }, [users]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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
      if (search) {
        setSearch("");
      }
      setOpenMenuId(null);
      toast.success("User deleted successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  // Frontend assign toggle
  const handleAssignToggle = async (userId) => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }
    
    try {
      setLoading(true);
      
      const user = displayedUsers.find(u => u.id === userId);
      const currentlyAssigned = user?.is_assigned;
      
      if (currentlyAssigned) {
        await api.delete(`/projects/${projectId}/assign/${userId}`);
        toast.success("User unassigned successfully");
      } else {
        await api.post(`/projects/${projectId}/assign/${userId}`);
        toast.success("User assigned successfully");
      }

       if (onAssignToggle) {
        await onAssignToggle();
      }
      
      // Refresh with current search term
      if (fetchUsers) {
        await fetchUsers();
        if (search) {
          debouncedSearch(search);
        }
      }
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating assignment");
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
        if (search) {
          debouncedSearch(search);
        }
      }

      setResetUser(null);
      setNewPassword("");
      setPasswordError("");
      toast.success("Password reset successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error resetting password");
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
        <div className="p-6 space-y-6 bg-white shadow-sm rounded-2xl">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 text-blue-600 bg-blue-100 rounded-xl">
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
                        className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                    />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full py-2 pl-10 pr-4 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
                        disabled={loading || searchLoading}
                    />
                    {searchLoading && (
                        <div className="absolute -translate-y-1/2 right-3 top-1/2">
                            <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm table-fixed">
                    <thead>
                        <tr className="text-gray-500 border-b bg-gray-50">
                            <th className="px-4 py-3 font-semibold text-left">Username</th>
                            <th className="px-4 py-3 font-semibold text-left">Name</th>
                            <th className="px-4 py-3 font-semibold text-left">Email</th>
                            <th className="px-4 py-3 font-semibold text-left">Role</th>
                            {mode === "users" && (
                                <th className="px-4 py-3 font-semibold text-left">Created At</th>
                            )}
                            <th className="w-40 px-4 py-3 font-semibold text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(loading || searchLoading) && (
                            <tr>
                                <td
                                    colSpan={mode === "users" ? 6 : 5}
                                    className="py-8 text-center text-gray-400"
                                >
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {!loading && !searchLoading && displayedUsers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={mode === "users" ? 6 : 5}
                                    className="py-8 text-center text-gray-400"
                                >
                                    {search ? "No users match your search" : "No users found"}
                                </td>
                            </tr>
                        )} 
                            {!loading && !searchLoading && displayedUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="transition border-b border-gray-100 group hover:bg-gray-50"
                                >
                                    <td className="px-4 py-4 font-medium text-gray-800">
                                        {user.username}
                                    </td>

                                    <td className="px-4 py-4 font-medium text-gray-800">
                                        {user.name || "-"}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600 truncate">
                                        {user.email}
                                    </td>

                                    <td className="px-4 py-4">
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
                                        <td className="px-4 py-4 text-gray-500">
                                            {formatDate(user.created_at)}
                                        </td>
                                    )}

                                    <td className="relative px-4 py-4 text-right">
                                        {mode === "users" && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setOpenMenuId(
                                                            openMenuId === user.id ? null : user.id
                                                        )
                                                    }
                                                    className="text-gray-500 hover:text-gray-700"
                                                    disabled={loading || searchLoading}
                                                >
                                                    <FaEllipsisV />
                                                </button>

                                                {openMenuId === user.id && (
                                                    <div className="absolute right-0 z-20 w-40 mt-2 bg-white border shadow-md">
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                            disabled={loading || searchLoading}
                                                        >
                                                            <FaTrash size={12} /> Delete
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setResetUser(user);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="flex items-center w-full gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                                            disabled={loading || searchLoading}
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
                                                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                                                `}
                                                disabled={loading || searchLoading}
                                                >
                                                {loading ? "..." : (user.is_assigned ? "Unassign" : "Assign")}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Total Users: {displayedUsers.length}</span>
                {search && (
                    <button
                        onClick={() => {
                            setSearch("");
                            if (fetchUsers) {
                                fetchUsers();
                            }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700"
                    >
                        Clear search
                    </button>
                )}
            </div>

            <Modal isOpen={!!resetUser} onClose={() => setResetUser(null)}>
                <h2 className="mb-4 text-lg font-semibold">
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
                    <p className="mb-3 text-sm text-red-500">{passwordError}</p>
                )}

                <button
                    onClick={handlePasswordReset}
                    className="w-full py-2 text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
                    disabled={loading || !newPassword}
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </Modal>
        </div>
    );
};

export default UserTable;