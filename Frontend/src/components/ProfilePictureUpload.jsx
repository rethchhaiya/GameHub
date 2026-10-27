import { useEffect, useState } from "react";

function ProfilePictureUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

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

  return (
    <div>
      <h2>Profile Picture</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewUrl && <img src={previewUrl} alt="Profile review" width="150" />}
    </div>
  );
}

export default ProfilePictureUpload;
