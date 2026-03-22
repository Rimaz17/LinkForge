import api from "./api.js";

const LOCAL_URLS_KEY = "url_shortener_local_urls";
const URL_LIST_UNAVAILABLE_KEY = "url_shortener_list_unavailable";

export async function createUserShortUrl(payload) {
  const { data } = await api.post("/api/urls", payload);
  return data;
}

export async function fetchUserUrls() {
  const { data } = await api.get("/api/urls");
  return data;
}

export function isUrlListUnavailable() {
  return localStorage.getItem(URL_LIST_UNAVAILABLE_KEY) === "true";
}

export function setUrlListUnavailable(value) {
  if (value) {
    localStorage.setItem(URL_LIST_UNAVAILABLE_KEY, "true");
    return;
  }

  localStorage.removeItem(URL_LIST_UNAVAILABLE_KEY);
}

export function getLocalUrls() {
  try {
    const raw = localStorage.getItem(LOCAL_URLS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(LOCAL_URLS_KEY);
    return [];
  }
}

export function saveLocalUrl(url) {
  const current = getLocalUrls();
  const deduped = current.filter((item) => item?.id !== url?.id && item?.short_code !== url?.short_code);
  const next = [url, ...deduped].slice(0, 30);
  localStorage.setItem(LOCAL_URLS_KEY, JSON.stringify(next));
}