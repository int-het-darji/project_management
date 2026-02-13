import { useEffect, useState } from "react";
import api from "../api/axios";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import Modal from "../components/Modal";
import { FaUserPlus } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  useEffect(() => {
    // fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      
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

      <UserTable users={users} fetchUsers={fetchUsers} />

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
