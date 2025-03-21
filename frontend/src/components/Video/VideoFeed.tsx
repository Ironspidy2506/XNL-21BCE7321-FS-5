import React, { useRef, useEffect, useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VideoData {
  id: string;
  url: string;
  username: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

interface VideoFeedProps {
  videos: VideoData[];
  lastVideoRef: (node: HTMLDivElement | null) => void; // Reference for infinite scrolling
}

const VideoFeed = ({ videos, lastVideoRef }: VideoFeedProps) => {
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.id;
          const videoElement = videoRefs.current[videoId];

          if (!videoElement) return;

          if (entry.isIntersecting) {
            videoElement.play();
            const index = videos.findIndex((video) => video.id === videoId);
            if (index !== -1) setActiveIndex(index);
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.8 }
    );

    Object.keys(videoRefs.current).forEach((videoId) => {
      const videoElement = document.getElementById(videoId);
      if (videoElement) observer.observe(videoElement);
    });

    return () => observer.disconnect();
  }, [videos]);

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <MessageCircle className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No videos yet</h3>
        <p className="text-muted-foreground max-w-md">
          Start by recording your first video or explore content from others.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      {videos.map((video, index) => {
        const isLastVideo = index === videos.length - 1;
        return (
          <motion.div
            key={video.id}
            id={video.id}
            ref={isLastVideo ? lastVideoRef : null} // Attach lastVideoRef
            className="relative h-screen w-full snap-start flex items-center justify-center bg-black"
          >
            <video
              ref={(el) => (videoRefs.current[video.id] = el)}
              src={video.url}
              className="h-full w-full object-contain"
              loop
              muted
              playsInline
              onClick={(e) => {
                const videoEl = e.currentTarget;
                if (videoEl.paused) {
                  videoEl.play();
                } else {
                  videoEl.pause();
                }
              }}
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex justify-between items-end">
                <div className="text-white">
                  <h4 className="font-medium mb-1">@{video.username}</h4>
                  <p className="text-sm text-white/80 line-clamp-2">
                    {video.caption}
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-4 mb-32">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/40",
                      video.isLiked && "text-red-500"
                    )}
                  >
                    <Heart
                      className="h-6 w-6"
                      fill={video.isLiked ? "currentColor" : "none"}
                    />
                    <span className="sr-only">Like</span>
                  </Button>
                  <span className="text-white text-xs font-medium">
                    {video.likes}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/40"
                  >
                    <MessageCircle className="h-6 w-6" />
                    <span className="sr-only">Comment</span>
                  </Button>
                  <span className="text-white text-xs font-medium">
                    {video.comments}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/40"
                  >
                    <Share2 className="h-6 w-6" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default VideoFeed;
