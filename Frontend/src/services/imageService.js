import { apiRequest } from "./apiService";

export function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return apiRequest("/images/profile", {
    method: "POST",
    body: formData,
  });
}
