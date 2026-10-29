import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/profileService";
import { uploadImage } from "../services/imageService";
import { useAuth } from "../hooks/useAuth";
import ProfilePictureUpload from "../components/ProfilePictureUpload";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data) {
          setProfile(data);
          setBio(data.bio || "");
          setAvatarUrl(data.avatarUrl || "");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    let nextAvatarUrl = avatarUrl;
    let uploadedPhoto = false;

    try {
      if (avatarFile) {
        try {
          const uploaded = await uploadImage(avatarFile);
          nextAvatarUrl = uploaded.imageUrl;
          setAvatarUrl(nextAvatarUrl);
          setAvatarFile(null);
          uploadedPhoto = true;
        } catch (err) {
          setError(err.message || "Photo upload failed. Please try again.");
          return;
        }
      }

      const updated = await updateProfile({ bio, avatarUrl: nextAvatarUrl });
      setProfile(updated);
      setAvatarUrl(updated.avatarUrl || "");
      setSuccess("Profile saved!");
    } catch (err) {
      setError(
        uploadedPhoto
          ? `${err.message} (Your photo uploaded — press Save Profile again.)`
          : err.message,
      );
    } finally {
      setSaving(false);
    }
  }

  function handleAvatarUrlChange(e) {
    setAvatarUrl(e.target.value);
    if (avatarFile) setAvatarFile(null);
  }

  function handleClearAvatar() {
    setAvatarFile(null);
    setAvatarUrl("");
  }

  return (
    <main className="min-h-screen bg-[#0c0e13] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
            GameHub / Profile
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Your <span className="text-lime-400">profile.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-gray-400">
            Tell other gamers a bit about yourself.
          </p>
        </header>
        {loading ? (
          <p className="text-sm text-lime-300">Loading your profile...</p>
        ) : (
          <form
            className="rounded-2xl border border-white/10 bg-[#171a22] p-6 sm:p-8"
            onSubmit={handleSubmit}
          >
            {/* Status error or success */}
            {error && (
              <p className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}
            {success && (
              <p className="mb-5 rounded-lg border border-lime-400/20 bg-lime-400/10 p-3 text-sm text-lime-300">
                {success}
              </p>
            )}

            <div className="flex flex-col gap-8 md:flex-row">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 md:w-48">
                <ProfilePictureUpload
                  value={avatarUrl}
                  name={user?.userName}
                  file={avatarFile}
                  onSelect={setAvatarFile}
                  onClear={handleClearAvatar}
                  disabled={saving}
                />
                <p className="text-sm text-gray-400">{user?.userName}</p>
                {profile && (
                  <p className="text-center text-xs text-gray-500">
                    Member since{" "}
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-5">
                <div>
                  <label
                    htmlFor="bio"
                    className="mb-1 block text-sm text-gray-400"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={5}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about the games you love..."
                    className="w-full resize-none rounded-lg border border-white/10 bg-[#0c0e13] px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-lime-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">A short intro show on your profile</p>
                </div>

                <div>
                  <label
                    htmlFor="avatarUrl"
                    className="mb-1 block text-sm text-gray-400"
                  >
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={handleAvatarUrlChange}
                    placeholder="https://example.com/avatar.png"
                    className="w-full rounded-lg border border-white/10 bg-[#0c0e13] px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-lime-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Filled in automatically when you upload a photo — or paste a
                    link manually.
                  </p>
                </div>
                <button
                type="submit" disabled={saving}
                className="rounded-lg bg-lime-400 px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default ProfilePage;
