
import React, { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Search, SlidersHorizontal, TrendingUp, Heart, Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VideoCard {
  id: string;
  thumbnailUrl: string;
  duration: string;
  username: string;
  views: string;
}

const MOCK_TRENDING: VideoCard[] = [
  {
    id: "trend1",
    thumbnailUrl: "https://images.unsplash.com/photo-1579156412503-f22426588c38",
    duration: "0:45",
    username: "trendmaker",
    views: "1.2M"
  },
  {
    id: "trend2",
    thumbnailUrl: "https://images.unsplash.com/photo-1494253109108-2e30c049369b",
    duration: "1:30",
    username: "creativeminds",
    views: "845K"
  },
  {
    id: "trend3",
    thumbnailUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
    duration: "0:35",
    username: "musiclovers",
    views: "2.5M"
  },
  {
    id: "trend4",
    thumbnailUrl: "https://images.unsplash.com/photo-1631048501851-4920340a5680",
    duration: "2:10",
    username: "foodguru",
    views: "768K"
  }
];

const MOCK_FEATURED: VideoCard[] = [
  {
    id: "feat1",
    thumbnailUrl: "https://images.unsplash.com/photo-1502230831726-fe5549140034",
    duration: "3:25",
    username: "travelbug",
    views: "432K"
  },
  {
    id: "feat2",
    thumbnailUrl: "https://images.unsplash.com/photo-1527956041665-d7a1b380c460",
    duration: "1:15",
    username: "lifestyleguru",
    views: "321K"
  },
  {
    id: "feat3",
    thumbnailUrl: "https://images.unsplash.com/photo-1661956602116-aa6865609028",
    duration: "0:58",
    username: "techreview",
    views: "567K"
  },
  {
    id: "feat4",
    thumbnailUrl: "https://images.unsplash.com/photo-1531512073830-ba890ca4eba2",
    duration: "2:35",
    username: "fitnesslover",
    views: "1.1M"
  }
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <AppLayout className="pb-16">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search videos" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-none"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-secondary">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="w-full mb-4 bg-secondary/50">
            <TabsTrigger value="trending" className="flex-1">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex-1">
              <Compass className="h-4 w-4 mr-2" />
              Discover
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-0">
            <VideoGrid videos={MOCK_TRENDING} />
          </TabsContent>
          
          <TabsContent value="featured" className="mt-0">
            <VideoGrid videos={MOCK_FEATURED} />
          </TabsContent>
          
          <TabsContent value="discover" className="mt-0">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Compass className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Personalized discovery coming soon</h3>
              <p className="text-muted-foreground max-w-md">
                We're working on analyzing your preferences to suggest videos you'll love.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

const VideoGrid = ({ videos }: { videos: VideoCard[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <motion.div
          key={video.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="video-card overflow-hidden"
        >
          <div className="relative aspect-[9/16]">
            <img 
              src={video.thumbnailUrl} 
              alt={`Video by ${video.username}`}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-xs">
              {video.duration}
            </div>
          </div>
          <div className="mt-2">
            <p className="font-medium truncate">@{video.username}</p>
            <p className="text-xs text-muted-foreground">{video.views} views</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Explore;
