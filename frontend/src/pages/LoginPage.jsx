import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../services/api.js";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn({ email, password });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mb-5 text-sm text-slate-500">Sign in to manage your URLs.</p>

        {error && <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-offset-2 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-offset-2 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          No account? <Link to="/register" className="font-medium text-sky-700 hover:underline">Register</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;