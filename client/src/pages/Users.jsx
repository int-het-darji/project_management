import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import Modal from "../components/Modal";
import { FaUserPlus } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex justify-end items-center">

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl
          hover:bg-blue-700 transition"
        >
          <FaUserPlus size={14} />
          Create User
        </button>
      </div>

      <UserTable users={users} mode="users" fetchUsers={fetchUsers} />

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <UserForm
          fetchUsers={() => {
            fetchUsers();
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Users;
