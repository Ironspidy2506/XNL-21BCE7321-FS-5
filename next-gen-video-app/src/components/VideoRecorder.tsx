"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = "ml_default"; // Replace with your Cloudinary Upload Preset
const CLOUDINARY_CLOUD_NAME = "dcx2lz5wh"; // Replace with your Cloudinary Cloud Name

const VideoRecorder = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);

  const startRecording = useCallback(() => {
    setRecording(true);
    setVideoUrl(null);
    setCloudinaryUrl(null);

    const stream = webcamRef.current?.video?.srcObject as MediaStream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setVideoBlob(blob);
      setVideoUrl(url);
    };

    mediaRecorderRef.current.start();
  }, []);

  const stopRecording = useCallback(() => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
  }, []);

  const uploadToCloudinary = async () => {
    if (!videoBlob) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", videoBlob);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        formData
      );
      setCloudinaryUrl(response.data.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-4">
      <Webcam ref={webcamRef} className="w-full max-w-md rounded-lg border-2 border-gray-600" />
      <div className="mt-4">
        {recording ? (
          <button onClick={stopRecording} className="bg-red-500 px-4 py-2 rounded">Stop Recording</button>
        ) : (
          <button onClick={startRecording} className="bg-green-500 px-4 py-2 rounded">Start Recording</button>
        )}
      </div>

      {videoUrl && (
        <div className="mt-4">
          <video controls className="w-full max-w-md">
            <source src={videoUrl} type="video/mp4" />
          </video>
          <button 
            onClick={uploadToCloudinary} 
            className="bg-blue-500 px-4 py-2 rounded mt-2"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload to Cloudinary"}
          </button>
        </div>
      )}

      {cloudinaryUrl && (
        <div className="mt-4">
          <p className="text-green-400">Uploaded Successfully! 🎉</p>
          <a href={cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
            View Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
