import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import Button from "./ui/Button";

function Navbar() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser(token);
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-surface border-b border-border px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#4F46E5]"
        >
          <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
          Vellum
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary"
          >
            <User size={16} />
            {user?.username}
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-1.5"
          >
            <LogOut size={16} />
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
