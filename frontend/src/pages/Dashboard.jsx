import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

function Dashboard() {
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
    <div className="min-h-screen bg-bg-page font-sans p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-2">
        Dashboard
      </h1>
      <p className="text-text-secondary mb-6">Welcome, {user?.username}!</p>
      <button
        onClick={handleLogout}
        className="bg-error hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition"
      >
        Log Out
      </button>
    </div>
  );
}

export default Dashboard;
