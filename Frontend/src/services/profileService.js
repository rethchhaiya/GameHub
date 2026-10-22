const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProfile() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = new Error(`Request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    throw error;
  }
}

export async function updateProfile(profileData) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const error = new Error(
        errorBody.message || `Request failed (${response.status})`,
      );
      error.status = response.status;
      error.fieldErrors = errorBody.error;

      throw error;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Can not update profile", error);
    throw error;
  }
}
