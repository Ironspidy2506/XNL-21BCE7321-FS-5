"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const CLOUDINARY_CLOUD_NAME = "dcx2lz5wh";
const CLOUDINARY_API_KEY = "459167398322289";
const CLOUDINARY_API_SECRET = "t65EHnohjCAmWvjDgpjTvAvJ3IM";
const FOLDER_NAME = "nextgenvideos";

const VideoFeed = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideosByFolder = async () => {
      try {
        const response = await axios.get(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/video?prefix=${FOLDER_NAME}/`,
          {
            auth: {
              username: `${CLOUDINARY_API_KEY}`,
              password: `${CLOUDINARY_API_SECRET}`,
            },
          }
        );

        return response.data.resources;
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideosByFolder();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
      {loading && <p className="text-gray-400">Loading videos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {videos.length > 0
        ? videos.map((video, index) => (
            <div key={index} className="w-full max-w-lg my-4">
              <video controls className="w-full rounded-lg">
                <source src={video} type="video/mp4" />
              </video>
              <p className="text-center mt-2">Video {index + 1}</p>
            </div>
          ))
        : !loading && <p className="text-gray-400">No videos found.</p>}
    </div>
  );
};

export default VideoFeed;
