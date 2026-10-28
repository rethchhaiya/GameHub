const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, option = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...option,
    headers: {
      ...(option.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...option.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || `Request failed ${response.status}`);
  }

  //delete
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
