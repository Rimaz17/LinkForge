import { useState } from "react";
import { API_BASE_URL } from "../services/api.js";

function UrlList({ urls, loading, error, onRetry }) {
  const [copiedCode, setCopiedCode] = useState("");

  const copyUrl = async (shortCode) => {
    const fullUrl = `${API_BASE_URL}/${shortCode}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedCode(shortCode);
    setTimeout(() => setCopiedCode(""), 1500);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Your URLs</h2>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading URLs...</p>}

      {!loading && error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      {!loading && !error && urls.length === 0 && <p className="text-sm text-slate-500">No URLs yet.</p>}

      {!loading && !error && urls.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-2 pr-4 font-medium">Original URL</th>
                <th className="py-2 pr-4 font-medium">Short URL</th>
                <th className="py-2 pr-4 font-medium">Clicks</th>
                <th className="py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => {
                const shortLink = `${API_BASE_URL}/${url.short_code}`;

                return (
                  <tr key={url.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="max-w-[280px] py-3 pr-4 text-slate-700">
                      <p className="truncate" title={url.original_url}>
                        {url.original_url}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-sky-700">
                      <a href={shortLink} target="_blank" rel="noreferrer" className="hover:underline">
                        {shortLink}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{url.click_count ?? 0}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => copyUrl(url.short_code)}
                        className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
                      >
                        {copiedCode === url.short_code ? "Copied" : "Copy"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UrlList;