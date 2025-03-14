import VideoFeed from "@/components/VideoFeed";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-4">Video Feed</h1>
      <VideoFeed />
    </div>
  );
}
