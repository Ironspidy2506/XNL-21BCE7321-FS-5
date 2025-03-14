import VideoUpload from "@/components/VideoUpload";

export default function UploadPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <VideoUpload />
    </div>
  );
}
