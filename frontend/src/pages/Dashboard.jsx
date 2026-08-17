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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Page</h1>
      <p className="mb-4">Welcome, {user?.username}!</p>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Log Out
      </button>
    </div>
  );
}

export default Dashboard;
