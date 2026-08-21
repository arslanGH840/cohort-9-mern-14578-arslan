import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-bg-page font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default MainLayout;
