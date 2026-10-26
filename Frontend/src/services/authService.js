import ExplorePage from "../pages/ExplorePage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(userData) {

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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
    console.error("Failed to register", error);
    throw error;
  }
}

export async function loginUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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
    console.error("Failed to login", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try{
    const token = localStorage.getItem("token");
     
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if(!response.ok){
      const error = new Error(`Request failed (${response.status})`);
      error.status = response.status;

      throw error;
    }
    const data = await response.json();

    return data;
  }catch(error){
    console.error("Failed to fetch current user", error);
    throw error;
  }
}

export function isLoggedIn(){
  return localStorage.getItem("token") != null;
}
