import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        // ignore error
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/", { replace: true });
      }
    };

    logout();
  }, [navigate]);

  return null;
};

export default Logout;
