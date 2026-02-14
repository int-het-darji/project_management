import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { userValidation } from "../utils/userValidation";
import api from "../api/axios";

const UserForm = ({ fetchUsers }) => {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = userValidation(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await api.post("/users", form);
      fetchUsers();
      toast.success("User created successfully!");
      setForm({ username: "", name: "", email: "", password: "", role: "user" });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
          <FaUserPlus size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Create User
          </h2>
          <p className="text-sm text-gray-500">
            Add a new user to the system
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter Name"
          className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition
            focus:ring-2 focus:ring-blue-500
            ${errors.name ? "border-red-500" : "border-gray-300"}
          `}
          disabled={loading}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter username"
          className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition
            focus:ring-2 focus:ring-blue-500
            ${errors.username ? "border-red-500" : "border-gray-300"}
          `}
          disabled={loading}
        />
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition
            focus:ring-2 focus:ring-blue-500
            ${errors.email ? "border-red-500" : "border-gray-300"}
          `}
          disabled={loading}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            className={`w-full rounded-xl border px-4 py-2 pr-11 text-sm outline-none transition
              focus:ring-2 focus:ring-blue-500
              ${errors.password ? "border-red-500" : "border-gray-300"}
            `}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          User Role
        </label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white
        hover:bg-blue-700 transition active:scale-[0.98]"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
};

export default UserForm;