"use client";
import React, { useState } from "react";
import axios from "axios";

const VideoUpload = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const uploadVideo = async () => {
    if (!video) return alert("Please select a video");

    const formData = new FormData();
    formData.append("file", video);
    formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary preset

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/video/upload`,
        formData
      );

      setUploadedUrl(response.data.secure_url);
      alert("Upload Successful!");
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept="video/*" onChange={handleVideoChange} />
      <button
        onClick={uploadVideo}
        disabled={uploading}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {uploadedUrl && (
        <div className="mt-4">
          <p>Uploaded Video:</p>
          <video controls src={uploadedUrl} className="w-64" />
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
