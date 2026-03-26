import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import UrlForm from "../components/UrlForm.jsx";
import UrlList from "../components/UrlList.jsx";
import { getApiErrorMessage } from "../services/api.js";
import {
  createUserShortUrl,
  fetchUserUrls,
  getLocalUrls,
  saveLocalUrl
} from "../services/urlService.js";

function DashboardPage() {
  const [createdUrl, setCreatedUrl] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [urls, setUrls] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const loadUrls = useCallback(async () => {
    setListError("");
    setListLoading(true);

    try {
      const data = await fetchUserUrls();
      setUrls(Array.isArray(data) ? data : []);
    } catch (err) {
      const apiMessage = getApiErrorMessage(err, "Failed to load URLs");
      if (err?.response?.status === 404) {
        const localUrls = getLocalUrls();
        setUrls(localUrls);
      } else {
        setListError(apiMessage);
      }
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUrls();

    const intervalId = setInterval(() => {
      loadUrls();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loadUrls]);

  const handleCreate = async (payload) => {
    setCreateError("");
    setCreateLoading(true);

    try {
      const created = await createUserShortUrl(payload);
      setCreatedUrl(created);
      saveLocalUrl(created);
      setUrls((current) => [created, ...current]);
    } catch (err) {
      setCreateError(getApiErrorMessage(err, "Failed to create short URL"));
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Navbar />

        <section className="mb-6 rounded-2xl border border-orange-200 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Shorten and Track</h2>
          <p className="mt-1 text-sm text-slate-700">
            Create branded-looking short links and manage everything in one place.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <UrlForm onSubmit={handleCreate} loading={createLoading} />

            {createError && (
              <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{createError}</p>
            )}

            {createdUrl && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <p className="font-medium">Short URL created:</p>
                <a
                  href={`http://localhost:5000/${createdUrl.short_code}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 underline"
                >
                  {`http://localhost:5000/${createdUrl.short_code}`}
                </a>
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <UrlList
              urls={urls}
              loading={listLoading}
              error={listError}
              onRetry={loadUrls}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;