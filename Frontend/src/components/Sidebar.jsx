import React from "react";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";

function Sidebar({ onClose }) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/user/logout`,
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      localStorage.removeItem(`promtHistory_${user._id}`)

      toast.success("Logout successfully")

      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      toast.error('Error in logout')
    }
  };
  function newChatClick(){
    localStorage.removeItem(`promtHistory_${user._id}`);
    window.location.reload();
  }

  return (
    <div className="h-full flex flex-col justify-between p-4">
      {/* Header */}
      <div>
        <div className="flex border-b border-gray-600 p-2 justify-between items-center mb-4">
          <div className="text-2xl font-bold text-gray-200">deepseek</div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 md:hidden" />
          </button>
        </div>

        {/* History */}
        <div className=" flex-1 overflow-y-auto px-4 py-3 space-y-2">
          <button onClick={newChatClick} className=" w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4">
            + New Chat
          </button>
          <div className=" text-gray-500 text-sm mt-20 text-center">
            No chat history yet
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-1 border-t border-gray-600">
        <div className="flex  items-center gap-2 cursor-pointer my-3">
          <img
            src="https://i.pravatar.cc/32"
            alt="profile"
            className="rounded-full w-8 h-8"
          />
          <span className="text-gray-300 font-bold">
            {user ? user?.firstName : "My Profile"}
          </span>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 duration-300 transition"
          >
            <LogOut className="" />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;