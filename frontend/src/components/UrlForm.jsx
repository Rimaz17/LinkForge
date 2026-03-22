import { useState } from "react";

function UrlForm({ onSubmit, loading }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      original_url: originalUrl,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
    });

    setOriginalUrl("");
    setExpiresAt("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">Create Short URL</h2>
      <p className="text-sm text-slate-500">Paste a long URL and generate a compact link.</p>

      <div>
        <label htmlFor="original-url" className="mb-1 block text-sm font-medium text-slate-700">
          Long URL
        </label>
        <input
          id="original-url"
          type="url"
          required
          placeholder="https://example.com/page"
          value={originalUrl}
          onChange={(event) => setOriginalUrl(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-offset-2 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div>
        <label htmlFor="expires-at" className="mb-1 block text-sm font-medium text-slate-700">
          Expiration Date (optional)
        </label>
        <input
          id="expires-at"
          type="datetime-local"
          value={expiresAt}
          onChange={(event) => setExpiresAt(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-offset-2 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition hover:-translate-y-0.5 hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}

export default UrlForm;