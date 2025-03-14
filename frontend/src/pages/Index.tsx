
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoFeed from "@/components/Video/VideoFeed";
import VideoRecorder from "@/components/Video/VideoRecorder";
import WelcomeScreen from "@/components/Auth/WelcomeScreen";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";

// Mock video data
const MOCK_VIDEOS = [
  {
    id: "video1",
    url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
    username: "fashionista",
    caption: "Silver makeup look for the weekend ✨ #makeup #fashion",
    likes: 1204,
    comments: 24,
    isLiked: false
  },
  {
    id: "video2",
    url: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    username: "naturelover",
    caption: "Spring blooms are here! 🌿 #nature #spring",
    likes: 845,
    comments: 12,
    isLiked: true
  },
  {
    id: "video3",
    url: "https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-1237-large.mp4",
    username: "visualartist",
    caption: "Playing with light and shadows 🌈 #art #visualeffects",
    likes: 2156,
    comments: 43,
    isLiked: false
  }
];

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [videos, setVideos] = useState(MOCK_VIDEOS);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Check if first-time user
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (hasVisited) {
      setShowWelcome(false);
    }
  }, []);
  
  const handleWelcomeComplete = () => {
    localStorage.setItem("hasVisited", "true");
    setShowWelcome(false);
  };
  
  const handleVideoReady = (videoBlob: Blob) => {
    const url = URL.createObjectURL(videoBlob);
    
    // Add the new video to the feed
    const newVideo = {
      id: `video${Date.now()}`,
      url,
      username: "you",
      caption: "My new video #Next-Gen-Videos",
      likes: 0,
      comments: 0,
      isLiked: false
    };
    
    setVideos([newVideo, ...videos]);
    setIsRecording(false);
    
    toast({
      title: "Video created!",
      description: "Your video has been added to the feed.",
    });
  };
  
  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }
  
  return (
    <AppLayout className="pb-16">
      <VideoFeed videos={videos} />
      
      {/* Video recording floating button */}
      <Button
        onClick={() => setIsRecording(true)}
        className="fixed z-30 bottom-20 right-4 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center"
      >
        <Plus className="h-7 w-7" />
      </Button>
      
      {/* Video recorder */}
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
