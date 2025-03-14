
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X, Check, Timer, Camera, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface VideoRecorderProps {
  onCancel: () => void;
  onVideoReady: (videoBlob: Blob) => void;
}

const VideoRecorder = ({ onCancel, onVideoReady }: VideoRecorderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { toast } = useToast();
  
  const MAX_RECORDING_TIME = 60; // 60 seconds
  
  // Setup camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setIsInitializing(false);
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera Error",
          description: "Unable to access your camera. Please check permissions.",
          variant: "destructive",
        });
        onCancel();
      }
    };
    
    setupCamera();
    
    // Cleanup
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [onCancel, toast]);
  
  // Handle recording timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recordingTime]);
  
  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, { type: "video/mp4" });
      const url = URL.createObjectURL(videoBlob);
      setPreviewURL(url);
      setIsPreviewing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.controls = true;
      }
    };
    
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const discardRecording = () => {
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
    }
    
    setIsPreviewing(false);
    
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.controls = false;
    }
  };
  
  const saveRecording = () => {
    if (chunksRef.current.length === 0) return;
    
    const videoBlob = new Blob(chunksRef.current, { type: "video/mp4" });
    onVideoReady(videoBlob);
  };
  
  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }
    onCancel();
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col z-50 animate-fade-in">
      <div className="flex justify-between items-center p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCancel}
          className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
        
        {isRecording && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-500/20 text-white">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium">
              {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
              {(recordingTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
        
        {!isRecording && !isPreviewing && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {}}
            className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <Upload className="h-5 w-5 mr-2" />
            <span>Upload</span>
          </Button>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        {isInitializing ? (
          <div className="flex flex-col items-center justify-center text-white">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Initializing camera...</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={!isPreviewing}
            className={cn(
              "max-h-[80vh] max-w-full rounded-xl",
              isPreviewing ? "object-contain" : "object-cover"
            )}
          />
        )}
      </div>
      
      <div className="p-6">
        {!isPreviewing ? (
          <div className="flex justify-center items-center">
            <Button
              disabled={isInitializing}
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                isRecording 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-white text-black hover:bg-white/90"
              )}
            >
              {isRecording ? (
                <div className="w-6 h-6 rounded-sm bg-white" />
              ) : (
                <div className="w-6 h-6 rounded-full border-4 border-black" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <Button
              onClick={discardRecording}
              variant="outline"
              className="w-12 h-12 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={saveRecording}
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
            >
              <Check className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
