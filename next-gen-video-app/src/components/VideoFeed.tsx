"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const CLOUDINARY_CLOUD_NAME = "dcx2lz5wh"; // Replace with your Cloudinary Cloud Name

const VideoFeed = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/video` // ✅ Correct API for videos
        );

        // Define the type explicitly
        const videoUrls = response.data.resources.map(
          (video: { public_id: string }) =>
            `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${video.public_id}.mp4`
        );

        setVideos(videoUrls);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold">🎥 Video Feed</h2>
      {loading && <p>Loading videos...</p>}

      <div className="mt-4 space-y-4">
        {videos.map((videoUrl, index) => (
          <video
            key={index}
            src={videoUrl}
            controls
            className="w-full max-w-md rounded-lg border-2 border-gray-600"
          />
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;
