
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeftCircle } from "lucide-react";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-indigo-200/50 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-medium transition"
        >
          <ArrowLeftCircle size={20} /> Retour
        </button>

        <div className="text-gray-700 text-sm bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 flex items-center gap-2">
          {user ? (
            <>
              <span className="font-semibold text-indigo-700">Bonjour,</span> {user.nom}
            </>
          ) : (
            <span>Non connecté</span>
          )}
        </div>


        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium hover:underline transition"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
