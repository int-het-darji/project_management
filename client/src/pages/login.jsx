import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";


const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 6 characters"),
});



const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

 const onSubmit = async (data) => {
  setLoading(true);
  const toastId = toast.loading("Signing in...");

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        username: data.email,
        password: data.password,
      }
    );

    const { token, role } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    toast.success("Login successful", { id: toastId });

    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/user/dashboard", { replace: true });
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Invalid credentials",
      { id: toastId }
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* BRAND */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Secure workspace access
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="admin@example.com"
                  className={`w-full rounded-md border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] ${
                    errors.email
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full rounded-md border pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] ${
                    errors.password
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full rounded-md bg-[#4F46E5] py-2.5 text-sm font-medium text-white transition ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#4338CA]"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        
      </div>
    </div>
  );
};

export default Login;
