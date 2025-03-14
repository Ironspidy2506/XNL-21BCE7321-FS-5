
import React, { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, User, Settings, Lock, Bell, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VideoData {
  id: string;
  thumbnailUrl: string;
  views: string;
}

const MOCK_VIDEOS: VideoData[] = [
  {
    id: "vid1",
    thumbnailUrl: "https://images.unsplash.com/photo-1557174059-3a41cdb4f7b9",
    views: "1.3k"
  },
  {
    id: "vid2",
    thumbnailUrl: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd",
    views: "952"
  },
  {
    id: "vid3",
    thumbnailUrl: "https://images.unsplash.com/photo-1661875299662-9dcc9630b89c",
    views: "2.1k"
  },
  {
    id: "vid4",
    thumbnailUrl: "https://images.unsplash.com/photo-1559083131-0b67d66692bd",
    views: "745"
  },
  {
    id: "vid5",
    thumbnailUrl: "https://images.unsplash.com/photo-1512411233342-92208aa0eedf",
    views: "1.8k"
  },
  {
    id: "vid6",
    thumbnailUrl: "https://images.unsplash.com/photo-1526661934280-676cef25bc9b",
    views: "643"
  }
];

const SettingsItem = ({ 
  icon: Icon, 
  label, 
  description, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  description: string;
  onClick?: () => void;
}) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="p-4 bg-white rounded-xl shadow-sm mb-3 cursor-pointer hover:shadow-md transition-shadow duration-300"
  >
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium">{label}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Profile = () => {
  const [activeTab, setActiveTab] = useState("videos");
  
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
              <p className="font-bold">{MOCK_VIDEOS.length}</p>
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
        
        <Tabs defaultValue="videos" onValueChange={setActiveTab} className="w-full">
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
          
          <TabsContent value="videos" className="mt-0">
            {MOCK_VIDEOS.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {MOCK_VIDEOS.map((video) => (
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
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Grid className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No videos yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Your videos will appear here. Start by recording your first video!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <div className="space-y-4">
              <SettingsItem 
                icon={User} 
                label="Account" 
                description="Manage your account information" 
              />
              
              <SettingsItem 
                icon={Lock} 
                label="Privacy & Security" 
                description="Control your privacy settings and data" 
              />
              
              <SettingsItem 
                icon={Bell} 
                label="Notifications" 
                description="Manage your notification preferences" 
              />
              
              <SettingsItem 
                icon={HelpCircle} 
                label="Help & Support" 
                description="Get help and contact support" 
              />
              
              <SettingsItem 
                icon={LogOut} 
                label="Sign Out" 
                description="Sign out of your account" 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
