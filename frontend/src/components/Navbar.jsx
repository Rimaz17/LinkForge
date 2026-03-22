import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="mb-6 flex items-center justify-between rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">URL Shortener</h1>
        <p className="text-sm text-slate-500">Signed in as <span className="font-medium text-slate-700">{user?.email || "User"}</span></p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-orange-500"
      >
        Logout
      </button>
    </header>
  );
}

export default Navbar;