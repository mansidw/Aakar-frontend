import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, FolderIcon, LogOutIcon, UserIcon } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div
          className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600 text-2xl font-bold"
          onClick={() => navigate("/")}
        >
          आकर AI
        </div>
      </div>

      <div className="flex items-center space-x-2 text-gray-300 absolute left-1/2 transform -translate-x-1/2">
        <UserIcon size={20} className="text-indigo-400" />
        <span>
          Hi,{" "}
          {localStorage.getItem("username") ||
            localStorage.getItem("userEmail")}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onLogout}
          className="
            flex 
            items-center 
            space-x-2 
            text-white 
            hover:text-indigo-300 
            transition 
            duration-300
          "
        >
          <LogOutIcon size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
