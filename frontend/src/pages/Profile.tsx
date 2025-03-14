import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/Layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, User, Settings } from "lucide-react";
import { motion } from "framer-motion";

const PEXELS_API_KEY =
  "u566iDApuJX0aqOJMTSJvs08XD7o0KP2h5BWsCV3g0OEokopUlh24J1e"; // Store this in .env
const PEXELS_API_URL =
  "https://api.pexels.com/v1/search?query=technology&per_page=6";

interface VideoData {
  id: string;
  thumbnailUrl: string;
  views: string;
}

const Profile = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  // Fetch images from Pexels API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(PEXELS_API_URL, {
          headers: { Authorization: PEXELS_API_KEY },
        });
        const data = await response.json();

        const fetchedVideos = data.photos.map((photo: any, index: number) => ({
          id: `pexels-${index}`,
          thumbnailUrl: photo.src.medium,
          views: `${Math.floor(Math.random() * 2000) + 500} views`,
        }));

        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <AppLayout className="pb-16">
      <div className="p-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-primary/50" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-8 h-8"
            >
              <span className="sr-only">Edit profile</span>
              <span className="text-lg font-bold">+</span>
            </Button>
          </div>

          <h2 className="text-xl font-bold mb-1">You</h2>
          <p className="text-muted-foreground text-sm mb-2">@username</p>

          <div className="flex space-x-6">
            <div className="text-center">
              <p className="font-bold">6</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
            <div className="text-center">
              <p className="font-bold">124</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold">56</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>
        </div>

        {/* Tabs for Videos and Settings */}
        <Tabs
          defaultValue="videos"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-4 bg-secondary/50">
            <TabsTrigger value="videos" className="flex-1">
              <Grid className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="mt-0">
            {loading ? (
              <p className="text-center text-gray-500">Loading videos...</p>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative aspect-[9/16] rounded-lg overflow-hidden"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs">
                      {video.views}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No videos found</div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0">
            <p className="text-center text-gray-500">
              Settings options go here...
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
