const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getReviewByGame(rawgId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/review?rawgId=${rawgId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json();
    const error = new Error(
      errorBody.message ||
        `Failed to fetch getReviewByGame:(${response.status})`,
    );
    error.status = response.status;
    error.fieldErrors = errorBody.error;
    throw error;
  }
  const data = response.json();
  return data;
}

export async function createReview(userData) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/review`, {
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
          `Failed to fetch To createReview:(${response.status})`,
      );
      error.status = response.status;
      error.fieldErrors = errorBody.error;
      throw error;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create review", error);
    throw error;
  }
}

export async function updateReview(reviewId, userData) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/review/${reviewId}`, {
      method: "PUT",
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
          `Failed to fetch To updateReview:(${response.status})`,
      );
      error.status = response.status;
      error.fieldErrors = errorBody.error;
      throw error;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Faild to fetch updateReview", error);
    throw error;
  }
}

export async function deleteReview(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/review/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const errorBody = await response.json();
      const error = new Error(
        errorBody.message ||
          `Failed to fetch To deleteReview:(${response.status})`,
      );
      error.status = response.status;
      error.fieldErrors = errorBody.error;
      throw error;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Faild to deleteReview", error);
    throw error;
  }
}
