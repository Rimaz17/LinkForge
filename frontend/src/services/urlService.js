import api from "./api.js";

export async function createUserShortUrl(payload) {
  const { data } = await api.post("/api/urls", payload);
  return data;
}

export async function fetchUserUrls() {
  const { data } = await api.get("/api/urls");
  return data;
}