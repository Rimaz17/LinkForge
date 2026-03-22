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
    <header className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">URL Shortener</h1>
        <p className="text-sm text-slate-500">Signed in as {user?.email || "User"}</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Logout
      </button>
    </header>
  );
}

export default Navbar;