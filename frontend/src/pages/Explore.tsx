import React, { useState, useEffect, useRef, useCallback } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Heart,
  Compass,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface Photo {
  id: string;
  src: { medium: string };
  photographer: string;
}

const API_KEY = "u566iDApuJX0aqOJMTSJvs08XD7o0KP2h5BWsCV3g0OEokopUlh24J1e"; // Replace with your Pexels API Key

const Explore = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("trending"); // Track active tab
  const loaderRef = useRef(null);

  // Function to determine API endpoint based on tab
  const getApiUrl = () => {
    if (activeTab === "trending")
      return `https://api.pexels.com/v1/curated?page=${page}&per_page=10`;
    if (activeTab === "featured")
      return `https://api.pexels.com/v1/search?query=popular&page=${page}&per_page=10`;
    if (activeTab === "discover")
      return `https://api.pexels.com/v1/search?query=random&page=${page}&per_page=10`;
  };

  // Fetch photos from Pexels API
  const fetchPhotos = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(getApiUrl(), {
        headers: { Authorization: API_KEY },
      });
      const data = await response.json();
      setPhotos((prev) =>
        page === 1 ? data.photos : [...prev, ...data.photos]
      ); // Reset on tab switch
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, loading]);

  // Fetch new photos when tab changes
  useEffect(() => {
    setPhotos([]); // Clear photos when switching tabs
    setPage(1);
    fetchPhotos();
  }, [activeTab]);

  // Infinite Scroll: Load more when the observer is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPhotos();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchPhotos]);

  return (
    <AppLayout className="pb-16">
      <div className="p-4">
        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search videos"
              className="pl-9 bg-secondary border-none"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-secondary"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="trending"
          onValueChange={(val) => setActiveTab(val)}
          className="w-full"
        >
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

          {/* Tab Contents */}
          <TabsContent value="trending" className="mt-0">
            <PhotoGrid photos={photos} />
            <div ref={loaderRef} className="text-center py-4">
              {loading && <p>Loading more photos...</p>}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="mt-0">
            <PhotoGrid photos={photos} />
            <div ref={loaderRef} className="text-center py-4">
              {loading && <p>Loading more photos...</p>}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="mt-0">
            <PhotoGrid photos={photos} />
            <div ref={loaderRef} className="text-center py-4">
              {loading && <p>Loading more photos...</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Photo Grid Component
const PhotoGrid = ({ photos }: { photos: Photo[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <motion.div
          key={photo.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="overflow-hidden"
        >
          <div className="relative aspect-[9/16]">
            <img
              src={photo.src.medium}
              alt={`Photo by ${photo.photographer}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="mt-2">
            <p className="font-medium truncate">@{photo.photographer}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Explore;
