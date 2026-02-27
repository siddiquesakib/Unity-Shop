"use client";
import { useState } from "react";

const ImageUpload = ({ onUploadComplete, label = "Upload Image" }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ফাইল সাইজ চেক (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large (max 10MB)");
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unity-shop"); // Cloudinary unsigned upload preset name
    formData.append("folder", "unity-shop");

    try {
      // সরাসরি Cloudinary API তে আপলোড — ব্যাকএন্ড লাগবে না!
      const cloudName = "dhhovsiuh"; // তোমার Cloudinary cloud name
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok && data.secure_url) {
        onUploadComplete(data.secure_url);
      } else {
        console.error("Cloudinary Error:", data);
        setError(data.error?.message || "Upload failed");
        setPreview(null);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setError("Upload failed. Check internet connection.");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={loading}
        />
        {loading && <span className="text-sm text-gray-500">Uploading...</span>}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {preview && (
        <div className="mt-2 w-32 h-32 relative border rounded overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
