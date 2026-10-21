const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getLibrary() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/library`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = new Error(`Request failed:(${response.status})`);
      error.status = response.status;
      throw error;
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch Library", error);
    throw error;
  }
}

export async function addToLibrary(userData) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/library`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const error = new Error(
        errorBody.message ||
          `Failed to fetch addToLibrary:(${response.status})`,
      );
      error.status = response.status;
      error.fieldErrors = errorBody.error;
      throw error;
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch library:", error);
    throw error;
  }
}

export async function deleteFromLibrary(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/library/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) return null;
    if (!response.ok) {
      const errorBody = await response.json();
      const error = new Error(
        errorBody.message ||
          `Failed to delete from library:(${response.status})`,
      );
      error.status = response.status;
      error.fieldErrors = errorBody.error;

      throw error;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Can not delete from library", error);
    throw error;
  }
}

export async function updateStatus(entryId, status) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/library/${entryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorBody = await response.json();
    const error = new Error(
      errorBody.message || `Failed to update status:(${response.status})`,
    );
    error.status = response.status;
    error.fieldErrors = errorBody.error;

    throw error;
  }
  return response.json();
}
