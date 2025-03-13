import VideoFeed from "@/components/VideoFeed";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Next-Gen Video Sharing 🚀</h1>
      <VideoFeed />
    </main>
  );
}
