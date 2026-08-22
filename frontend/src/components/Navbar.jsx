import { Link, useNavigate } from "react-router-dom";
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
        <Link to="/" className="text-lg font-semibold text-text-primary">
          Notes App
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="text-sm text-text-secondary hover:text-primary"
          >
            {user?.username}
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
