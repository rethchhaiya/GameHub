import { useEffect, useState } from "react";
import { uploadImage } from "../services/imageService";

function ProfilePictureUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setImageUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImageUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!imageFile) {
      alert("Please select an image first");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const result = await uploadImage(imageFile);
      setImageUrl(result.imageUrl);
      console.log(result.imageUrl);
    } catch (err) {
      console.error("Failed to upload", err);
      setError(err.messsage);
    } finally {
      setUploading(false);
    }
  }

  if (uploading) return <p>Uploading...</p>;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Profile Picture</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imageUrl && (
          <img src={imageUrl} alt="Profile review" width="150" />
        )}
        <button type="submit" disabled={uploading}>Submit</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default ProfilePictureUpload;
