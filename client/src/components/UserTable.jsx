import { useState } from "react";
import { FaTrash, FaSearch, FaUsers } from "react-icons/fa";
// import api from "../api/axios";

const UserTable = ({ users }) => {
    const [search, setSearch] = useState("");

    const dummyUsers = [
        {
            id: 1,
            username: "het darji",
            email: "het@google.com",
            role: "admin",
        },
        {
            id: 2,
            username: "gautam patel",
            email: "gautam@google.com",
            role: "user",
        },
        {
            id: 3,
            username: "dev_koyani",
            email: "dev@google.com",
            role: "user",
        },
    ];

    const usersToDisplay = users.length > 0 ? users : dummyUsers;

    const filteredUsers = usersToDisplay.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        // await api.delete(`/users/${id}`);
        // fetchUsers();
        console.log("Delete user with id:", id);
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
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-gray-500">
                            <th className="py-3 px-2 text-left">Username</th>
                            <th className="py-3 px-2 text-left">Email</th>
                            <th className="py-3 px-2 text-left">Role</th>
                            <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length ? (
                            filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="group border-b hover:bg-gray-50 transition"
                                >
                                    <td className="py-4 px-2 font-medium text-gray-800">
                                        {user.username}
                                    </td>

                                    <td className="py-4 px-2 text-gray-600">
                                        {user.email}
                                    </td>

                                    <td className="py-4 px-2">
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

                                    <td className="py-4 px-2 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="py-10 text-center text-gray-400"
                                >
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Total Users: {filteredUsers.length}</span>
            </div>
        </div>
    );
};

export default UserTable;