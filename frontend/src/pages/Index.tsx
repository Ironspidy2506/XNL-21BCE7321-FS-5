import React, { useState, useEffect, useRef, useCallback } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoFeed from "@/components/Video/VideoFeed";
import VideoRecorder from "@/components/Video/VideoRecorder";
import WelcomeScreen from "@/components/Auth/WelcomeScreen";
import { useToast } from "@/components/ui/use-toast";
import { fetchVideos } from "@/services/videoService";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const { toast } = useToast();

  // Handle first-time users
  useEffect(() => {
    if (localStorage.getItem("hasVisited")) {
      setShowWelcome(false);
    }
  }, []);

  // Fetch initial videos
  useEffect(() => {
    loadMoreVideos();
  }, []);

  const loadMoreVideos = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const newVideos = await fetchVideos("nature", page); // Change query as needed
      if (newVideos.length === 0) {
        setHasMore(false); // No more videos to load
      } else {
        setVideos((prevVideos) => [...prevVideos, ...newVideos]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setLoading(false);
  };

  // Infinite Scroll Observer
  const lastVideoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreVideos();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Handle new recorded video
  const handleVideoReady = (videoBlob: Blob) => {
    const url = URL.createObjectURL(videoBlob);
    const newVideo = {
      id: `video${Date.now()}`,
      url,
      username: "you",
      caption: "My new video #Next-Gen-Videos",
      likes: 0,
      comments: 0,
      isLiked: false,
    };
    setVideos((prevVideos) => [newVideo, ...prevVideos]);
    setIsRecording(false);
    toast({ title: "Video created!", description: "Your video is now live." });
  };

  if (showWelcome) {
    return (
      <WelcomeScreen
        onComplete={() => localStorage.setItem("hasVisited", "true")}
      />
    );
  }

  return (
    <AppLayout className="pb-16">
      <VideoFeed videos={videos} lastVideoRef={lastVideoRef} />
      {loading && <p className="text-center mt-4">Loading more videos...</p>}
      <Button
        onClick={() => setIsRecording(true)}
        className="fixed bottom-24 right-4 px-4 py-3 rounded-full shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 text-white font-semibold"
      >
        <Plus className="h-6 w-6" />
        Create
      </Button>
      {isRecording && (
        <VideoRecorder
          onCancel={() => setIsRecording(false)}
          onVideoReady={handleVideoReady}
        />
      )}
    </AppLayout>
  );
};

export default Index;
